"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
    id: string;
    question_text: string;
    question_type: string;
    options: string[];
    correct_answer: string;
    explanation?: string;
    difficulty_level: string;
    sort_order: number;
    is_active: boolean;
}

export default function TestQuestionsPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.id as string;
    
    const [test, setTest] = useState<any>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("MULTIPLE_CHOICE");
    const [options, setOptions] = useState<string[]>(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [explanation, setExplanation] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState("MEDIUM");
    const [isActive, setIsActive] = useState(true);

    const loadTest = async () => {
        try {
            const data = await api.admin.placementTests.get(testId);
            setTest(data);
        } catch (err) {
            toast.error("Failed to load test");
            router.push("/admin/placement-tests");
        }
    };

    const loadQuestions = async () => {
        setIsLoading(true);
        try {
            const data = await api.admin.placementTests.questions.list(testId);
            setQuestions(data.results || data);
        } catch (err) {
            console.error("Failed to load questions:", err);
            toast.error("Failed to load questions");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTest();
        loadQuestions();
    }, [testId]);

    const openModal = (question?: Question) => {
        if (question) {
            setEditingQuestion(question);
            setQuestionText(question.question_text);
            setQuestionType(question.question_type);
            setOptions(question.options);
            setCorrectAnswer(question.correct_answer);
            setExplanation(question.explanation || "");
            setDifficultyLevel(question.difficulty_level);
            setIsActive(question.is_active);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingQuestion(null);
        setQuestionText("");
        setQuestionType("MULTIPLE_CHOICE");
        setOptions(["", "", "", ""]);
        setCorrectAnswer("");
        setExplanation("");
        setDifficultyLevel("MEDIUM");
        setIsActive(true);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data = {
            question_text: questionText,
            question_type: questionType,
            options: options.filter(opt => opt.trim() !== ""),
            correct_answer: correctAnswer,
            explanation,
            difficulty_level: difficultyLevel,
            is_active: isActive,
        };

        try {
            if (editingQuestion) {
                await api.admin.placementTests.questions.update(testId, editingQuestion.id, data);
                toast.success("Question updated");
            } else {
                await api.admin.placementTests.questions.create(testId, data);
                toast.success("Question created");
            }
            setIsModalOpen(false);
            resetForm();
            loadQuestions();
        } catch (err: any) {
            toast.error(err.message || "Failed to save question");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (questionId: string) => {
        if (!confirm("Delete this question?")) return;

        try {
            await api.admin.placementTests.questions.delete(testId, questionId);
            toast.success("Question deleted");
            loadQuestions();
        } catch (err) {
            toast.error("Failed to delete question");
        }
    };

    const getDifficultyColor = (level: string) => {
        switch (level) {
            case 'EASY': return 'bg-green-100 text-green-600';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-600';
            case 'HARD': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/admin/placement-tests"
                        className="w-10 h-10 bg-gray-50 text-primary/40 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-primary">{test?.title}</h3>
                        <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">
                            Question Bank Management
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-primary text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center gap-2 group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Question
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Total Questions</p>
                        <p className="text-3xl font-black text-primary">{questions.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-green-600/60 uppercase tracking-widest mb-2">Easy</p>
                        <p className="text-3xl font-black text-green-600">
                            {questions.filter(q => q.difficulty_level === 'EASY').length}
                        </p>
                    </div>
                    <div className="bg-yellow-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-yellow-600/60 uppercase tracking-widest mb-2">Medium</p>
                        <p className="text-3xl font-black text-yellow-600">
                            {questions.filter(q => q.difficulty_level === 'MEDIUM').length}
                        </p>
                    </div>
                    <div className="bg-red-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-red-600/60 uppercase tracking-widest mb-2">Hard</p>
                        <p className="text-3xl font-black text-red-600">
                            {questions.filter(q => q.difficulty_level === 'HARD').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Questions List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                </div>
            ) : questions.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center">
                    <p className="text-4xl mb-4">❓</p>
                    <h4 className="text-xl font-bold text-primary mb-2">No questions yet</h4>
                    <p className="text-primary/60">Add your first question to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <div key={question.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <h4 className="text-lg font-bold text-primary flex-1">{question.question_text}</h4>
                                        <div className="flex gap-2 shrink-0">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(question.difficulty_level)}`}>
                                                {question.difficulty_level}
                                            </span>
                                            {question.is_active && (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-2 mb-4">
                                        {question.options.map((option, optIndex) => (
                                            <div
                                                key={optIndex}
                                                className={`flex items-center gap-3 p-3 rounded-xl ${
                                                    option === question.correct_answer
                                                        ? 'bg-green-50 border-2 border-green-200'
                                                        : 'bg-gray-50'
                                                }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                    option === question.correct_answer
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-300 text-gray-600'
                                                }`}>
                                                    {String.fromCharCode(65 + optIndex)}
                                                </div>
                                                <span className={`text-sm ${
                                                    option === question.correct_answer
                                                        ? 'font-bold text-green-700'
                                                        : 'text-primary/60'
                                                }`}>
                                                    {option}
                                                </span>
                                                {option === question.correct_answer && (
                                                    <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Explanation */}
                                    {question.explanation && (
                                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Explanation</p>
                                            <p className="text-sm text-blue-900">{question.explanation}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(question)}
                                            className="px-4 py-2 bg-gray-50 text-primary/60 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(question.id)}
                                            className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="min-h-screen flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)} />

                        <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl p-10 md:p-12 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-bold text-primary">
                                    {editingQuestion ? "Edit Question" : "New Question"}
                                </h3>
                                <button
                                    onClick={() => !isSaving && setIsModalOpen(false)}
                                    disabled={isSaving}
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary/20 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Question Text</label>
                                    <textarea
                                        required
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                        disabled={isSaving}
                                        rows={3}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                        placeholder="Enter your question here..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Question Type</label>
                                        <select
                                            value={questionType}
                                            onChange={(e) => setQuestionType(e.target.value)}
                                            disabled={isSaving}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                        >
                                            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                            <option value="TRUE_FALSE">True/False</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Difficulty</label>
                                        <select
                                            value={difficultyLevel}
                                            onChange={(e) => setDifficultyLevel(e.target.value)}
                                            disabled={isSaving}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                        >
                                            <option value="EASY">Easy</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HARD">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Answer Options</label>
                                        {options.length < 6 && (
                                            <button
                                                type="button"
                                                onClick={addOption}
                                                disabled={isSaving}
                                                className="text-xs font-bold text-secondary hover:text-primary transition-all"
                                            >
                                                + Add Option
                                            </button>
                                        )}
                                    </div>
                                    {options.map((option, index) => (
                                        <div key={index} className="flex gap-2">
                                            <div className="w-8 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-primary text-sm shrink-0">
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                disabled={isSaving}
                                                className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                            />
                                            {options.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(index)}
                                                    disabled={isSaving}
                                                    className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Correct Answer</label>
                                    <select
                                        required
                                        value={correctAnswer}
                                        onChange={(e) => setCorrectAnswer(e.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                    >
                                        <option value="">Select correct answer</option>
                                        {options.filter(opt => opt.trim() !== "").map((option, index) => (
                                            <option key={index} value={option}>
                                                {String.fromCharCode(65 + index)}. {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Explanation (Optional)</label>
                                    <textarea
                                        value={explanation}
                                        onChange={(e) => setExplanation(e.target.value)}
                                        disabled={isSaving}
                                        rows={2}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                        placeholder="Explain why this is the correct answer..."
                                    />
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        disabled={isSaving}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-secondary"
                                    />
                                    <span className="text-sm font-bold text-primary">Active (visible in test)</span>
                                </label>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={isSaving}
                                        className="flex-1 bg-gray-50 text-primary font-bold py-5 rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-primary text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            editingQuestion ? "Save Changes" : "Add Question"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
