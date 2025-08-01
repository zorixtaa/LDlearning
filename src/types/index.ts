export interface User {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'trainer' | 'learner';
  department?: 'Frigo' | 'Tautliner' | 'Trucking' | 'Customs' | 'General';
  avatar?: string;
  bio?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  mfaEnabled?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topics: string[];
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string[];
  badge?: string;
  documentUrl?: string;
  version: string;
  lastUpdated: Date;
  isActive: boolean;
  requiredScore: number;
  maxAttempts: number;
}

export interface CourseBlock {
  id: string;
  type: 'lesson' | 'video' | 'pdf' | 'external' | 'quiz' | 'section';
  title: string;
  description?: string;
  resource?: string;
}

export interface Progress {
  userId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  score?: number;
  timeSpent: number; // in minutes
  attempts: number;
  completedAt?: Date;
  certificateId?: string;
  timeOnPage: number;
  interactions: number;
  lastActivity: Date;
}

export interface Quiz {
  id: string;
  moduleId: string;
  questions: Question[];
  passingScore: number;
  timeLimit: number; // in minutes
  adaptiveDifficulty: boolean;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'simulation' | 'document_upload';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hints?: string[];
}

export interface Certificate {
  id: string;
  userId: string;
  moduleId: string;
  issuedAt: Date;
  expiresAt?: Date;
  verificationCode: string;
  score: number;
  status: 'active' | 'expired' | 'revoked';
}

export interface Incident {
  id: string;
  userId: string;
  type: 'Reclamación' | 'No Conformidad';
  description: string;
  rootCause?: string;
  resolution?: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
  priority: 'low' | 'medium' | 'high';
  documents?: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirements: string[];
  category: 'completion' | 'performance' | 'specialty';
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface Analytics {
  userId: string;
  moduleId: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  interactions: InteractionEvent[];
  performance: PerformanceMetrics;
}

export interface InteractionEvent {
  type: 'click' | 'scroll' | 'pause' | 'resume' | 'answer' | 'hint';
  timestamp: Date;
  element?: string;
  value?: any;
}

export interface PerformanceMetrics {
  timeSpent: number;
  questionsAnswered: number;
  correctAnswers: number;
  hintsUsed: number;
  documentsUploaded: number;
  simulationsCompleted: number;
}

export interface Simulation {
  id: string;
  moduleId: string;
  type: 'romper_pedido' | 'documentation' | 'ferry_booking' | 'incident_report';
  title: string;
  scenario: string;
  steps: SimulationStep[];
  evaluation: EvaluationCriteria[];
}

export interface SimulationStep {
  id: string;
  instruction: string;
  type: 'drag_drop' | 'form_fill' | 'document_upload' | 'selection';
  elements: any[];
  validation: ValidationRule[];
}

export interface EvaluationCriteria {
  id: string;
  criterion: string;
  weight: number;
  passingScore: number;
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'format' | 'range' | 'custom';
  value?: any;
  message: string;
}