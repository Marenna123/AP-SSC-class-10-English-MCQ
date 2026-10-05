import rawCreativeData from './creative_expressions_questions_35_37_with_examples.json';

export type CreativeQuestionId = 'Q35' | 'Q36' | 'Q37';

export type CreativeBranchId =
  | '35-a'
  | '35-b'
  | '36-a'
  | '36-b'
  | '37-a'
  | '37-b';

export interface RawCreativeQuestion {
  id: string;
  question_no: number;
  part: 'A' | 'B';
  type: string;
  prompt: string;
  hints?: string[];
  example_answer: string;
  data_labels?: string[];
  table?: (string | number)[][];
}

export interface CreativePracticeQuestion {
  id: string;
  question_no: number;
  part: 'A' | 'B';
  type: string;
  prompt: string;
  hints?: string[];
  example_answer: string;
  data_labels?: string[];
  table?: (string | number)[][];
}

export interface CreativeBranchItem {
  id: CreativeBranchId;
  questionNumber: CreativeQuestionId;
  branchCode: '35 A' | '35 B' | '36 A' | '36 B' | '37 A' | '37 B';
  name: string; // e.g. "CONVERSATION"
  fullTitle: string; // e.g. "35 A — CONVERSATION"
  discourseType: 'Major' | 'Minor';
  marks: number;
  description: string;
  formatGuidelines: string[];
  evaluationIndicators: string[];
  questions: CreativePracticeQuestion[];
}

export interface CreativeQuestionNode {
  questionNumber: CreativeQuestionId;
  title: string; // "QUESTION 35 — 10 MARKS"
  rawNumberTitle: string; // "Question 35"
  marks: number;
  choiceNote: string;
  description: string;
  branches: CreativeBranchItem[];
}

// All 42 questions directly imported and typed from the official JSON source
export const ALL_RAW_CREATIVE_QUESTIONS: CreativePracticeQuestion[] =
  rawCreativeData.questions as CreativePracticeQuestion[];

// Helpers to get questions strictly partitioned by question_no and part
const q35AQuestions = ALL_RAW_CREATIVE_QUESTIONS.filter(
  (q) => q.question_no === 35 && q.part === 'A'
);
const q35BQuestions = ALL_RAW_CREATIVE_QUESTIONS.filter(
  (q) => q.question_no === 35 && q.part === 'B'
);
const q36AQuestions = ALL_RAW_CREATIVE_QUESTIONS.filter(
  (q) => q.question_no === 36 && q.part === 'A'
);
const q36BQuestions = ALL_RAW_CREATIVE_QUESTIONS.filter(
  (q) => q.question_no === 36 && q.part === 'B'
);
const q37AQuestions = ALL_RAW_CREATIVE_QUESTIONS.filter(
  (q) => q.question_no === 37 && q.part === 'A'
);
const q37BQuestions = ALL_RAW_CREATIVE_QUESTIONS.filter(
  (q) => q.question_no === 37 && q.part === 'B'
);

