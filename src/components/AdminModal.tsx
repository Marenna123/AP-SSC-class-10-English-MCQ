import React, { useState, useRef } from 'react';
import { X, Plus, Upload, List, AlertTriangle, CheckCircle2, Trash2, FileText, Download, Code } from 'lucide-react';
import { Category, CorrectOption, Difficulty, Question } from '../types';
import { parseAndValidateCSV } from '../lib/storage';
import { normalizeAndValidateJSONQuestions } from '../lib/questionLoader';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onAddQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onBulkImport: (questions: Question[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  questions,
  onAddQuestion,
  onDeleteQuestion,
  onBulkImport,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'import'>('list');
  const [searchFilter, setSearchFilter] = useState('');

  // Add question form state
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState<CorrectOption>('A');
  const [explanation, setExplanation] = useState('');
  const [category, setCategory] = useState<Category>('prose');
  const [subcategory, setSubcategory] = useState('How to Tell Wild Animals');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [addSuccess, setAddSuccess] = useState('');

  // Import state
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [jsonText, setJsonText] = useState('');
  const [csvText, setCsvText] = useState('');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccessMessage, setImportSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim() || !explanation.trim()) {
      alert('Please fill all question fields.');
      return;
    }

    const newQ: Question = {
      id: 'q-custom-' + Date.now(),
      question_text: qText.trim(),
      option_a: optA.trim(),
      option_b: optB.trim(),
      option_c: optC.trim(),
      option_d: optD.trim(),
      correct_option: correctOpt,
      explanation: explanation.trim(),
      category,
      subcategory,
      lesson_id: subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      difficulty,
      created_at: new Date().toISOString(),
    };

    onAddQuestion(newQ);
    setAddSuccess('Question added successfully!');
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setExplanation('');
    setTimeout(() => setAddSuccess(''), 3000);
  };

  const handleRunJSONImport = () => {
    setImportErrors([]);
    setImportSuccessMessage('');

    if (!jsonText.trim()) {
      setImportErrors(['JSON input is empty. Paste JSON or upload a .json file.']);
      return;
    }

    const { validQuestions, errors, lessonNames } = normalizeAndValidateJSONQuestions(jsonText);

    if (errors.length > 0) {
      setImportErrors(errors);
      return;
    }

    if (validQuestions.length === 0) {
      setImportErrors(['No valid questions found in the JSON payload.']);
      return;
    }

    onBulkImport(validQuestions);
    const lessonsLabel = lessonNames.length > 0 ? ` (${lessonNames.join(', ')})` : '';
    setImportSuccessMessage(
      `Successfully imported ${validQuestions.length} authoritative questions${lessonsLabel} without modifying questions, options, or answers!`
    );
    setJsonText('');
  };

  const handleRunCSVImport = () => {
    setImportErrors([]);
    setImportSuccessMessage('');

    if (!csvText.trim()) {
      setImportErrors(['CSV input is empty.']);
      return;
    }

    const { validQuestions, errors } = parseAndValidateCSV(csvText);

    if (errors.length > 0) {
      setImportErrors(errors);
      return;
    }

    if (validQuestions.length === 0) {
      setImportErrors(['No valid questions detected in the CSV.']);
      return;
    }

    onBulkImport(validQuestions);
    setImportSuccessMessage(`Successfully imported ${validQuestions.length} questions into the question bank!`);
    setCsvText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith('.json')) {
        setImportFormat('json');
        setJsonText(content);
      } else {
        setImportFormat('csv');
        setCsvText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'ap_ssc_class10_english_questions.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const sampleCSV = `question_text,option_a,option_b,option_c,option_d,correct_option,explanation,category,subcategory,difficulty,lesson_id
"Who was the author of A Letter to God?","G.L. Fuentes","Robert Frost","Liam O'Flaherty","Betty Renshaw",A,"G.L. Fuentes is the author of A Letter to God.",prose,"A Letter to God",simple,a-letter-to-god
"What does 'placid' mean in Class 10 vocabulary?","Calm and peaceful","Violent and angry","Fast running","Noisy",A,"Placid means pleasantly calm and peaceful.",vocabulary,Synonyms,simple,synonyms`;

  const sampleJSON = `{
  "poems": [
    {
      "title": "Dust of Snow",
      "questions": [
        {
          "question_number": 1,
          "question": "What is the dust of snow shaken down by the crow?",
          "options": {
            "A": "Fine particles of snow",
            "B": "Drops of rain",
            "C": "Poisonous hemlock seeds",
            "D": "Fallen dry leaves"
          },
          "correct_answer": "A",
          "explanation": "Dust of snow refers to tiny fine flakes or particles of snow.",
          "difficulty": "simple"
        }
      ]
    }
  ]
}`;

  const filteredQuestions = questions.filter(
    (q) =>
      q.question_text.toLowerCase().includes(searchFilter.toLowerCase()) ||
      q.subcategory.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg font-['Outfit',sans-serif]">
              Teacher & Admin Management
            </h3>
            <p className="text-xs text-slate-500">
              Manage AP SSC Class 10 Question Bank & Bulk CSV Importer
            </p>
          </div>
          <button
            id="admin-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 justify-between items-center">
          <div className="flex">
            <button
              onClick={() => setActiveTab('list')}
              className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'list'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
              Questions ({questions.length})
            </button>

            <button
              onClick={() => setActiveTab('add')}
              className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'add'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Single
            </button>

            <button
              onClick={() => setActiveTab('import')}
              className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'import'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              Import Data (JSON/CSV)
            </button>
          </div>

          <button
            onClick={handleExportJSON}
            className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            title="Export Question Bank as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto grow space-y-4">
          {/* TAB 1: Questions List */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search questions by text or topic..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] flex-wrap">
                        <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {q.category.toUpperCase()} • {q.subcategory}
                        </span>
                        <span className="font-bold text-slate-400">
                          Diff: {q.difficulty}
                        </span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Ans: {q.correct_option}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {idx + 1}. {q.question_text}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                        {q.explanation}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete question "${q.question_text}"?`)) {
                          onDeleteQuestion(q.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Add Question Form */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddSubmit} className="space-y-3">
              {addSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {addSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="prose">Prose</option>
                    <option value="poem">Poem</option>
                    <option value="grammar">Grammar</option>
                    <option value="vocabulary">Vocabulary</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subcategory / Lesson</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. A Letter to God, Passive Voice"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="difficult">Difficult</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Question Text</label>
                <textarea
                  rows={2}
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Enter the AP SSC question text..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Option A</label>
                  <input
                    type="text"
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    placeholder="Option A"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Option B</label>
                  <input
                    type="text"
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    placeholder="Option B"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Option C</label>
                  <input
                    type="text"
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    placeholder="Option C"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Option D</label>
                  <input
                    type="text"
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    placeholder="Option D"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Correct Answer</label>
                  <select
                    value={correctOpt}
                    onChange={(e) => setCorrectOpt(e.target.value as CorrectOption)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-bold"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Short Explanation</label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Textbook rationale for the answer..."
                    className="w-full text-xs border border-slate-200 rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
              >
                Save Question to Bank
              </button>
            </form>
          )}

          {/* TAB 3: Bulk Import (JSON & CSV) */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              {/* Format selection toggles */}
              <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setImportFormat('json');
                      setImportErrors([]);
                      setImportSuccessMessage('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      importFormat === 'json'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    Authoritative JSON Format
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImportFormat('csv');
                      setImportErrors([]);
                      setImportSuccessMessage('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      importFormat === 'csv'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    CSV Spreadsheet Format
                  </button>
                </div>

                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".json,.csv"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    Upload File
                  </button>
                </div>
              </div>

              {/* Format Guidelines Card */}
              {importFormat === 'json' ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Code className="w-4 h-4 text-indigo-600" />
                      Authoritative JSON Format (Class 10 Syllabus Bank):
                    </span>
                    <button
                      type="button"
                      onClick={() => setJsonText(sampleJSON)}
                      className="text-indigo-600 hover:underline font-bold text-[11px]"
                    >
                      Load Sample Template
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Supports nested sections (<code className="bg-white px-1 py-0.5 rounded border border-slate-200">poems</code>, <code className="bg-white px-1 py-0.5 rounded border border-slate-200">prose</code>, <code className="bg-white px-1 py-0.5 rounded border border-slate-200">grammar</code>, <code className="bg-white px-1 py-0.5 rounded border border-slate-200">vocabulary</code>) or direct question arrays. Guarantees 100% preservation of questions, options A/B/C/D, answers, and explanations without modification.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      CSV Format Requirement:
                    </span>
                    <button
                      type="button"
                      onClick={() => setCsvText(sampleCSV)}
                      className="text-indigo-600 hover:underline font-bold text-[11px]"
                    >
                      Load Sample Template
                    </button>
                  </div>
                  <code className="text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 block overflow-x-auto whitespace-pre">
                    question_text,option_a,option_b,option_c,option_d,correct_option,explanation,category,subcategory,difficulty,lesson_id
                  </code>
                </div>
              )}

              {/* Import Feedback */}
              {importErrors.length > 0 && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <div className="font-extrabold text-xs text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Import Validation Errors ({importErrors.length})
                  </div>
                  <ul className="text-xs text-rose-700 list-disc pl-5 space-y-0.5 max-h-32 overflow-y-auto">
                    {importErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {importSuccessMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {importSuccessMessage}
                </div>
              )}

              {importFormat === 'json' ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Paste Authoritative JSON Data:
                  </label>
                  <textarea
                    rows={8}
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder={sampleJSON}
                    className="w-full text-xs font-mono border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    id="run-json-import-btn"
                    onClick={handleRunJSONImport}
                    className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Validate & Import Authoritative JSON
                  </button>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Paste CSV Data Here:
                  </label>
                  <textarea
                    rows={8}
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    placeholder={`"Question text","Opt A","Opt B","Opt C","Opt D",A,"Explanation text",prose,"A Letter to God",simple,a-letter-to-god`}
                    className="w-full text-xs font-mono border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    id="run-csv-import-btn"
                    onClick={handleRunCSVImport}
                    className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Validate & Import CSV Questions
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
