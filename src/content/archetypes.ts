/**
 * Cornr archetype content — seven records, three layers each.
 *
 * Produced: 13 April 2026 writing session.
 * Schema: S2-T4-SCHEMA (locked 13 Apr).
 * Critique gate: MEDIUM (6 personas, 3 rounds — Rounds 1-2 creative, Round 3 system-side).
 *
 * LAYER STRUCTURE
 * ───────────────
 * Layer 1 — styleCard: structured machine-facing data.
 *   Consumed by Sprint 3 T1b Haiku rationale generator. Never shown to users.
 *   materialLexicon drives Haiku grounding (trade register, dateable).
 *   qualityLexicon drives Layer 2 user prose (enduring qualities, evergreen).
 *
 * Layer 2 — description: user-facing prose derived from the style card.
 *   Consumed by reveal screen (S2-T4) and share card.
 *   60-110 words. Second person throughout except essence line.
 *   Essence line = declarative fragment with implied subject, works as
 *     "I'm The Curator. [essence line]" AND as observation on reveal screen.
 *   Observation paragraph = behavioural verbs only, at least one negative.
 *   Sensory anchor = qualityLexicon register, not named materials.
 *   Behavioural truth = aphorism-weight closing sting, the dopamine line.
 *
 * Layer 3 — commercial: 25-word trade-register pitch line.
 *   Consumed by Dan deck, brand partner reports. Never appears in the app.
 *   Names the formal territory and describes spending behaviour pattern.
 *
 * VERSIONING
 * ──────────
 * Every record carries a version integer. Increment on any content rewrite.
 * engagement_events.archetype_version logs which version each Haiku call used.
 * Rewrite loop (canonical Section 13 standing rule, 13 Apr): after 100 quiz
 * completions per archetype, compare wishlist_add_rate / share_initiated /
 * retake_rate against the 7-archetype mean. Any archetype >1 stdev below on
 * any metric enters rewrite queue. Rewrite bumps version.
 *
 * REWRITE NOTES
 * ─────────────
 * Each record carries a private rewriteNotes field flagging the weakest seams
 * from the writing session. Read before any rewrite — the notes signpost
 * where the original writing was least confident.
 */

export type ArchetypeId =
  | 'curator'
  | 'nester'
  | 'maker'
  | 'minimalist'
  | 'romantic'
  | 'storyteller'
  | 'urbanist';

export type StyleCard = {
  formalTerritory: string;
  eraAnchor: string;
  materialLexicon: string[];
  qualityLexicon: string[];
  adjacencyMap: {
    neighbour: ArchetypeId;
    differentiator: string;
  }[];
  prohibitedVocabulary: string[];
  behaviouralSignature: string[];
};

export type Description = {
  essenceLine: string;
  observationParagraph: string;
  sensoryAnchor: string;
  behaviouralTruth: string;
};

export type CommercialOneLiner = {
  text: string;
};

export type ArchetypeContent = {
  id: ArchetypeId;
  displayName: string;
  styleTerritory: string;
  accentColour: string;
  version: number;
  styleCard: StyleCard;
  description: Description;
  commercial: CommercialOneLiner;
  /** Private. Never exported to user-facing surfaces. Read before any rewrite. */
  rewriteNotes?: string;
};

