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
if (!currentBank.grammar || currentBank.grammar.length !== 9) {
  console.error('Expected 9 grammar topics, found:', currentBank.grammar ? currentBank.grammar.length : 0);
  process.exit(1);
}

const q29Data = {
  "question_number": "Q29",
  "title": "Right Forms of Verbs",
  "subject": "AP SSC Class 10 English 2026–27",
  "total_questions": 50,
  "difficulty_distribution": {
    "Simple": 20,
    "Medium": 20,
    "Difficult": 10
  },
  "answer_position_distribution": {
    "A": 13,
    "B": 13,
    "C": 12,
    "D": 12
  },
  "source_basis": "Q29 Right Forms of Verbs; contextual practice based on Class 10 English lesson contexts and workbook verb-form practice.",
  "questions": [
    {
      "id": 1,
      "question": "When Lencho saw the rain, he ___ (feel) hopeful.",
      "options": {
        "A": "felt",
        "B": "feels",
        "C": "feeling",
        "D": "has felt"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 2,
      "question": "The hailstorm ___ (destroy) Lencho’s crop.",
      "options": {
        "A": "destroyed",
        "B": "destroys",
        "C": "destroying",
        "D": "has destroy"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 3,
      "question": "Lencho ___ (write) a letter to God.",
      "options": {
        "A": "writes",
        "B": "writing",
        "C": "wrote",
        "D": "has wrote"
      },
      "correct_answer": "C",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 4,
      "question": "The postmaster ___ (read) Lencho’s letter.",
      "options": {
        "A": "read",
        "B": "reads",
        "C": "reading",
        "D": "has read"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 5,
      "question": "The postmaster ___ (decide) to help Lencho.",
      "options": {
        "A": "decided",
        "B": "decides",
        "C": "deciding",
        "D": "has decide"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 6,
      "question": "The young seagull ___ (sit) alone on the ledge.",
      "options": {
        "A": "sits",
        "B": "sitting",
        "C": "sat",
        "D": "has sat"
      },
      "correct_answer": "C",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 7,
      "question": "His parents ___ (fly) around him.",
      "options": {
        "A": "flies",
        "B": "flew",
        "C": "flying",
        "D": "has fly"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 8,
      "question": "The seagull finally ___ (take) his first flight.",
      "options": {
        "A": "takes",
        "B": "taking",
        "C": "took",
        "D": "has taken"
      },
      "correct_answer": "C",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 9,
      "question": "Anne ___ (write) her diary regularly.",
      "options": {
        "A": "wrote",
        "B": "writes",
        "C": "writing",
        "D": "has write"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 10,
      "question": "Mr Keesing ___ (give) Anne an extra essay.",
      "options": {
        "A": "gives",
        "B": "giving",
        "C": "has give",
        "D": "gave"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 11,
      "question": "Rajvir ___ (visit) Assam with Pranjol.",
      "options": {
        "A": "visits",
        "B": "visiting",
        "C": "has visit",
        "D": "visited"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 12,
      "question": "The tea gardens ___ (look) beautiful from the train.",
      "options": {
        "A": "looked",
        "B": "looks",
        "C": "looking",
        "D": "has look"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 13,
      "question": "Valli ___ (want) to ride the bus.",
      "options": {
        "A": "wants",
        "B": "wanted",
        "C": "wanting",
        "D": "has want"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 14,
      "question": "She ___ (save) money for the journey.",
      "options": {
        "A": "saves",
        "B": "saving",
        "C": "has save",
        "D": "saved"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 15,
      "question": "Kisa Gotami ___ (go) from house to house.",
      "options": {
        "A": "goes",
        "B": "went",
        "C": "going",
        "D": "has go"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 16,
      "question": "The Buddha ___ (teach) her the truth about death.",
      "options": {
        "A": "teaches",
        "B": "taught",
        "C": "teaching",
        "D": "has teach"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 17,
      "question": "Griffin ___ (enter) the shop.",
      "options": {
        "A": "entered",
        "B": "enters",
        "C": "entering",
        "D": "has enter"
      },
      "correct_answer": "A",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 18,
      "question": "Ausable ___ (remain) calm when Max appeared.",
      "options": {
        "A": "remains",
        "B": "remained",
        "C": "remaining",
        "D": "has remain"
      },
      "correct_answer": "B",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 19,
      "question": "Horace Danby ___ (steal) books.",
      "options": {
        "A": "steals",
        "B": "stealing",
        "C": "has steal",
        "D": "stole"
      },
      "correct_answer": "D",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 20,
      "question": "Hari Singh ___ (return) to Anil.",
      "options": {
        "A": "returns",
        "B": "returning",
        "C": "returned",
        "D": "has return"
      },
      "correct_answer": "C",
      "difficulty": "Simple",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 21,
      "question": "By the time the hailstorm stopped, Lencho’s crop ___ (be) completely destroyed.",
      "options": {
        "A": "was",
        "B": "is",
        "C": "being",
        "D": "has been"
      },
      "correct_answer": "A",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 22,
      "question": "When the postmaster read the letter, he ___ (be) moved by Lencho’s faith.",
      "options": {
        "A": "was",
        "B": "is",
        "C": "being",
        "D": "has been"
      },
      "correct_answer": "A",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 23,
      "question": "Lencho ___ (believe) that God would help him.",
      "options": {
        "A": "believes",
        "B": "believing",
        "C": "has believe",
        "D": "believed"
      },
      "correct_answer": "D",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 24,
      "question": "The young seagull was hungry because he ___ (not eat) for a long time.",
      "options": {
        "A": "has not ate",
        "B": "did not eaten",
        "C": "was not eat",
        "D": "had not eaten"
      },
      "correct_answer": "D",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 25,
      "question": "When his mother flew near him, he ___ (try) to reach her.",
      "options": {
        "A": "tries",
        "B": "tried",
        "C": "trying",
        "D": "has try"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 26,
      "question": "While Anne ___ (write), Mr Keesing was thinking of a punishment.",
      "options": {
        "A": "wrote",
        "B": "writes",
        "C": "was writing",
        "D": "has written"
      },
      "correct_answer": "C",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 27,
      "question": "Mr Keesing ___ (be) annoyed because Anne talked so much.",
      "options": {
        "A": "is",
        "B": "was",
        "C": "being",
        "D": "has been"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 28,
      "question": "When Rajvir arrived, Pranjol ___ (already see) the tea gardens.",
      "options": {
        "A": "has already saw",
        "B": "already sees",
        "C": "was already see",
        "D": "had already seen"
      },
      "correct_answer": "D",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 29,
      "question": "Valli ___ (save) money before she decided to take the bus.",
      "options": {
        "A": "has saved",
        "B": "saved has",
        "C": "had saved",
        "D": "was save"
      },
      "correct_answer": "C",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 30,
      "question": "While Valli ___ (travel), she watched the scenery.",
      "options": {
        "A": "travelled",
        "B": "was travelling",
        "C": "travels",
        "D": "has travelled"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 31,
      "question": "When Kisa Gotami reached the Buddha, she ___ (visit) many houses.",
      "options": {
        "A": "has visited",
        "B": "was visit",
        "C": "visited had",
        "D": "had visited"
      },
      "correct_answer": "D",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 32,
      "question": "After the Buddha ___ (explain) his lesson, Kisa Gotami understood it.",
      "options": {
        "A": "explains",
        "B": "explaining",
        "C": "has explain",
        "D": "explained"
      },
      "correct_answer": "D",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 33,
      "question": "The invisible man ___ (escape) before the police could catch him.",
      "options": {
        "A": "escapes",
        "B": "escaping",
        "C": "escaped",
        "D": "has escape"
      },
      "correct_answer": "C",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 34,
      "question": "Ausable ___ (invent) the balcony story while Max was listening.",
      "options": {
        "A": "invents",
        "B": "invented",
        "C": "inventing",
        "D": "has invent"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 35,
      "question": "When Horace entered the house, the woman ___ (already arrive).",
      "options": {
        "A": "had already arrived",
        "B": "has already arrived",
        "C": "already arrives",
        "D": "was already arrive"
      },
      "correct_answer": "A",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 36,
      "question": "Hari Singh ___ (change) after Anil gave him a chance to study.",
      "options": {
        "A": "changes",
        "B": "changed",
        "C": "changing",
        "D": "has change"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 37,
      "question": "Richard Ebright ___ (conduct) many experiments.",
      "options": {
        "A": "conducts",
        "B": "conducting",
        "C": "conducted",
        "D": "has conduct"
      },
      "correct_answer": "C",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 38,
      "question": "His mother ___ (encourage) him throughout his studies.",
      "options": {
        "A": "encouraged",
        "B": "encourages",
        "C": "encouraging",
        "D": "has encourage"
      },
      "correct_answer": "A",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 39,
      "question": "The trees ___ (struggle) to move out into the forest.",
      "options": {
        "A": "struggled",
        "B": "were struggling",
        "C": "struggle",
        "D": "have struggle"
      },
      "correct_answer": "B",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 40,
      "question": "The tiger ___ (stalk) in his cage when visitors arrived.",
      "options": {
        "A": "stalked",
        "B": "stalks",
        "C": "was stalking",
        "D": "has stalk"
      },
      "correct_answer": "C",
      "difficulty": "Medium",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 41,
      "question": "If Lencho ___ (receive) the full amount, he would have been satisfied.",
      "options": {
        "A": "received",
        "B": "has received",
        "C": "was receiving",
        "D": "had received"
      },
      "correct_answer": "D",
      "difficulty": "Difficult",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 42,
      "question": "By the time the postmaster collected the money, Lencho ___ (send) his second letter.",
      "options": {
        "A": "has sent",
        "B": "had sent",
        "C": "was sending",
        "D": "sent has"
      },
      "correct_answer": "B",
      "difficulty": "Difficult",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 43,
      "question": "When the young seagull jumped, he ___ (discover) his wings could support him.",
      "options": {
        "A": "had discovered",
        "B": "was discovering",
        "C": "has discover",
        "D": "discovered"
      },
      "correct_answer": "D",
      "difficulty": "Difficult",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 44,
      "question": "Anne said that she ___ (write) in her diary because she needed a true friend.",
      "options": {
        "A": "was writing",
        "B": "has written",
        "C": "had write",
        "D": "wrote"
      },
      "correct_answer": "D",
      "difficulty": "Difficult",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 45,
      "question": "By the time Rajvir reached the tea estate, Pranjol ___ (already tell) him many facts.",
      "options": {
        "A": "has already told",
        "B": "was already tell",
        "C": "had already told",
        "D": "already tells"
      },
      "correct_answer": "C",
      "difficulty": "Difficult",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 46,
      "question": "If Valli ___ (know) about the dead cow earlier, she might have felt differently.",
      "options": {
        "A": "knew",
        "B": "has known",
        "C": "had known",
        "D": "was knowing"
      },
      "correct_answer": "C",
      "difficulty": "Difficult",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 47,
      "question": "After Kisa Gotami ___ (visit) many houses, she understood the lesson.",
      "options": {
        "A": "had visited",
        "B": "has visited",
        "C": "was visiting",
        "D": "visited has"
      },
      "correct_answer": "A",
      "difficulty": "Difficult",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 48,
      "question": "If Griffin ___ (use) his discovery responsibly, his life might have been different.",
      "options": {
        "A": "used",
        "B": "has used",
        "C": "had used",
        "D": "was using"
      },
      "correct_answer": "C",
      "difficulty": "Difficult",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 49,
      "question": "By the time Ausable finished his story, Max ___ (leave) the room.",
      "options": {
        "A": "had left",
        "B": "has left",
        "C": "was leave",
        "D": "left has"
      },
      "correct_answer": "A",
      "difficulty": "Difficult",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    },
    {
      "id": 50,
      "question": "If Hari Singh ___ (not return), Anil would have lost trust in him.",
      "options": {
        "A": "did not return",
        "B": "had not returned",
        "C": "has not returned",
        "D": "was not returning"
      },
      "correct_answer": "B",
      "difficulty": "Difficult",
      "explanation": "The selected verb form correctly matches the tense and time relationship in the sentence."
    }
  ]
};

// Check if already present
const exists = currentBank.grammar.some(g => g.title === q29Data.title || g.question_number === 'Q29');
if (!exists) {
  currentBank.grammar.push(q29Data);
  fs.writeFileSync(bankPath, JSON.stringify(currentBank, null, 2), 'utf8');
  console.log('Successfully appended Q29 Right Forms of Verbs to grammar section!');
} else {
  console.log('Q29 Right Forms of Verbs already exists in grammar section.');
}
