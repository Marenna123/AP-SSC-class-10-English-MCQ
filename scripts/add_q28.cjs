const fs = require('fs');
const path = require('path');

const bankPath = path.join(__dirname, '../src/data/official_ap_ssc_bank.json');
const currentBank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

// Verify existing sections
if (!currentBank.poems || currentBank.poems.length !== 10) {
  console.error('Expected 10 poems, found:', currentBank.poems ? currentBank.poems.length : 0);
  process.exit(1);
}
if (!currentBank.prose || currentBank.prose.length !== 7) {
  console.error('Expected 7 prose lessons, found:', currentBank.prose ? currentBank.prose.length : 0);
  process.exit(1);
}
if (!currentBank.grammar || currentBank.grammar.length !== 10) {
  console.error('Expected 10 grammar topics, found:', currentBank.grammar ? currentBank.grammar.length : 0);
  process.exit(1);
}
if (!currentBank.vocabulary || currentBank.vocabulary.length < 1) {
  console.error('Expected at least 1 vocabulary topic (Q27 Synonyms), found:', currentBank.vocabulary ? currentBank.vocabulary.length : 0);
  process.exit(1);
}

const q28Data = {
  "question_number": "Q28",
  "title": "Antonyms",
  "subject": "AP SSC Class 10 English 2026–27",
  "total_questions": 50,
  "difficulty_distribution": {
    "Simple": 20,
    "Medium": 20,
    "Difficult": 10
  },
  "format": "Paragraph with an underlined target word and a six-word antonym box.",
  "source_basis": "Vocabulary based on words appearing in the Class 10 English lessons; Q28 follows the paragraph-and-word-box vocabulary format.",
  "questions": [
    {
      "id": 1,
      "question": "Choose the antonym of the underlined word “hopeful”.",
      "paragraph": "Lencho was hopeful when the rain began, but the hailstorm destroyed his crop and left him helpless.",
      "underlined_word": "hopeful",
      "word_box": [
        "hopeless",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "hopeless"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The antonym of “hopeful” is “hopeless”."
    },
    {
      "id": 2,
      "question": "Choose the antonym of the underlined word “moved”.",
      "paragraph": "The postmaster was moved by Lencho's faith and decided to help him.",
      "underlined_word": "moved",
      "word_box": [
        "indifferent",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "indifferent"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The antonym of “moved” is “indifferent”."
    },
    {
      "id": 3,
      "question": "Choose the antonym of the underlined word “convinced”.",
      "paragraph": "Lencho was convinced that God would answer his request.",
      "underlined_word": "convinced",
      "word_box": [
        "doubtful",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "doubtful",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The antonym of “convinced” is “doubtful”."
    },
    {
      "id": 4,
      "question": "Choose the antonym of the underlined word “terrified”.",
      "paragraph": "The young seagull was terrified to fly, but hunger forced him to try.",
      "underlined_word": "terrified",
      "word_box": [
        "brave",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "brave",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The antonym of “terrified” is “brave”."
    },
    {
      "id": 5,
      "question": "Choose the antonym of the underlined word “encouraged”.",
      "paragraph": "The seagull's parents encouraged him while he struggled with fear.",
      "underlined_word": "encouraged",
      "word_box": [
        "discouraged",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "discouraged"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The antonym of “encouraged” is “discouraged”."
    },
    {
      "id": 6,
      "question": "Choose the antonym of the underlined word “anxious”.",
      "paragraph": "The pilot was anxious when the storm appeared, but another aeroplane guided him safely.",
      "underlined_word": "anxious",
      "word_box": [
        "calm",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "calm",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Simple",
      "explanation": "The antonym of “anxious” is “calm”."
    },
    {
      "id": 7,
      "question": "Choose the antonym of the underlined word “true”.",
      "paragraph": "Anne recorded her thoughts in her diary because she wanted a true friend.",
      "underlined_word": "true",
      "word_box": [
        "false",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "false"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The antonym of “true” is “false”."
    },
    {
      "id": 8,
      "question": "Choose the antonym of the underlined word “lonely”.",
      "paragraph": "Anne felt lonely although she was surrounded by classmates.",
      "underlined_word": "lonely",
      "word_box": [
        "cheerful",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "cheerful",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The antonym of “lonely” is “cheerful”."
    },
    {
      "id": 9,
      "question": "Choose the antonym of the underlined word “fascinated”.",
      "paragraph": "Rajvir was fascinated by the tea gardens and scenery of Assam.",
      "underlined_word": "fascinated",
      "word_box": [
        "bored",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "bored"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The antonym of “fascinated” is “bored”."
    },
    {
      "id": 10,
      "question": "Choose the antonym of the underlined word “welcomed”.",
      "paragraph": "Pranjol welcomed Rajvir and explained the history of tea cultivation.",
      "underlined_word": "welcomed",
      "word_box": [
        "rejected",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "rejected",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The antonym of “welcomed” is “rejected”."
    },
    {
      "id": 11,
      "question": "Choose the antonym of the underlined word “curious”.",
      "paragraph": "Valli was curious about the bus journey and carefully observed everything outside.",
      "underlined_word": "curious",
      "word_box": [
        "indifferent",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "indifferent",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The antonym of “curious” is “indifferent”."
    },
    {
      "id": 12,
      "question": "Choose the antonym of the underlined word “friendly”.",
      "paragraph": "The conductor was friendly and tried to make Valli comfortable during the ride.",
      "underlined_word": "friendly",
      "word_box": [
        "hostile",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "hostile",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Simple",
      "explanation": "The antonym of “friendly” is “hostile”."
    },
    {
      "id": 13,
      "question": "Choose the antonym of the underlined word “sorrow”.",
      "paragraph": "The Buddha taught Kisa Gotami that sorrow is common to all who are born.",
      "underlined_word": "sorrow",
      "word_box": [
        "joy",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "joy",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The antonym of “sorrow” is “joy”."
    },
    {
      "id": 14,
      "question": "Choose the antonym of the underlined word “understood”.",
      "paragraph": "Kisa Gotami understood the truth after visiting many houses and seeing death touch every family.",
      "underlined_word": "understood",
      "word_box": [
        "misunderstood",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "misunderstood"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The antonym of “understood” is “misunderstood”."
    },
    {
      "id": 15,
      "question": "Choose the antonym of the underlined word “calm”.",
      "paragraph": "The sermon helped Kisa Gotami become calm and accept the reality of death.",
      "underlined_word": "calm",
      "word_box": [
        "agitated",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "agitated",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The antonym of “calm” is “agitated”."
    },
    {
      "id": 16,
      "question": "Choose the antonym of the underlined word “quietly”.",
      "paragraph": "The invisible man entered the shop quietly and frightened the shopkeeper.",
      "underlined_word": "quietly",
      "word_box": [
        "loudly",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "loudly"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The antonym of “quietly” is “loudly”."
    },
    {
      "id": 17,
      "question": "Choose the antonym of the underlined word “clever”.",
      "paragraph": "Griffin was clever but used his discovery for selfish purposes.",
      "underlined_word": "clever",
      "word_box": [
        "foolish",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "foolish",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The antonym of “clever” is “foolish”."
    },
    {
      "id": 18,
      "question": "Choose the antonym of the underlined word “escaped”.",
      "paragraph": "The invisible man escaped from the police using his unusual ability.",
      "underlined_word": "escaped",
      "word_box": [
        "remained",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "remained",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The antonym of “escaped” is “remained”."
    },
    {
      "id": 19,
      "question": "Choose the antonym of the underlined word “calm”.",
      "paragraph": "Ausable remained calm when Max threatened him and invented a story.",
      "underlined_word": "calm",
      "word_box": [
        "agitated",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "agitated",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The antonym of “calm” is “agitated”."
    },
    {
      "id": 20,
      "question": "Choose the antonym of the underlined word “surprised”.",
      "paragraph": "Fowler was surprised by Ausable's calm behaviour during the dangerous situation.",
      "underlined_word": "surprised",
      "word_box": [
        "unimpressed",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "unimpressed",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Simple",
      "explanation": "The antonym of “surprised” is “unimpressed”."
    },
    {
      "id": 21,
      "question": "Choose the antonym of the underlined word “respectable”.",
      "paragraph": "Horace Danby was a respectable-looking man who secretly robbed houses.",
      "underlined_word": "respectable",
      "word_box": [
        "dishonourable",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "dishonourable",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The antonym of “respectable” is “dishonourable”."
    },
    {
      "id": 22,
      "question": "Choose the antonym of the underlined word “expert”.",
      "paragraph": "Horace was an expert lock-picker but was eventually trapped by a woman.",
      "underlined_word": "expert",
      "word_box": [
        "novice",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "novice",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Medium",
      "explanation": "The antonym of “expert” is “novice”."
    },
    {
      "id": 23,
      "question": "Choose the antonym of the underlined word “dishonest”.",
      "paragraph": "Hari Singh was dishonest at first, but Anil's kindness gradually changed him.",
      "underlined_word": "dishonest",
      "word_box": [
        "honest",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "honest",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Medium",
      "explanation": "The antonym of “dishonest” is “honest”."
    },
    {
      "id": 24,
      "question": "Choose the antonym of the underlined word “trusted”.",
      "paragraph": "Anil trusted Hari and gave him opportunities to learn reading and writing.",
      "underlined_word": "trusted",
      "word_box": [
        "doubted",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "doubted",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Medium",
      "explanation": "The antonym of “trusted” is “doubted”."
    },
    {
      "id": 25,
      "question": "Choose the antonym of the underlined word “clever”.",
      "paragraph": "Ausable devised a clever trick and made Max believe the balcony existed.",
      "underlined_word": "clever",
      "word_box": [
        "foolish",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "foolish",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The antonym of “clever” is “foolish”."
    },
    {
      "id": 26,
      "question": "Choose the antonym of the underlined word “curious”.",
      "paragraph": "Richard Ebright was curious about butterflies and conducted careful experiments.",
      "underlined_word": "curious",
      "word_box": [
        "indifferent",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "indifferent",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Medium",
      "explanation": "The antonym of “curious” is “indifferent”."
    },
    {
      "id": 27,
      "question": "Choose the antonym of the underlined word “encouraged”.",
      "paragraph": "Ebright's mother encouraged his scientific interests and supported his work.",
      "underlined_word": "encouraged",
      "word_box": [
        "discouraged",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "discouraged",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Medium",
      "explanation": "The antonym of “encouraged” is “discouraged”."
    },
    {
      "id": 28,
      "question": "Choose the antonym of the underlined word “increased”.",
      "paragraph": "The book that inspired Ebright increased his knowledge about butterflies.",
      "underlined_word": "increased",
      "word_box": [
        "reduced",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "reduced",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Medium",
      "explanation": "The antonym of “increased” is “reduced”."
    },
    {
      "id": 29,
      "question": "Choose the antonym of the underlined word “struggle”.",
      "paragraph": "The trees seemed to struggle against the walls as they moved towards the forest.",
      "underlined_word": "struggle",
      "word_box": [
        "rest",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "rest",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Medium",
      "explanation": "The antonym of “struggle” is “rest”."
    },
    {
      "id": 30,
      "question": "Choose the antonym of the underlined word “quietly”.",
      "paragraph": "The poet describes the moon as moving quietly through the night sky.",
      "underlined_word": "quietly",
      "word_box": [
        "noisily",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "noisily",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Medium",
      "explanation": "The antonym of “quietly” is “noisily”."
    },
    {
      "id": 31,
      "question": "Choose the antonym of the underlined word “confined”.",
      "paragraph": "The tiger was confined to a cage and could not roam freely in the forest.",
      "underlined_word": "confined",
      "word_box": [
        "free",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "free",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Medium",
      "explanation": "The antonym of “confined” is “free”."
    },
    {
      "id": 32,
      "question": "Choose the antonym of the underlined word “brilliant”.",
      "paragraph": "The tiger ignores the visitors and stares at the brilliant stars at night.",
      "underlined_word": "brilliant",
      "word_box": [
        "dull",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "dull"
      },
      "correct_answer": "D",
      "difficulty": "Medium",
      "explanation": "The antonym of “brilliant” is “dull”."
    },
    {
      "id": 33,
      "question": "Choose the antonym of the underlined word “destroy”.",
      "paragraph": "The poet suggests that fire and ice can both destroy the world.",
      "underlined_word": "destroy",
      "word_box": [
        "create",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "create",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The antonym of “destroy” is “create”."
    },
    {
      "id": 34,
      "question": "Choose the antonym of the underlined word “change”.",
      "paragraph": "The poet sees snow as something that can bring a change in mood.",
      "underlined_word": "change",
      "word_box": [
        "preserve",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "preserve",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Medium",
      "explanation": "The antonym of “change” is “preserve”."
    },
    {
      "id": 35,
      "question": "Choose the antonym of the underlined word “silently”.",
      "paragraph": "Fog arrives silently and leaves without making a sound.",
      "underlined_word": "silently",
      "word_box": [
        "noisily",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "noisily",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The antonym of “silently” is “noisily”."
    },
    {
      "id": 36,
      "question": "Choose the antonym of the underlined word “loss”.",
      "paragraph": "The ball's loss teaches the boy that possessions can be lost and life must continue.",
      "underlined_word": "loss",
      "word_box": [
        "gain",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "gain",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The antonym of “loss” is “gain”."
    },
    {
      "id": 37,
      "question": "Choose the antonym of the underlined word “cowardly”.",
      "paragraph": "The dragon appeared cowardly to others, but later showed great courage.",
      "underlined_word": "cowardly",
      "word_box": [
        "brave",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "brave"
      },
      "correct_answer": "D",
      "difficulty": "Medium",
      "explanation": "The antonym of “cowardly” is “brave”."
    },
    {
      "id": 38,
      "question": "Choose the antonym of the underlined word “freedom”.",
      "paragraph": "Amanda longs for freedom and imagines herself in a peaceful world.",
      "underlined_word": "freedom",
      "word_box": [
        "prison",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "prison",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Medium",
      "explanation": "The antonym of “freedom” is “prison”."
    },
    {
      "id": 39,
      "question": "Choose the antonym of the underlined word “constant”.",
      "paragraph": "The poet criticises the habit of giving constant instructions to a child.",
      "underlined_word": "constant",
      "word_box": [
        "occasional",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "occasional",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The antonym of “constant” is “occasional”."
    },
    {
      "id": 40,
      "question": "Choose the antonym of the underlined word “calm”.",
      "paragraph": "The speaker admires animals because they are calm and self-contained.",
      "underlined_word": "calm",
      "word_box": [
        "restless",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "restless",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The antonym of “calm” is “restless”."
    },
    {
      "id": 41,
      "question": "Choose the antonym of the underlined word “guilty”.",
      "paragraph": "The animals do not complain about their condition or make the poet feel guilty.",
      "underlined_word": "guilty",
      "word_box": [
        "innocent",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "innocent",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Difficult",
      "explanation": "The antonym of “guilty” is “innocent”."
    },
    {
      "id": 42,
      "question": "Choose the antonym of the underlined word “away”.",
      "paragraph": "The fog sits over the harbour like a cat and then moves away.",
      "underlined_word": "away",
      "word_box": [
        "near",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "near",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Difficult",
      "explanation": "The antonym of “away” is “near”."
    },
    {
      "id": 43,
      "question": "Choose the antonym of the underlined word “loss”.",
      "paragraph": "The poem presents the ball as a symbol of loss and responsibility.",
      "underlined_word": "loss",
      "word_box": [
        "gain",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "gain",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Difficult",
      "explanation": "The antonym of “loss” is “gain”."
    },
    {
      "id": 44,
      "question": "Choose the antonym of the underlined word “anger”.",
      "paragraph": "The tiger's quiet anger is suggested by the way he stalks in the cage.",
      "underlined_word": "anger",
      "word_box": [
        "joy",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "joy",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Difficult",
      "explanation": "The antonym of “anger” is “joy”."
    },
    {
      "id": 45,
      "question": "Choose the antonym of the underlined word “gained”.",
      "paragraph": "The young seagull finally gained confidence after making his first flight.",
      "underlined_word": "gained",
      "word_box": [
        "lost",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "lost",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Difficult",
      "explanation": "The antonym of “gained” is “lost”."
    },
    {
      "id": 46,
      "question": "Choose the antonym of the underlined word “disappeared”.",
      "paragraph": "The black aeroplane disappeared into the darkness, leaving the pilot puzzled.",
      "underlined_word": "disappeared",
      "word_box": [
        "appeared",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "appeared"
      },
      "correct_answer": "D",
      "difficulty": "Difficult",
      "explanation": "The antonym of “disappeared” is “appeared”."
    },
    {
      "id": 47,
      "question": "Choose the antonym of the underlined word “private”.",
      "paragraph": "Anne's diary became her confidante because she could share her private feelings with it.",
      "underlined_word": "private",
      "word_box": [
        "public",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "public"
      },
      "correct_answer": "D",
      "difficulty": "Difficult",
      "explanation": "The antonym of “private” is “public”."
    },
    {
      "id": 48,
      "question": "Choose the antonym of the underlined word “generous”.",
      "paragraph": "The postmaster's generous act showed compassion towards Lencho.",
      "underlined_word": "generous",
      "word_box": [
        "selfish",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "selfish",
        "D": "different"
      },
      "correct_answer": "C",
      "difficulty": "Difficult",
      "explanation": "The antonym of “generous” is “selfish”."
    },
    {
      "id": 49,
      "question": "Choose the antonym of the underlined word “overcome”.",
      "paragraph": "The Buddha's teaching helped people overcome sorrow and attain peace.",
      "underlined_word": "overcome",
      "word_box": [
        "surrender",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "opposite",
        "B": "similar",
        "C": "different",
        "D": "surrender"
      },
      "correct_answer": "D",
      "difficulty": "Difficult",
      "explanation": "The antonym of “overcome” is “surrender”."
    },
    {
      "id": 50,
      "question": "Choose the antonym of the underlined word “acceptance”.",
      "paragraph": "Kisa Gotami's grief gradually changed into acceptance after she learned the truth.",
      "underlined_word": "acceptance",
      "word_box": [
        "rejection",
        "opposite",
        "similar",
        "different",
        "unknown",
        "ordinary"
      ],
      "options": {
        "A": "rejection",
        "B": "opposite",
        "C": "similar",
        "D": "different"
      },
      "correct_answer": "A",
      "difficulty": "Difficult",
      "explanation": "The antonym of “acceptance” is “rejection”."
    }
  ]
};

// Check if already present in bank.vocabulary
const exists = currentBank.vocabulary.some(v => v.title === q28Data.title || v.question_number === 'Q28');
if (!exists) {
  currentBank.vocabulary.push(q28Data);
  fs.writeFileSync(bankPath, JSON.stringify(currentBank, null, 2), 'utf8');
  console.log('Successfully appended Q28 Antonyms to vocabulary section!');
} else {
  console.log('Q28 Antonyms already exists in vocabulary section.');
}
