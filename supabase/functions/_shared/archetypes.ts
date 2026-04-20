// TODO(cornr): manual sync until a build step is added — if you change one, change both.
// Source of truth: src/content/archetypes.ts. This file exists because Deno Edge Functions
// cannot import from src/. When S3-T1A recommend-products ships, set up a build step to
// generate this file from the canonical src/content/archetypes.ts instead.

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
  motifTooltip: string;
  userLexicon: string[];
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
    version: 3,
    styleCard: {
      formalTerritory: 'Mid-Century Modern',
      eraAnchor: '1950s–1960s Scandinavian and American design',
      materialLexicon: [
        'oiled elm', 'oiled teak', 'beech', 'patinated brass', 'limewash',
        'Ercol', 'G Plan', 'Nathan', 'Carl Hansen', 'HAY', 'Anglepoise',
        'Wishbone chair', 'Söderhamn', 'Hasami', 'Kinto', 'Falcon enamel',
        'paper-cord', 'wool rug', 'Armadillo', 'linen',
        'Farrow & Ball Shaded White', 'Farrow & Ball Setting Plaster',
        'Little Greene Pleat', 'Frama', 'Menu-Audo',
        'vintage pendant', 'string shelving', 'teak sideboard',
        'Anni Albers', 'Josef Frank', 'Wim Crouwel', 'Sugimoto',
        'Earl of East', 'Haeckels', 'Aesop',
        'Modern House', 'Vinterior', 'Narchie', 'twentytwentyone',
        'Dulwich Midcentury Modern Fair', 'Peckham Car Boot',
        'Osmo Polyx', '6 Music', 'Moka pot',
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
      essenceLine: "You're drawn to the long view — a few things held, framed, kept.",
      observationParagraph:
        "Your home takes its time. You'd rather live with a wall you haven't hung yet than fill it fast. The things you own tend to have been made by someone, chosen once, kept on purpose. Empty space isn't missing — it's the room you're leaving for the right thing to arrive.",
      sensoryAnchor:
        'Low morning sun on an oiled wooden arm, worn smooth where hands have rested.',
      behaviouralTruth:
        "You say sorry for the sofa before anyone asks, and you'll defend the one good chair long after it needs it.",
      motifTooltip: 'You frame what matters and leave space around it.',
      userLexicon: [
        'held', 'framed', 'kept', 'worn smooth', 'the right one',
        "we're living with it", 'the bones are good', 'honest',
        'on purpose', 'for now', 'one day', 'the long view',
        "it'll outlive us", 'we went for', 'not perfect',
        'a bit of a project', 'lived-in', 'slowly', 'patient',
        'one good thing', 'worth saving', 'the corner you use most',
      ],
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
    version: 3,
    styleCard: {
      formalTerritory: 'Coastal',
      eraAnchor: 'contemporary New England and UK seaside vernacular',
      materialLexicon: [
        'oatmeal linen', 'washed linen', 'slubby linen', 'brushed cotton',
        'Piglet in Bed', 'H&M Home', 'Dunelm', 'John Lewis',
        'Neptune', 'Daylesford', 'Oliver Bonas',
        'stoneware jug', 'rattan tray', 'wicker basket',
        'Neom', 'Diptyque Figuier', 'M&S Fig', 'MUJI Green Fig',
        'Scandinavian pendant', 'ticking stripe', 'drum shade',
        'Farrow & Ball Skimming Stone', 'Farrow & Ball School House White',
        'warm 2700K bulb', 'table lamp', 'dimmer switch',
        'eucalyptus', 'tulips', 'stocks', 'ranunculus',
        'Welsh blanket', 'knitted throw', 'wool cushion',
        'Seasalt', 'Toast',
        'Cox & Cox', 'Garden Trading',
        'oak dining table', 'sheepskin', 'rattan pendant',
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
      essenceLine: 'You make a place feel like home before the boxes are gone.',
      observationParagraph:
        "Your home gets soft fast. You change the lightbulbs before the pictures go up. You buy flowers every week from wherever you did the food shop, and you've got a jug for them that's travelled through three flats. The kettle's on before the kitchen's done, because the kitchen's done when it feels right, not when it's finished.",
      sensoryAnchor:
        'A lamp at dusk, the smell of supermarket eucalyptus, a kettle finding the boil.',
      behaviouralTruth:
        "You'll apologise for the kitchen to someone who came over to borrow milk, then refuse to budge on nine cushions.",
      motifTooltip: 'You hold a space until it feels like home.',
      userLexicon: [
        'cosy', 'soft', 'warm', 'a proper home', 'lived-in',
        "it just needs...", 'the light in here', 'put the kettle on',
        'sorry about the kitchen', "we'll do it properly eventually",
        "mine's the one with", "I've had this jug since",
        'fluffed', 'made up', 'nested', 'settled',
        'a touch of', 'a bit more', 'feels finished',
        'nice and warm', 'homely', "it's only", 'have a sit down',
      ],
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
    version: 2,
    styleCard: {
      formalTerritory: 'Industrial',
      eraAnchor: 'early 20th century workshop and warehouse vernacular',
      materialLexicon: [
        'raw oak', 'raw ash', 'reclaimed pine', 'scaffold board',
        'steel frame', 'black steel', 'brushed steel', 'mild steel',
        'exposed brick', 'London stock brick', 'concrete', 'poured concrete',
        'cast iron', 'pig iron', 'blacksmith', 'welded',
        'dovetail joint', 'mortise and tenon', 'biscuit joint',
        'Osmo Polyx', 'Danish oil', 'linseed oil', 'beeswax',
        'Workshop of the Telegraph Hill', 'Benchmark Furniture',
        'G & T Ironmongery', 'Anglepoise', 'factory pendant',
        'Eichholtz', 'Tom Raffield',
        'Plumen', 'enamel shade', 'industrial sconce',
        'Kvadrat wool', 'Bute Fabrics',
        'hand-forged', 'machined', 'sawn edge',
        'reclamation yard', 'Salvo', 'joinery offcut',
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
      essenceLine: 'You want to see how a thing is held together.',
      observationParagraph:
        "Your home shows its working. You can see how things are held together — the joints, the fixings, the grain of the wood. Nothing's hidden behind a gloss. You've got a project on the go most of the time, and the half-finished one in the corner isn't a problem — it's the next thing to do.",
      sensoryAnchor:
        'The heft of raw oak, the smell of beeswax, a drill finding its bite.',
      behaviouralTruth:
        "You'll defend the workbench in the living room to anyone who asks, because the living room is where the work is.",
      motifTooltip: "You build what holds, and show how it's held.",
      userLexicon: [
        'built', 'made', 'honest', 'proper', 'solid',
        "how it's held together", 'the bones', 'raw',
        "I'll fix it", 'give me a weekend', 'a proper job',
        'worth the work', 'you can see the joint',
        "it'll last", 'sturdy', 'the real stuff',
        'no hiding it', 'exposed', 'on the go',
        'a good piece of wood', 'the right tool',
        'saves buying it', 'better than new',
      ],
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
    version: 2,
    styleCard: {
      formalTerritory: 'Japandi',
      eraAnchor: 'mid-20th century Japanese interiors crossed with Scandinavian modernism',
      materialLexicon: [
        'soaped oak', 'pale oak', 'Japanese oak', 'white-washed timber',
        'waxed paper', 'washi', 'linen', 'raw cotton',
        'Hasami', 'Kinto', 'Niwaki', 'Native & Co',
        'Muji', 'Toast', 'Margaret Howell', 'Kvadrat',
        'Farrow & Ball Strong White', 'Farrow & Ball School House White',
        'Little Greene French Grey Pale', 'limewash',
        'Frama', 'Menu-Audo', 'Another Country', 'Skagerak',
        'Carl Hansen', 'Maruni Hiroshima', 'Wishbone chair',
        'Global knife', 'Tojiro', 'Japanese knife block',
        'Japanese architectural print', 'Sugimoto print',
        'Cereal magazine', 'Kinfolk',
        'Tattie Isles', 'Piet Oudolf',
        'magnetic knife strip', 'flush handle', 'handle-less',
        'Nordic Knots', 'washed linen bedding',
        'single pendant', 'recessed downlight', 'warm 2700K',
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
      essenceLine: "You'd rather one good thing than four almost-right ones.",
      observationParagraph:
        "Your home is quieter than most. The surfaces stay clear because clear is what you want, not because you haven't got round to it. You put things away the same day you get them. An empty wall isn't unfinished — it's doing its job. You'd wait a year for the right chair and not mind waiting.",
      sensoryAnchor:
        'A bare wooden surface, late sun, the sound of a house with nothing humming.',
      behaviouralTruth:
        "You'll apologise for the bareness to your parents, and quietly defend the empty wall to everyone else.",
      motifTooltip: 'A single gesture, held in stillness.',
      userLexicon: [
        'quiet', 'pared back', 'space to breathe', 'one good thing',
        'put away', 'not yet', 'waiting for', 'the right one',
        'enough', 'clean lines', 'less', 'calm',
        'lighter', 'honest', 'we wanted it to breathe',
        "I don't see the point of", "sorry it's a bit bare",
        'it feels lighter', 'slow', 'undone', 'deliberate',
        'unfinished on purpose', 'room to think',
      ],
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
    version: 2,
    styleCard: {
      formalTerritory: 'French Country',
      eraAnchor: '18th–19th century French provincial interiors',
      materialLexicon: [
        'Matilda Goad', 'H&M Home', 'Zara Home',
        'Oka', 'Oliver Bonas', 'Anthropologie',
        'Farrow & Ball Setting Plaster', 'Farrow & Ball Sulking Room Pink',
        'Farrow & Ball Pink Ground', 'chalky paint',
        'chintz', 'gingham', 'ticking', 'floral', 'toile',
        'block print', 'Liberty print', 'Morris & Co',
        'scalloped lampshade', 'pleated lampshade', 'fringed lampshade',
        'rope-edged bedhead', 'bobble trim', 'frilled cushion',
        'brocante', 'Kempton Park Antiques Market', 'Sunbury Antiques',
        '1stDibs', 'Selency', 'Narchie',
        'Soho Home', 'Piglet in Bed', 'Birdie Fortescue',
        'Susie Watson', 'Cath Kidston',
        'painted iron bed', 'rattan headboard', 'cane bedside',
        'limewash', 'distemper', 'botanical print',
        'Emma Bridgewater', 'transferware',
        'woven jute', 'vintage Persian rug',
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
      essenceLine: 'Where most people stop adding, you keep going.',
      observationParagraph:
        "Your home is layered. Where other people pick a colour, you pick a colour family — five pinks, three florals, a gingham to tie it together. A room isn't done when the furniture's in. It's done when the lampshade's scalloped, the cushion's pleated, and there's a fringe on something that didn't need one.",
      sensoryAnchor:
        'Afternoon light through a softly patterned curtain, tea in a chipped cup.',
      behaviouralTruth:
        "You'll defend the scalloped lampshade to anyone who finds your flat too much — and not apologise once.",
      motifTooltip: 'Soft repetition, layered until it sings.',
      userLexicon: [
        'layered', 'sweet', 'pretty', 'a bit of pattern',
        'I found this', 'from the brocante', 'so pretty',
        'it makes me happy', 'softens the room',
        'more is more', 'a colour family', 'a colour story',
        'romantic', 'old-fashioned in a good way',
        'grandmothery', 'wonky', 'hand-painted',
        'the one with the scallop', 'a little pleat',
        'in the pink room', 'a touch of chintz',
        'warm and a bit ridiculous', 'too much on purpose',
      ],
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
    version: 3,
    styleCard: {
      formalTerritory: 'Eclectic Vintage',
      eraAnchor: 'cross-period vintage — nothing uniform, everything with provenance',
      materialLexicon: [
        'Welsh blanket', 'Melin Tregwynt', 'Turkish rug',
        'Oushak rug', 'Persian runner', 'kilim',
        'Staffordshire dog', 'Staffordshire figurine', 'Toby jug',
        'Victorian wardrobe', 'Ercol', 'Parker Knoll',
        'brass carriage clock', 'samovar', 'taxidermy magpie',
        'Denby Arabesque', 'Portmeirion Botanic Garden',
        'Le Creuset', "Peek Frean's biscuit tin", 'Bodum Chambord',
        'Sue Ryder', 'Oxfam Books', 'Abebooks',
        'Camden Passage', 'Alfies Antique Market', 'Sunbury Antiques',
        'Ardingly Antiques Fair', 'Golborne Road', 'Kempton Park',
        'Hay-on-Wye', 'Scarthin Books', 'Cecil Court',
        'Penguin Modern Classics', 'Virago greens', 'Faber poetry',
        'Paul Nash', 'William De Morgan tile', 'Cecil Beaton',
        'Troika pottery', 'first edition',
        'mahogany sideboard', 'walnut bureau', 'oak dresser',
        'lace runner', 'darned wool', 'foxed paper',
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
      essenceLine: 'Every thing in your home comes with a story you know.',
      observationParagraph:
        "Your home accumulates. A Turkish rug sits next to a Welsh blanket next to a photo of someone's great-aunt — no visual plan, just meaning. You bring things back from house clearances. You pair mismatched figurines because one was your nan's and the other needed a friend. A room is never done, because a life isn't either.",
      sensoryAnchor:
        'The papery smell of old books, a kettle on a hob, afternoon rain at the window.',
      behaviouralTruth:
        "You'll tell a visitor three stories about three objects before you've taken their coat, and mean every word.",
      motifTooltip: "Every piece carries a story, and you'll tell it.",
      userLexicon: [
        'this was my', "there's a story", 'I got this from',
        'it reminded me of', "I've had this since",
        'house clearance', 'charity shop', 'skip find',
        'a story here', 'meant to go', 'kept from',
        'pair them up', 'oddly matching', 'the one with',
        'from nan', 'from my dad', 'inherited',
        'mismatched', 'accumulated', 'not quite finished',
        "I couldn't not", 'a fiver at', 'they let me have it for',
      ],
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
    version: 3,
    styleCard: {
      formalTerritory: 'Urban Contemporary',
      eraAnchor: 'late 20th to early 21st century architectural modernism',
      materialLexicon: [
        'Gubi', 'Gubi Beetle', 'HAY', '&Tradition',
        'Flos', 'Flos IC', 'Serge Mouille', 'Tom Dixon',
        'Vitra', 'Fritz Hansen', 'Muuto', 'Menu',
        'Plykea', 'IKEA METOD hack', 'Formica-faced fronts',
        'handle-less kitchen', 'brass edge pulls',
        'bouclé', 'oxblood leather', 'lacquer', 'lacquered',
        'chrome leg', 'brushed steel', 'brass inlay',
        'Farrow & Ball Preference Red', 'Paint & Paper Library Euphorbia',
        'Plain English', 'Lick',
        'Caesarstone', 'engineered marble', 'quartz composite',
        'Coal Drops Yard', 'twentytwentyone', 'SCP', "Heal's",
        'London Design Festival', 'Salone del Mobile', 'Shoreditch Design Triangle',
        'Slawn print', 'CIRCA edition', 'Saatchi Yates',
        'Wallpaper*', 'Dezeen', 'Plaster', 'Cabana',
        'NTS Radio', 'Boiler Room', 'Sonos Era',
        'Del Maguey mezcal', 'Tutto natural wine',
        'Fellow Ode grinder', 'Moccamaster',
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
      essenceLine: "You'd rather one decisive choice than a room of quieter ones.",
      observationParagraph:
        "Your home is now. The colour on the ceiling is the colour you saw last week and wanted. The sofa you're sitting on won't be there in three years. You read what came out this morning. Every room has one thing that makes the rest look obvious — and that thing is the point.",
      sensoryAnchor:
        'Low light on a lacquered surface, a record playing, a cold glass in hand.',
      behaviouralTruth:
        "You'll defend the chartreuse ceiling with the phrase — it's just paint — and mean exactly the opposite.",
      motifTooltip: 'Where the grid meets a sharper line.',
      userLexicon: [
        'now', 'current', "this year's", 'I saw it and',
        'decisive', 'on purpose', 'a single one', 'editorial',
        'directional', 'the one thing', 'makes the rest look',
        'I chose the colour', 'I did it on the weekend',
        "it's just paint", 'you can always redo it',
        'a bit bold', 'too much is the point',
        'commissioned', 'limited edition', 'picked up in Milan',
        "it'll go in a year", "that's the idea",
      ],
    },
    commercial: {
      text: 'First-time buyers drawn to Urban Contemporary. Invest in architectural fixtures and composed sets over individual decorative pieces. Over-index on lighting and hard surfaces.',
    },
    rewriteNotes:
      "Rewritten 13 Apr. Original behavioural truth 'the view is the painting' was poetry-or-slogan risk per Dr. Okafor. Replaced with embarrassingly specific behaviour — photographing own room from across the street to check the composition reads. Highly Urbanist-specific, gently absurd, recognisable. Sophie persona note 'describing architects not normal people' addressed by 're-stacked someone else's books while pretending to look at the spines' — concrete recognisable behaviour, slightly transgressive, makes Urbanist a real person not a design textbook. 'Small warm objects other people call personality' UNCHANGED — remains the strongest Barnum defence in the set, simultaneously deflects Nester, Romantic, Storyteller, Maker. Blend vocabulary: 'compose a room the way a photographer composes a frame' / 're-stacked someone else's books' / 'photo from across the street to check it reads' are extractable. The 'pulled the room out of register' phrase remains the cushion-detection that's specifically Urbanist.",
  },
};