export const CREATIVE_EXPRESSIONS_HIERARCHY: CreativeQuestionNode[] = [
  {
    questionNumber: 'Q35',
    title: 'QUESTION 35 — 10 MARKS',
    rawNumberTitle: 'Question 35',
    marks: 10,
    choiceNote: 'Internal Choice: Attempt either 35 A or 35 B (1 × 10 = 10 Marks)',
    description: 'Major discourse testing dialogue construction or personal emotional reflection based on reading texts.',
    branches: [
      {
        id: '35-a',
        questionNumber: 'Q35',
        branchCode: '35 A',
        name: 'CONVERSATION',
        fullTitle: '35 A — CONVERSATION',
        discourseType: 'Major',
        marks: 10,
        description: 'Writing a natural, contextual dialogue between two characters with appropriate initiation, exchange, and closing.',
        formatGuidelines: [
          'Proper initiation and polite/contextual termination of dialogue',
          'Minimum 5 to 7 meaningful exchanges giving equal voice to both speakers',
          'Use of conversational markers (Well, Look here, As a matter of fact, By the way)',
          'Tone, social relationship, and emotional attitude consistently maintained',
          'Correct punctuation including dialogue colons and quotation conventions',
        ],
        evaluationIndicators: [
          'Context & relevant idea development (3 Marks)',
          'Natural dialogue flow & exchange balance (3 Marks)',
          'Appropriate vocabulary & conversational discourse markers (2 Marks)',
          'Grammar, tense agreement & spelling conventions (2 Marks)',
        ],
        questions: q35AQuestions,
      },
      {
        id: '35-b',
        questionNumber: 'Q35',
        branchCode: '35 B',
        name: 'DIARY ENTRY',
        fullTitle: '35 B — DIARY ENTRY',
        discourseType: 'Major',
        marks: 10,
        description: 'First-person emotional reflection written by a character recording thoughts, feelings, and turning points.',
        formatGuidelines: [
          'Header elements: Day, Date, Time (e.g., Wednesday, 18 March, 9:30 PM)',
          'Optional salutation: Dear Diary',
          'First-person point of view (I, My, Me) capturing genuine emotional voice',
          'Vivid emotional tone reflecting character perspective (grief, wonder, dilemma, relief)',
          'Logical sequence: Incident summary → Emotional impact → Future reflection or closing thought',
          'Sign-off / Writer’s name at the bottom',
        ],
        evaluationIndicators: [
          'Expression of personal reflections and emotional depth (3 Marks)',
          'Logical sequencing and coherence of events (3 Marks)',
          'Adherence to layout structure (Day, Date, Time, Signature) (2 Marks)',
          'Accuracy in syntax, past tense usage, and mechanics (2 Marks)',
        ],
        questions: q35BQuestions,
      },
    ],
  },
  {
    questionNumber: 'Q36',
    title: 'QUESTION 36 — 10 MARKS',
    rawNumberTitle: 'Question 36',
    marks: 10,
    choiceNote: 'Internal Choice: Attempt either 36 A or 36 B (1 × 10 = 10 Marks)',
    description: 'Major discourse testing formal/informal letter writing or persuasive public speech.',
    branches: [
      {
        id: '36-a',
        questionNumber: 'Q36',
        branchCode: '36 A',
        name: 'LETTER WRITING',
        fullTitle: '36 A — LETTER WRITING',
        discourseType: 'Major',
        marks: 10,
        description: 'Writing structured Formal letters (to municipal officials, editors, headmasters) or Informal letters (to parents, friends).',
        formatGuidelines: [
          'Full-block modern format with left-aligned alignment throughout',
          'Sender\'s address, Date, Receiver\'s designation & address (for formal letters)',
          'Clear Subject line summarizing the issue and polite Salutation (Sir/Madam or Dear [Name])',
          'Body divided into three clear paragraphs: Purpose/Issue → Elaboration & Impact → Requested Action/Conclusion',
          'Complimentary close (Yours faithfully / Yours obediently / Yours lovingly) and full signature',
        ],
        evaluationIndicators: [
          'Adherence to standard letter conventions & layout (2 Marks)',
          'Completeness of contextual information & arguments (4 Marks)',
          'Appropriate register, politeness & vocabulary (2 Marks)',
          'Grammatical accuracy & formatting discipline (2 Marks)',
        ],
        questions: q36AQuestions,
      },
      {
        id: '36-b',
        questionNumber: 'Q36',
        branchCode: '36 B',
        name: 'SPEECH',
        fullTitle: '36 B — SPEECH',
        discourseType: 'Major',
        marks: 10,
        description: 'Writing an inspiring, persuasive spoken discourse for a school assembly, celebration, or awareness campaign.',
        formatGuidelines: [
          'Formal salutation addressing dignitaries, teachers, and audience (Respected Principal, teachers, and dear friends)',
          'Catchy opening introducing the purpose, theme, and relevance of the occasion',
          'Logical elaboration with facts, rhetorical questions, and persuasive arguments',
          'Call to action encouraging the listeners to adopt positive change or awareness',
          'Courteous closing expressing gratitude (Thank you for giving me this golden opportunity)',
        ],
        evaluationIndicators: [
          'Persuasive power, rhetoric & audience connection (3 Marks)',
          'Coherent structure & thematic depth (3 Marks)',
          'Appropriate register, spoken discourse markers & idioms (2 Marks)',
          'Grammar, punctuation & sentence variety (2 Marks)',
        ],
        questions: q36BQuestions,
      },
    ],
  },
  {
    questionNumber: 'Q37',
    title: 'QUESTION 37 — 10 MARKS',
    rawNumberTitle: 'Question 37',
    marks: 10,
    choiceNote: 'Internal Choice: Attempt either 37 A or 37 B (1 × 10 = 10 Marks)',
    description: 'Minor discourse testing sensory descriptive portrayal or analytical information transfer from graphical data.',
    branches: [
      {
        id: '37-a',
        questionNumber: 'Q37',
        branchCode: '37 A',
        name: 'DESCRIPTION',
        fullTitle: '37 A — DESCRIPTION',
        discourseType: 'Minor',
        marks: 10,
        description: 'Vivid sensory portrayal of an event, natural scene, dramatic episode, or personality.',
        formatGuidelines: [
          'Appropriate, captivating title at the top',
          'Vivid sensory language (visual, auditory, tactile details)',
          'Clear chronological or spatial progression (overall atmosphere to specific details)',
          'Consistent tense usage (predominantly past tense for narrative events, present for scenic descriptions)',
          'Memorable concluding sentence capturing the lasting mood or impression',
        ],
        evaluationIndicators: [
          'Thematic portrayal & sensory richness (4 Marks)',
          'Coherent sequencing & descriptive flow (3 Marks)',
          'Vocabulary choices & grammatical precision (3 Marks)',
        ],
        questions: q37AQuestions,
      },
      {
        id: '37-b',
        questionNumber: 'Q37',
        branchCode: '37 B',
        name: 'INFORMATION TRANSFER',
        fullTitle: '37 B — INFORMATION TRANSFER',
        discourseType: 'Minor',
        marks: 10,
        description: 'Transforming graphical or tabular data (pie chart, bar graph, flow chart, tree diagram, table) into a coherent, analytical prose paragraph.',
        formatGuidelines: [
          'Clear heading stating the subject of the data',
          'Introductory sentence describing what the chart/table represents',
          'Comparative analysis highlighting highest, lowest, trends, and key ratios',
          'Objective reporting without inventing unmentioned data',
          'Concluding summary statement capturing the overall finding',
        ],
        evaluationIndicators: [
          'Accurate representation of all given data points (4 Marks)',
          'Comparative language & analytical flow (3 Marks)',
          'Sentence variety, grammatical accuracy & brevity (3 Marks)',
        ],
        questions: q37BQuestions,
      },
    ],
  },
];
