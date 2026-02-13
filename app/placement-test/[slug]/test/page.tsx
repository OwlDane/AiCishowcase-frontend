"use client";

/**
 * Placement Test Interface
 * The actual test taking page with questions
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { placementTestApi } from '@/lib/api';
import { useTimer } from '@/lib/hooks/use-timer';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, Circle, AlertCircle, Loader2, Send } from 'lucide-react';
import Image from 'next/image';

export default function PlacementTestPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

    const slug = params.slug as string;
    const attemptId = searchParams.get('attempt');

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());

    // Fetch test attempt data
    const { data, isLoading, error } = useQuery({
        queryKey: ['test-attempt', attemptId],
        queryFn: () => placementTestApi.getAttempt(attemptId!),
        enabled: !!attemptId,
        refetchInterval: false,
    });

    const attempt = data?.data?.attempt;
    const test = data?.data?.test;
    const questions = data?.data?.questions || [];
    const progress = data?.data?.progress;
    const currentQuestion = questions[currentQuestionIndex];

    // Timer
    const { timeRemaining, isExpired, formatTime, getPercentage } = useTimer({
        expiresAt: attempt?.expires_at || new Date().toISOString(),
        onExpire: () => {
            toast.error('Waktu habis! Test akan diselesaikan otomatis.');
            completeTestMutation.mutate();
        },
    });

    // Submit answer mutation
    const submitAnswerMutation = useMutation({
        mutationFn: (answer: string) => {
            const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
            return placementTestApi.submitAnswer(attemptId!, {
                test_question_id: currentQuestion.id,
                user_answer: answer,
                time_spent_seconds: timeSpent,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['test-attempt', attemptId] });

            // Move to next question or complete
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer('');
                setQuestionStartTime(Date.now());
            } else {
                // All questions answered, complete test
                completeTestMutation.mutate();
            }
        },
        onError: (error: any) => {
            toast.error(error.message || 'Gagal menyimpan jawaban');
        },
    });

    // Complete test mutation
    const completeTestMutation = useMutation({
        mutationFn: () => placementTestApi.complete(attemptId!),
        onSuccess: (response) => {
            toast.success('Test selesai! Melihat hasil...');
            router.push(`/placement-test/result/${response.data.attempt_id}`);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Gagal menyelesaikan test');
        },
    });

    const handleSubmitAnswer = () => {
        if (!selectedAnswer) {
            toast.error('Pilih jawaban terlebih dahulu');
            return;
        }
        submitAnswerMutation.mutate(selectedAnswer);
    };

    const handleSkip = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
            setQuestionStartTime(Date.now());
        }
    };

    // Set selected answer if question already answered
    useEffect(() => {
        if (currentQuestion?.is_answered && currentQuestion?.user_answer) {
            setSelectedAnswer(currentQuestion.user_answer);
        } else {
            setSelectedAnswer('');
        }
        setQuestionStartTime(Date.now());
    }, [currentQuestionIndex, currentQuestion]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#eef2f5] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#255d74]" />
            </div>
        );
    }

    if (error || !attempt || !test) {
        return (
            <div className="min-h-screen bg-[#eef2f5] flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[#255d74] mb-2">Test Tidak Ditemukan</h2>
                    <p className="text-[#255d74]/60 mb-6">Sesi test tidak valid atau sudah berakhir.</p>
                    <button
                        onClick={() => router.push('/placement-test')}
                        className="px-6 py-3 bg-[#255d74] text-white rounded-xl font-bold hover:bg-[#1e4a5f] transition-all"
                    >
                        Kembali ke Daftar Test
                    </button>
                </div>
            </div>
        );
    }

    const timerPercentage = getPercentage(test.duration_minutes * 60);
    const isTimeCritical = timerPercentage < 20;

    return (
        <div className="min-h-screen bg-[#eef2f5]">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Test Info */}
                        <div>
                            <h1 className="text-lg font-bold text-[#255d74]">{test.title}</h1>
                            <p className="text-sm text-[#255d74]/60">
                                Soal {currentQuestionIndex + 1} dari {questions.length}
                            </p>
                        </div>

                        {/* Timer */}
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${isTimeCritical ? 'bg-red-50 text-red-600' : 'bg-[#255d74]/5 text-[#255d74]'
                            }`}>
                            <Clock className={`w-5 h-5 ${isTimeCritical ? 'animate-pulse' : ''}`} />
                            <span className="font-bold text-lg">{formatTime()}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-[#255d74]/60 mb-2">
                            <span>Progress</span>
                            <span>{progress?.percentage.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-[#255d74] to-secondary transition-all duration-300"
                                style={{ width: `${progress?.percentage || 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                    {/* Question Number Badge */}
                    <div className="inline-block px-4 py-2 bg-[#255d74]/10 text-[#255d74] rounded-xl font-bold text-sm mb-6">
                        Pertanyaan {currentQuestionIndex + 1}
                    </div>

                    {/* Question Text */}
                    <h2 className="text-2xl font-bold text-[#255d74] mb-6 leading-relaxed">
                        {currentQuestion?.question}
                    </h2>

                    {/* Question Image (if exists) */}
                    {currentQuestion?.image && (
                        <div className="relative w-full h-64 mb-8 rounded-xl overflow-hidden">
                            <Image
                                src={currentQuestion.image}
                                alt="Question illustration"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 768px"
                            />
                        </div>
                    )}

                    {/* Answer Options */}
                    <div className="space-y-4 mb-8">
                        {currentQuestion?.type === 'multiple_choice' && currentQuestion?.options?.map((option: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => setSelectedAnswer(option)}
                                disabled={currentQuestion.is_answered || submitAnswerMutation.isPending}
                                className={`w-full text-left p-6 rounded-xl border-2 transition-all ${selectedAnswer === option
                                        ? 'border-[#255d74] bg-[#255d74]/5'
                                        : 'border-gray-200 hover:border-[#255d74]/50 hover:bg-gray-50'
                                    } ${currentQuestion.is_answered ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === option
                                            ? 'border-[#255d74] bg-[#255d74]'
                                            : 'border-gray-300'
                                        }`}>
                                        {selectedAnswer === option && (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <span className="flex-1 font-medium text-[#255d74]">{option}</span>
                                </div>
                            </button>
                        ))}

                        {currentQuestion?.type === 'essay' && (
                            <textarea
                                value={selectedAnswer}
                                onChange={(e) => setSelectedAnswer(e.target.value)}
                                disabled={currentQuestion.is_answered || submitAnswerMutation.isPending}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#255d74] focus:outline-none resize-none"
                                rows={6}
                                placeholder="Tulis jawaban Anda di sini..."
                            />
                        )}

                        {currentQuestion?.type === 'true_false' && (
                            <>
                                <button
                                    onClick={() => setSelectedAnswer('true')}
                                    disabled={currentQuestion.is_answered || submitAnswerMutation.isPending}
                                    className={`w-full text-left p-6 rounded-xl border-2 transition-all ${selectedAnswer === 'true'
                                            ? 'border-[#255d74] bg-[#255d74]/5'
                                            : 'border-gray-200 hover:border-[#255d74]/50 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === 'true' ? 'border-[#255d74] bg-[#255d74]' : 'border-gray-300'
                                            }`}>
                                            {selectedAnswer === 'true' && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className="flex-1 font-medium text-[#255d74]">Benar</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setSelectedAnswer('false')}
                                    disabled={currentQuestion.is_answered || submitAnswerMutation.isPending}
                                    className={`w-full text-left p-6 rounded-xl border-2 transition-all ${selectedAnswer === 'false'
                                            ? 'border-[#255d74] bg-[#255d74]/5'
                                            : 'border-gray-200 hover:border-[#255d74]/50 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === 'false' ? 'border-[#255d74] bg-[#255d74]' : 'border-gray-300'
                                            }`}>
                                            {selectedAnswer === 'false' && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className="flex-1 font-medium text-[#255d74]">Salah</span>
                                    </div>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        {!currentQuestion?.is_answered && currentQuestionIndex < questions.length - 1 && (
                            <button
                                onClick={handleSkip}
                                disabled={submitAnswerMutation.isPending}
                                className="flex-1 border-2 border-gray-200 text-[#255d74] py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Lewati
                            </button>
                        )}

                        {!currentQuestion?.is_answered ? (
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={!selectedAnswer || submitAnswerMutation.isPending}
                                className="flex-1 bg-[#255d74] text-white py-4 rounded-xl font-bold hover:bg-[#1e4a5f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#255d74]/20"
                            >
                                {submitAnswerMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : currentQuestionIndex === questions.length - 1 ? (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Selesaikan Test
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Kirim Jawaban
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (currentQuestionIndex < questions.length - 1) {
                                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                                    } else {
                                        completeTestMutation.mutate();
                                    }
                                }}
                                className="flex-1 bg-secondary text-white py-4 rounded-xl font-bold hover:bg-[#e63c1e] transition-all flex items-center justify-center gap-2"
                            >
                                {currentQuestionIndex === questions.length - 1 ? 'Lihat Hasil' : 'Soal Berikutnya →'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Question Navigator */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-[#255d74]/60 mb-4 uppercase tracking-wider">Navigasi Soal</h3>
                    <div className="grid grid-cols-10 gap-2">
                        {questions.map((q: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all ${index === currentQuestionIndex
                                        ? 'bg-[#255d74] text-white shadow-lg'
                                        : q.is_answered
                                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
