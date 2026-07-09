"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InterviewQuestionsPage;
// apps/web/src/app/admin/interviews/[interviewId]/questions/page.tsx
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const api_1 = require("@/lib/api");
const SupabaseProvider_1 = require("@/providers/SupabaseProvider");
function InterviewQuestionsPage() {
    const router = (0, navigation_1.useRouter)();
    const { session, loading } = (0, SupabaseProvider_1.useSupabase)();
    const interviewId = router.query?.interviewId;
    const [questions, setQuestions] = (0, react_1.useState)([]);
    const [newQuestion, setNewQuestion] = (0, react_1.useState)('');
    const [status, setStatus] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        if (!interviewId)
            return;
        (0, api_1.apiFetch)(`/interviews/${interviewId}/questions`)
            .then(setQuestions)
            .catch((e) => setStatus(`Failed to load: ${e.message}`));
    }, [interviewId]);
    const addQuestion = async () => {
        if (!newQuestion.trim())
            return;
        try {
            const created = await (0, api_1.apiFetch)(`/interviews/${interviewId}/questions`, {
                method: 'POST',
                body: JSON.stringify({ interviewId, question: newQuestion }),
            });
            setQuestions((prev) => [...prev, created]);
            setNewQuestion('');
            setStatus('Question added');
        }
        catch (e) {
            setStatus(`Error: ${e.message}`);
        }
    };
    const generateAnswer = async (questionId) => {
        try {
            const data = await (0, api_1.apiFetch)(`/interviews/${interviewId}/questions/${questionId}/generate-answer`, { method: 'POST' });
            setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, answer: data.answer } : q)));
            setStatus('Answer generated');
        }
        catch (e) {
            setStatus(`Error: ${e.message}`);
        }
    };
    if (loading)
        return <p>Loading session…</p>;
    if (!session)
        return <p>Please sign in to manage interview questions.</p>;
    return (<div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Interview Questions</h1>
      <ul className="space-y-4">
        {questions.map((q) => (<li key={q.id} className="border-b pb-2">
            <p className="font-medium text-gray-800 dark:text-gray-200">{q.question}</p>
            {q.answer && (<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Answer: {q.answer}</p>)}
            <button className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={() => generateAnswer(q.id)}>
              Generate AI Answer
            </button>
          </li>))}
      </ul>
      <div className="mt-6">
        <textarea rows={3} placeholder="New question…" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"/>
        <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={addQuestion}>
          Add Question
        </button>
      </div>
      {status && <p className="mt-4 text-sm text-gray-700 dark:text-gray-200">{status}</p>}
    </div>);
}
