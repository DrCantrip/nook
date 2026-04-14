// Standard CORS headers for Cornr Edge Functions.
// Every Edge Function imports from this. Do not duplicate.
// Precedent set by generate-share-insight (S2-T4-INSIGHT) on 13 Apr 2026.

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
