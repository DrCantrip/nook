// generate-share-insight — first Edge Function in the Cornr codebase.
// Precedent-setter for recommend-products (S3-T1A) and every future Edge Function.
// Patterns established here: Deno runtime, pinned imports, CORS via _shared,
// JWT-scoped client for user reads + service-role client for service writes,
// composite cache keys with archetype version, voice-gate validation, fallback path.
//
// Reference: canonical Section 7 (Sprint 2 T4-INSIGHT), Section 6 (schema),
// Section 13 (archetype rewrite loop standing rule — cache invalidation contract).

// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.27.3";

import { corsHeaders } from "../_shared/cors.ts";
import { ARCHETYPES, type ArchetypeId } from "../_shared/archetypes.ts";
import { buildBlendPrompt } from "../_shared/prompts.ts";
import { validateInsight } from "../_shared/voice-gate.ts";

const MODEL_VERSION = "claude-haiku-4-5";
const SECONDARY_THRESHOLD = 0.15;
const TERTIARY_MIN = 0.10;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

serve(async (req) => {
  // 1. CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Auth check — JWT-scoped client respects RLS automatically.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing authorization" }, 401);
    }

    const supabaseUserClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();
    if (userError || !user) {
      return jsonResponse({ error: "Invalid token" }, 401);
    }

    // Service-role client for writes that bypass RLS (cache + engagement_events).
    const supabaseServiceRole = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 3. Input validation
    const body = await req.json().catch(() => null);
    const user_id = body?.user_id;
    if (!user_id || typeof user_id !== "string") {
      return jsonResponse({ error: "Missing or invalid user_id" }, 400);
    }
    if (user_id !== user.id) {
      return jsonResponse({ error: "Cannot generate insight for another user" }, 403);
    }

    // 4. Read user data — latest archetype_history row.
    const { data: history, error: historyError } = await supabaseUserClient
      .from("archetype_history")
      .select("primary_archetype, secondary_archetype, archetype_scores, recorded_at")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .single();

    if (historyError || !history) {
      return jsonResponse({ error: "No quiz completion found" }, 404);
    }

    const { data: userRow } = await supabaseUserClient
      .from("users")
      .select("property_period")
      .eq("id", user.id)
      .single();
    const propertyPeriod: string | null = userRow?.property_period ?? null;

    // 5. Derive score vector — graceful degradation for pre-S2-T3B rows.
    let scoreVector: Record<string, number> = history.archetype_scores ?? {};
    if (!scoreVector || Object.keys(scoreVector).length === 0) {
      console.warn("Empty archetype_scores — synthesising from primary/secondary labels (pre-S2-T3B row)");
      scoreVector = {
        [history.primary_archetype]: 0.7,
        ...(history.secondary_archetype ? { [history.secondary_archetype]: 0.3 } : {}),
      };
    }

    // 6. Identify involved archetypes.
    const sortedEntries = Object.entries(scoreVector)
      .filter(([id]) => id in ARCHETYPES)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    if (sortedEntries.length === 0) {
      return jsonResponse({ error: "No valid archetype scores" }, 500);
    }

    const primaryId = sortedEntries[0][0] as ArchetypeId;
    const secondaryIds = sortedEntries
      .slice(1)
      .filter(([, score]) => score >= SECONDARY_THRESHOLD)
      .map(([id]) => id as ArchetypeId)
      .sort();
    const tertiaryIds = sortedEntries
      .slice(1)
      .filter(([, score]) => score >= TERTIARY_MIN && score < SECONDARY_THRESHOLD)
      .map(([id]) => id as ArchetypeId)
      .sort();

    const involvedIds: ArchetypeId[] = [primaryId, ...secondaryIds, ...tertiaryIds];
    const involvedArchetypesContent = Object.fromEntries(
      involvedIds.map((id) => {
        const a = ARCHETYPES[id];
        // Strip rewriteNotes — internal-only, never goes to Haiku.
        const { rewriteNotes: _rn, ...publicFields } = a;
        return [id, publicFields];
      }),
    );

    // 7. Composite cache key — version-pinned per archetype for rewrite loop.
    const keyParts = [
      `${primaryId}v${ARCHETYPES[primaryId].version}`,
      ...secondaryIds.map((id) => `${id}v${ARCHETYPES[id].version}`),
    ];
    const cacheKey = `insight:${user.id}:${keyParts.join(":")}`;

    // 8. Cache check.
    const { data: cached } = await supabaseUserClient
      .from("recommendation_cache")
      .select("response, expires_at")
      .eq("cache_key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (cached?.response?.insight) {
      await logEngagement(supabaseServiceRole, user.id, {
        event_type: "insight_generated",
        payload: {
          primary_archetype: primaryId,
          secondary_archetypes: secondaryIds,
          cache_key: cacheKey,
          fallback_used: false,
          cached: true,
        },
        archetype_version: ARCHETYPES[primaryId].version,
      });

      return jsonResponse({
        insight: cached.response.insight,
        cached: true,
        model_version: MODEL_VERSION,
      }, 200);
    }

    // 9. Haiku call.
    const anthropic = new Anthropic({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
    });

    const promptArgs = {
      scoreVector,
      primaryId,
      secondaryIds,
      tertiaryIds,
      archetypesContent: involvedArchetypesContent,
      propertyPeriod,
    };

    let insightText = "";
    let fallbackUsed = false;

    try {
      const first = await anthropic.messages.create({
        model: MODEL_VERSION,
        max_tokens: 300,
        messages: [{ role: "user", content: buildBlendPrompt(promptArgs) }],
      });
      insightText = first.content[0]?.type === "text"
        ? first.content[0].text.trim()
        : "";
    } catch (err) {
      console.error("Haiku first call failed:", err);
    }

    const involvedForGate = involvedIds.map((id) => ({
      description: ARCHETYPES[id].description,
    }));

    let validation = validateInsight(insightText, involvedForGate);

    // 10. Retry with stricter prompt on first failure.
    if (!validation.valid) {
      console.warn("First generation failed validation:", validation.reason);
      const retryPrompt = buildBlendPrompt(promptArgs) +
        "\n\nIMPORTANT: Previous output failed validation. Compress to 60-100 words, extract at least one 6-word phrase verbatim from the archetype descriptions provided, and avoid all banned vocabulary.";

      try {
        const retry = await anthropic.messages.create({
          model: MODEL_VERSION,
          max_tokens: 300,
          messages: [{ role: "user", content: retryPrompt }],
        });
        const retryText = retry.content[0]?.type === "text"
          ? retry.content[0].text.trim()
          : "";
        const retryValidation = validateInsight(retryText, involvedForGate);
        if (retryValidation.valid) {
          insightText = retryText;
          validation = retryValidation;
        } else {
          console.warn("Retry failed validation:", retryValidation.reason);
        }
      } catch (err) {
        console.error("Haiku retry failed:", err);
      }
    }

    // 11. Fallback — deterministic single-archetype reveal.
    if (!validation.valid) {
      console.error("Both generations failed, using fallback:", validation.reason);
      const primary = ARCHETYPES[primaryId];
      insightText =
        `You are ${primary.displayName}. ${primary.description.essenceLine} ${primary.description.behaviouralTruth}`;
      fallbackUsed = true;
    }

    // 12. Cache write + engagement log.
    const response = {
      insight: insightText,
      model_version: MODEL_VERSION,
      generated_at: new Date().toISOString(),
    };

    await supabaseServiceRole.from("recommendation_cache").upsert({
      cache_key: cacheKey,
      response,
      model_version: MODEL_VERSION,
      expires_at: new Date(Date.now() + CACHE_TTL_MS).toISOString(),
    });

    await logEngagement(supabaseServiceRole, user.id, {
      event_type: "insight_freshly_generated",
      payload: {
        primary_archetype: primaryId,
        secondary_archetypes: secondaryIds,
        cache_key: cacheKey,
        fallback_used: fallbackUsed,
        cached: false,
      },
      archetype_version: ARCHETYPES[primaryId].version,
    });

    // 13. Response.
    return jsonResponse({
      insight: insightText,
      cached: false,
      model_version: MODEL_VERSION,
    }, 200);
  } catch (error) {
    console.error("generate-share-insight error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});

// ── helpers ──────────────────────────────────────────────

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function logEngagement(
  client: any,
  userId: string,
  opts: {
    event_type: string;
    payload: Record<string, unknown>;
    archetype_version: number;
  },
) {
  const { error } = await client.from("engagement_events").insert({
    user_id: userId,
    event_type: opts.event_type,
    event_data: opts.payload,
    archetype_version: opts.archetype_version,
  });
  if (error) {
    console.warn("engagement_events write failed (non-fatal):", error);
  }
}
