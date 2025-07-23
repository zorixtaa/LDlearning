import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, HelpCircle, Upload, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Quiz, Question } from '../types';

interface QuizSystemProps {
  moduleId: string;
  onComplete: (score: number, timeSpent: number) => void;
  onExit: () => void;
}

export const QuizSystem: React.FC<QuizSystemProps> = ({ moduleId, onComplete, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Mock quiz data
  const quiz: Quiz = {
    id: `quiz-${moduleId}`,
    moduleId,
    questions: [
      {
        id: '1',
        type: 'multiple_choice',
        question: '¿Cuál es la principal diferencia entre un tráiler Tautliner y uno Frigorífico?',
        options: [
          'El Tautliner es más largo',
          'El Frigorífico tiene sistema de refrigeración y termógrafo',
          'El Tautliner es más pesado',
          'No hay diferencias significativas'
        ],
        correctAnswer: 'El Frigorífico tiene sistema de refrigeración y termógrafo',
        explanation: 'Los tráilers frigoríficos están equipados con sistemas de refrigeración y termógrafos para monitorear la temperatura durante el transporte de mercancías sensibles.',
        points: 10,
        difficulty: 'easy',
        hints: ['Piensa en qué tipo de mercancías transporta cada uno', 'El termógrafo es clave']
      },
      {
        id: '2',
        type: 'simulation',
        question: 'Simula el proceso de "romper un pedido" dividiendo esta orden en 3 tramos:',
        options: [],
        correctAnswer: 'tramo1:Madrid-Santander,tramo2:Santander-Portsmouth,tramo3:Portsmouth-Londres',
        explanation: 'La división correcta considera la ruta marítima y los puertos de conexión.',
        points: 20,
        difficulty: 'hard',
        hints: ['Identifica primero los puertos', 'El ferry va de Santander a Portsmouth']
      },
      {
        id: '3',
        type: 'document_upload',
        question: 'Sube la documentación CMR correctamente completada para este envío:',
        options: [],
        correctAnswer: 'cmr_document_valid',
        explanation: 'La documentación CMR debe incluir todos los campos obligatorios y firmas.',
        points: 15,
        difficulty: 'medium',
        hints: ['Verifica que todos los campos estén completos', 'Las firmas son obligatorias']
      }
    ],
    passingScore: 70,
    timeLimit: 30,
    adaptiveDifficulty: true
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Adaptive difficulty logic
    const question = quiz.questions.find(q => q.id === questionId);
    if (question && quiz.adaptiveDifficulty) {
      const isCorrect = answer === question.correctAnswer;
      if (isCorrect && adaptiveDifficulty === 'easy') {
        setAdaptiveDifficulty('medium');
      } else if (!isCorrect && adaptiveDifficulty === 'hard') {
        setAdaptiveDifficulty('medium');
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowHint(false);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    
    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    
    quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        earnedPoints += question.points;
      }
    });
    
    const score = Math.round((earnedPoints / totalPoints) * 100);
    const timeSpent = Math.round((1800 - timeLeft) / 60); // in minutes
    
    setTimeout(() => {
      onComplete(score, timeSpent);
    }, 1000);
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Evaluación del Módulo</h1>
              <p className="text-gray-600">Pregunta {currentQuestion + 1} de {quiz.questions.length}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="h-5 w-5" />
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={onExit}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">{question.points} puntos</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h2>
              </div>
              
              {question.hints && (
                <button
                  onClick={useHint}
                  disabled={showHint}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="text-sm">Pista</span>
                </button>
              )}
            </div>

            {/* Question Content */}
            {question.type === 'multiple_choice' && (
              <div className="space-y-3">
                {question.options?.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      answers[question.id] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answers[question.id] === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[question.id] === option && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'simulation' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Simulación Interactiva</h3>
                  <p className="text-gray-600 mb-4">
                    Orden: Madrid → Londres vía ferry Santander-Portsmouth
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {['Tramo 1', 'Tramo 2', 'Tramo 3'].map((tramo, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{tramo}</h4>
                      <input
                        type="text"
                        placeholder="Origen → Destino"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        onChange={(e) => {
                          const tramos = answers[question.id]?.split(',') || ['', '', ''];
                          tramos[index] = `tramo${index + 1}:${e.target.value}`;
                          handleAnswer(question.id, tramos.join(','));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {question.type === 'document_upload' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Subir Documentación CMR</h3>
                <p className="text-gray-600 mb-4">
                  Arrastra y suelta tu archivo CMR o haz clic para seleccionar
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  className="hidden"
                  id="document-upload"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleAnswer(question.id, 'cmr_document_valid');
                    }
                  }}
                />
                <label
                  htmlFor="document-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Seleccionar Archivo
                </label>
              </div>
            )}

            {/* Hint */}
            <AnimatePresence>
              {showHint && question.hints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-1">Pista:</h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        {question.hints.map((hint, index) => (
                          <li key={index}>• {hint}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              
              <div className="text-sm text-gray-500">
                Pistas usadas: {hintsUsed}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!answers[question.id]}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting || Object.keys(answers).length < quiz.questions.length}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Finalizar Evaluación
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};