export const ARCHETYPES: Record<ArchetypeId, ArchetypeContent> = {
  // ─────────────────────────────────────────────────────────
  // THE CURATOR — Mid-Century Modern
  // ─────────────────────────────────────────────────────────
  curator: {
    id: 'curator',
    displayName: 'The Curator',
    styleTerritory: 'Mid-Century Modern',
    accentColour: '#B8860B',
    version: 1,
    styleCard: {
      formalTerritory: 'Mid-Century Modern',
      eraAnchor: '1950s–1960s Scandinavian and American design',
      materialLexicon: [
        'walnut', 'teak', 'oak', 'brass', 'leather',
        'wool bouclé', 'tapered legs', 'warm whites',
      ],
      qualityLexicon: [
        'warm grain', 'considered restraint', 'honest joinery',
        'proportioned weight', 'quiet authority',
      ],
      adjacencyMap: [
        {
          neighbour: 'minimalist',
          differentiator:
            'Curator honours provenance — wants to know who made the object and when. Minimalist is uninterested in history; the object exists in the present.',
        },
        {
          neighbour: 'urbanist',
          differentiator:
            'Curator is warm and era-anchored. Urbanist is architectural and contemporary — no nostalgia, no wood grain as a virtue.',
        },
      ],
      prohibitedVocabulary: ['cosy', 'maximalist', 'layered', 'eclectic', 'boho'],
      behaviouralSignature: [
        'notice', 'return to', 'pause at', 'choose slowly', 'hold out for',
      ],
    },
    description: {
      essenceLine: 'Choosing slowly, and only when it feels inevitable.',
      observationParagraph:
        "You've walked past the same chair in the shop window four times this month. You'd rather leave a wall empty than fill it with something that almost works — and yes, you know that's a little precious. You notice the grain before the silhouette, the silhouette before the price, and the price only once the first two have said yes.",
      sensoryAnchor:
        'Your rooms come together in warm grain and honest joinery — proportioned weight, pieces that hold their place without shouting, surfaces that reveal the hand that made them.',
      behaviouralTruth:
        "You've rearranged the same three objects on your mantelpiece more times than you'd admit.",
    },
    commercial: {
      text: 'First-time buyers drawn to Mid-Century Modern. Invest in one signature piece over several mediocre ones. Over-index on lighting and seating; under-index on storage.',
    },
    rewriteNotes:
      "Rewritten 13 Apr against identity-copy research. Ratio now ~50% observation / 20% affectionate tension / 30% validation. Behavioural truth moved from validation-flavoured ('you want to know who made it and when') to embarrassingly specific private behaviour ('rearranged the same three objects on your mantelpiece more times than you'd admit'). The 'yes, you know that's a little precious' is the 20% challenge — affectionate friction that proves the app sees you clearly not just kindly. Blend vocabulary: the essence line, 'leave a wall empty for six months than fill it with something that almost works,' and 'rearranged the same three objects' are all extractable as Curator-signature phrases. Barnum defence: 'leave a wall empty for six months' feels wrong for Minimalist (would clear the wall entirely not wait for the right thing) and 'warm grain and honest joinery' feels wrong for Urbanist (would prefer architectural clarity not wood character). Sensory anchor uses quality-language 'warm grain and honest joinery' — adaptable language that bridges naturally into period modifier sentences.",
  },

  // ─────────────────────────────────────────────────────────
  // THE NESTER — Coastal
  // ─────────────────────────────────────────────────────────
  nester: {
    id: 'nester',
    displayName: 'The Nester',
    styleTerritory: 'Coastal',
    accentColour: '#5B9EA6',
    version: 1,
    styleCard: {
      formalTerritory: 'Coastal',
      eraAnchor: 'contemporary New England and UK seaside vernacular',
      materialLexicon: [
        'cotton', 'linen', 'pale wood', 'rattan', 'whitewash',
        'soft blues', 'sand-toned neutrals', 'woven textures',
      ],
      qualityLexicon: [
        'softness', 'lived-in ease', 'pale openness',
        'the light through a window', 'unfussed comfort',
      ],
      adjacencyMap: [
        {
          neighbour: 'romantic',
          differentiator:
            'Nester is informal and daylight-lit. Romantic is layered and atmospheric — patina and faded grandeur where Nester is pale and relaxed.',
        },
        {
          neighbour: 'minimalist',
          differentiator:
            'Nester is soft and welcoming — cotton, rattan, warmth from texture. Minimalist is austere and composed — restraint as discipline, not comfort.',
        },
      ],
      prohibitedVocabulary: ['austere', 'moody', 'formal', 'considered', 'architectural'],
      behaviouralSignature: [
        'settle in', 'soften', 'add a cushion', 'let sit', 'make easy',
      ],
    },
    description: {
      essenceLine: 'Making a place feel lived-in before the boxes are unpacked.',
      observationParagraph:
        "You add another cushion before you add another light. You'd rather a room felt easy than look finished — even when easy means a throw not quite straight, a stack of books that wandered onto a side table and stayed. You notice immediately when someone is trying too hard, and you can usually point to the exact thing pulling the room out of itself.",
      sensoryAnchor:
        'Your rooms come together in softness and pale openness — woven texture, lived-in ease, light that moves across a floor and is allowed to.',
      behaviouralTruth:
        'The room is finished when someone takes their shoes off without asking.',
    },
    commercial: {
      text: 'First-time buyers drawn to Coastal. Invest in soft furnishings and textiles over hard pieces. Over-index on cushions, throws, and lighting; under-index on dining sets.',
    },
    rewriteNotes:
      "Rewritten 13 Apr. Behavioural truth UNCHANGED — Sophie persona explicitly named this as the best line in the set, the embarrassing-specific-but-warm version of the dopamine hit. Observation paragraph gains affectionate tension via 'a throw not quite straight, a stack of books that wandered onto a side table and stayed' — this is the 20% challenge: the slight pride in mess that other archetypes would be embarrassed by. 'Trying too hard' is now anchored to a specific behaviour ('point to the exact thing pulling the room out of itself') so the negative defends against Romantic (composed vignettes) and Urbanist (architectural composition) more concretely. Blend vocabulary: 'add another cushion before you add another light' / 'a throw not quite straight, a stack of books that wandered' / 'takes their shoes off without asking' are all extractable. Barnum defence: 'crumpled, not quite straight, wandered' would feel actively wrong for Minimalist and Urbanist.",
  },

  // ─────────────────────────────────────────────────────────
  // THE MAKER — Industrial
  // ─────────────────────────────────────────────────────────
  maker: {
    id: 'maker',
    displayName: 'The Maker',
    styleTerritory: 'Industrial',
    accentColour: '#8B7355',
    version: 1,
    styleCard: {
      formalTerritory: 'Industrial',
      eraAnchor: 'early 20th century workshop and warehouse vernacular',
      materialLexicon: [
        'blackened steel', 'reclaimed timber', 'exposed brick', 'cast iron',
        'raw concrete', 'leather', 'visible welds', 'workshop finishes',
      ],
      qualityLexicon: [
        'honest making', 'weight and substance', 'the seam that shows',
        'process as decoration', 'unashamed function',
      ],
      adjacencyMap: [
        {
          neighbour: 'urbanist',
          differentiator:
            'Maker venerates craft and process — the weld, the joint, the hand. Urbanist venerates architecture and composition — surfaces are clean, joins are hidden.',
        },
        {
          neighbour: 'storyteller',
          differentiator:
            'Maker values the object that shows how it was built. Storyteller values the object that shows where it has been.',
        },
      ],
      prohibitedVocabulary: ['delicate', 'pretty', 'soft', 'refined', 'pastel'],
      behaviouralSignature: [
        'build', 'keep visible', 'refuse to cover', 'prefer heavy', 'respect the seam',
      ],
    },
    description: {
      essenceLine: 'Respecting the seam that shows how it was built.',
      observationParagraph:
        "You prefer heavy to light and visible to finished. You'd rather see the bolts than have someone hide them — and you've definitely lectured a friend about it once. You pick up an object to feel its weight before you decide if it belongs, and you trust a piece more when you can see how it was made than when it looks like it arrived from a catalogue.",
      sensoryAnchor:
        'Your rooms come together in weight and substance — the seam that shows, surfaces that carry the work in them and do not apologise.',
      behaviouralTruth:
        'You trust what looks like it could be repaired.',
    },
    commercial: {
      text: 'First-time buyers drawn to Industrial. Invest in solid, repairable pieces over high-turnover fashion. Over-index on workshop-grade seating, lighting, and shelving.',
    },
    rewriteNotes:
      "Rewritten 13 Apr. Behavioural truth UNCHANGED — already pitch-perfect, panel-validated, second-strongest line in the set after Nester. Observation paragraph gains affectionate tension via 'you've definitely lectured a friend about it once' — Makers know they get a bit evangelical about craft and the line lets them admit it. This is the 20% challenge that prevents pure validation. Blend vocabulary: 'heavy to light and visible to finished' / 'pick up an object to feel its weight' / 'looks like it could be repaired' are all extractable Maker signatures. Barnum defence: 'lectured a friend about it once' feels wrong for Minimalist (would not lecture anyone about craft, would just remove the offending object) and 'pick up an object to feel its weight' feels wrong for Urbanist (composes by silhouette not by handling).",
  },

  // ─────────────────────────────────────────────────────────
  // THE MINIMALIST — Japandi
  // ─────────────────────────────────────────────────────────
  minimalist: {
    id: 'minimalist',
    displayName: 'The Minimalist',
    styleTerritory: 'Japandi',
    accentColour: '#9CAF88',
    version: 1,
    styleCard: {
      formalTerritory: 'Japandi',
      eraAnchor: 'mid-20th century Japanese interiors crossed with Scandinavian modernism',
      materialLexicon: [
        'raw wood', 'paper', 'stone', 'linen', 'matte ceramic',
        'natural plaster', 'low horizon', 'chalky finishes',
      ],
      qualityLexicon: [
        'stillness', 'breathing room', 'the discipline of less',
        'quiet surfaces', 'the weight of empty space',
      ],
      adjacencyMap: [
        {
          neighbour: 'curator',
          differentiator:
            'Minimalist chooses the thing for what it does now. Curator chooses the thing for what it is and where it came from — provenance matters to Curator, not to Minimalist.',
        },
        {
          neighbour: 'urbanist',
          differentiator:
            'Minimalist restraint is natural and tactile — raw wood, paper, plaster. Urbanist restraint is architectural and hard — glass, concrete, engineered surfaces.',
        },
      ],
      prohibitedVocabulary: ['layered', 'cosy', 'eclectic', 'collected', 'maximalist'],
      behaviouralSignature: [
        'clear', 'remove', 'leave bare', 'resist filling', 'protect the pause',
      ],
    },
    description: {
      essenceLine: 'Protecting the empty space as carefully as the objects in it.',
      observationParagraph:
        "You clear surfaces before you decorate them, and sometimes the cleared surface is the decoration. You'd rather a corner stayed bare than let a nice-enough object take the room it needed. A full room feels louder to you than other people can hear, and you wonder if that makes you difficult company in a flatshare.",
      sensoryAnchor:
        'Your rooms come together in stillness and breathing room — chalky surfaces, the discipline of less, empty space treated with as much care as the objects.',
      behaviouralTruth:
        "You've taken something off a shelf and never put anything back, and the gap still feels right.",
    },
    commercial: {
      text: 'First-time buyers drawn to Japandi. Invest in fewer, higher-quality pieces with longer replacement cycles. Under-index on decorative accents; over-index on primary furniture.',
    },
    rewriteNotes:
      "Rewritten 13 Apr. Original behavioural truth 'the pause is the point' was poetry-or-slogan risk per Dr. Okafor critique. Replaced with concrete embarrassing behaviour — taken something off a shelf and never replaced it, and still thinks the gap is right. Specific, slightly unhinged from outside view, totally familiar from inside view. The 'sometimes you wonder if that makes you difficult company in a flatshare' is the 20% challenge — names the social cost of the disposition without disowning it. Sophie persona note: 'describing architects not normal people' addressed by 'flatshare' anchor and 'nice-enough object' (specifically NOT 'inferior object'). Blend vocabulary: 'clear surfaces before you decorate them' / 'a full room feels louder' / 'taken something off a shelf and never put anything back' are extractable. Barnum defence: 'never put anything back' would feel actively wrong for Curator (would hold out for the right object) and Storyteller (would replace with something with provenance). Sensory anchor unchanged from previous draft — already evergreen quality language.",
  },

  // ─────────────────────────────────────────────────────────
  // THE ROMANTIC — French Country
  // ─────────────────────────────────────────────────────────
  romantic: {
    id: 'romantic',
    displayName: 'The Romantic',
    styleTerritory: 'French Country',
    accentColour: '#C9A9A6',
    version: 1,
    styleCard: {
      formalTerritory: 'French Country',
      eraAnchor: '18th–19th century French provincial interiors',
      materialLexicon: [
        'faded linen', 'aged brass', 'limewash', 'toile',
        'cane', 'carved wood', 'softened florals', 'candlelight finishes',
      ],
      qualityLexicon: [
        'patina', 'atmosphere', 'the imperfection kept on purpose',
        'softness earned over time', 'faded grandeur',
      ],
      adjacencyMap: [
        {
          neighbour: 'nester',
          differentiator:
            'Romantic is atmospheric and layered — candlelight, patina, faded grandeur. Nester is daylight and ease — cotton, rattan, relaxed openness.',
        },
        {
          neighbour: 'storyteller',
          differentiator:
            'Romantic loves the object that has softened with age in one place. Storyteller loves the object that has travelled — different kind of story.',
        },
      ],
      prohibitedVocabulary: ['clean', 'architectural', 'engineered', 'minimal', 'stark'],
      behaviouralSignature: [
        'layer', 'keep the chip', 'choose the worn over the new', 'dim the light', 'let age show',
      ],
    },
    description: {
      essenceLine: 'Keeping the imperfection on purpose, because the imperfection is the point.',
      observationParagraph:
        "You dim the light before you add a candle, and you've definitely lit a candle in the daytime. You would rather a piece showed its age than pretended not to — the chip on the rim, the softened edge, the fade where the sun has been hitting it for years. You layer what other people would edit, and you notice when a room has been tidied into blankness.",
      sensoryAnchor:
        'Your rooms come together in patina and atmosphere — softness earned over time, surfaces that have lived long enough to stop performing.',
      behaviouralTruth:
        'You would buy the piece with the crack.',
    },
    commercial: {
      text: 'First-time buyers drawn to French Country. Invest in secondhand, vintage, and aged finishes over new-condition goods. Over-index on lighting, textiles, and tabletop.',
    },
    rewriteNotes:
      "Rewritten 13 Apr. Behavioural truth UNCHANGED — strongest single-line Barnum defence in the set, would feel wrong for every other archetype. Observation paragraph gains affectionate tension via 'you've definitely lit a candle in the daytime' — names a slightly precious behaviour Romantics actually do and other people would tease them about. This is the 20% challenge that prevents pure flattery. 'Tidied into blankness' is the surgical Barnum phrase defending against Minimalist and Urbanist. Blend vocabulary: 'dim the light before you add a candle' / 'lit a candle in the daytime' / 'tidied into blankness' / 'buy the piece with the crack' are all extractable. Period bridge note: 'softness earned over time' bridges naturally into period modifier sentences acknowledging Victorian/Georgian fabric and finish.",
  },

  // ─────────────────────────────────────────────────────────
  // THE STORYTELLER — Eclectic Vintage
  // ─────────────────────────────────────────────────────────
  storyteller: {
    id: 'storyteller',
    displayName: 'The Storyteller',
    styleTerritory: 'Eclectic Vintage',
    accentColour: '#A67B5B',
    version: 1,
    styleCard: {
      formalTerritory: 'Eclectic Vintage',
      eraAnchor: 'cross-period vintage — nothing uniform, everything with provenance',
      materialLexicon: [
        'velvet', 'patterned tile', 'painted wood', 'mixed metals',
        'woven textiles from elsewhere', 'carved frames', 'colour blocks', 'inherited pieces',
      ],
      qualityLexicon: [
        'accumulated meaning', 'the object brought back from somewhere',
        'contrast as composition', 'layers of elsewhere', 'rooms that hold a history',
      ],
      adjacencyMap: [
        {
          neighbour: 'maker',
          differentiator:
            "Storyteller collects things that carry other people's history. Maker builds things that carry their own — different source of authenticity.",
        },
        {
          neighbour: 'romantic',
          differentiator:
            "Storyteller accumulates across places and periods. Romantic accumulates across time in one place — Romantic's patina is earned, Storyteller's patina is imported.",
        },
      ],
      prohibitedVocabulary: ['minimal', 'architectural', 'engineered', 'spare', 'matching'],
      behaviouralSignature: [
        'collect', 'bring back', 'place deliberately', 'keep the mismatch', 'tell the story',
      ],
    },
    description: {
      essenceLine: 'Bringing things back from places, and keeping the mismatch.',
      observationParagraph:
        "You place an object where it can tell its own story, and you've moved a sofa once to make a found thing work. You'd rather a room held six things you remember buying than sixty that arrived in a van. You keep the mismatch on purpose — the mismatch is where the room comes alive.",
      sensoryAnchor:
        'Your rooms come together in contrast and accumulated meaning — layers of elsewhere, the object brought back from somewhere, rooms that hold a history by design.',
      behaviouralTruth:
        "You have at least one item with a story you've told more times than you'd admit.",
    },
    commercial: {
      text: 'First-time buyers drawn to Eclectic Vintage. Invest in secondhand, travel-acquired, and inherited pieces over matched-set retail. Over-index on decorative accents and art.',
    },
    rewriteNotes:
      "Rewritten 13 Apr. Sophie persona note: previous draft 'sounded cool but I wouldn't know if I was one' — too aspirational, not specific enough to catch. Fix: ground the observation in 'you've moved a sofa once to make a found thing work' which is a recognisable concrete behaviour. Behavioural truth replaced — 'an item with a story you've told more times than you'd admit' is the embarrassingly specific private behaviour every Storyteller does and would only admit if caught. Previous 'every room has at least one thing that came from somewhere else' was inclusive but generic; new version is recognisable AND embarrassing. Blend vocabulary: 'keeping the mismatch' / 'six things you remember buying than sixty that arrived together in a van' / 'an item with a story you've told more times than you'd admit' are extractable. Barnum defence: 'told more times than you'd admit' would feel actively wrong for Minimalist (would not have stories about objects) and Urbanist (would not put an object's story above its silhouette).",
  },

  // ─────────────────────────────────────────────────────────
  // THE URBANIST — Urban Contemporary
  // ─────────────────────────────────────────────────────────
  urbanist: {
    id: 'urbanist',
    displayName: 'The Urbanist',
    styleTerritory: 'Urban Contemporary',
    accentColour: '#708090',
    version: 1,
    styleCard: {
      formalTerritory: 'Urban Contemporary',
      eraAnchor: 'late 20th to early 21st century architectural modernism',
      materialLexicon: [
        'concrete', 'glass', 'blackened metal', 'engineered stone',
        'matte black', 'polished surfaces', 'sharp edges', 'monochrome palette',
      ],
      qualityLexicon: [
        'architectural clarity', 'composed silhouettes', 'negative space as feature',
        'edges held clean', 'the view as the decoration',
      ],
      adjacencyMap: [
        {
          neighbour: 'minimalist',
          differentiator:
            'Urbanist restraint is architectural and hard — engineered surfaces, sharp edges. Minimalist restraint is natural and tactile — raw wood, paper, plaster.',
        },
        {
          neighbour: 'maker',
          differentiator:
            'Urbanist hides the join — surfaces are clean, seams are resolved. Maker celebrates the seam — the weld, the joint, the visible process.',
        },
      ],
      prohibitedVocabulary: ['cosy', 'rustic', 'faded', 'worn', 'layered'],
      behaviouralSignature: [
        'compose', 'hold the line', 'frame the view', 'resist the soft', 'refuse the clutter',
      ],
    },
    description: {
      essenceLine: 'Holding the line where everyone else gives in to soft.',
      observationParagraph:
        "You compose a room the way a photographer composes a frame, and you've re-stacked someone else's books while pretending to look at the spines. You'd rather a shelf stayed empty than fill it with the small warm objects other people call personality. You notice when a cushion has pulled the room out of register.",
      sensoryAnchor:
        'Your rooms come together in architectural clarity and composed silhouettes — edges held clean, negative space as feature, the view through the window treated as the painting.',
      behaviouralTruth:
        "You've taken a photo of your own room from across the street to check that it reads.",
    },
    commercial: {
      text: 'First-time buyers drawn to Urban Contemporary. Invest in architectural fixtures and composed sets over individual decorative pieces. Over-index on lighting and hard surfaces.',
    },
    rewriteNotes:
      "Rewritten 13 Apr. Original behavioural truth 'the view is the painting' was poetry-or-slogan risk per Dr. Okafor. Replaced with embarrassingly specific behaviour — photographing own room from across the street to check the composition reads. Highly Urbanist-specific, gently absurd, recognisable. Sophie persona note 'describing architects not normal people' addressed by 're-stacked someone else's books while pretending to look at the spines' — concrete recognisable behaviour, slightly transgressive, makes Urbanist a real person not a design textbook. 'Small warm objects other people call personality' UNCHANGED — remains the strongest Barnum defence in the set, simultaneously deflects Nester, Romantic, Storyteller, Maker. Blend vocabulary: 'compose a room the way a photographer composes a frame' / 're-stacked someone else's books' / 'photo from across the street to check it reads' are extractable. The 'pulled the room out of register' phrase remains the cushion-detection that's specifically Urbanist.",
  },
};
