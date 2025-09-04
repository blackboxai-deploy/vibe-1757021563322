// Types for the AI Chat App for Radiologists

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  images?: ImageAttachment[];
}

export interface ImageAttachment {
  id: string;
  file: File;
  base64: string;
  preview: string;
  type: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  systemPrompt: string;
  category: RadiologyCategory;
}

export interface RadiologyCase {
  id: string;
  patientId?: string;
  title: string;
  description: string;
  modality: RadiologyModality;
  findings: string;
  impression: string;
  chatSessionId: string;
  images: ImageAttachment[];
  createdAt: Date;
  updatedAt: Date;
  status: CaseStatus;
}

export type RadiologyModality = 
  | 'CT'
  | 'MRI'
  | 'X-Ray'
  | 'Ultrasound'
  | 'Nuclear Medicine'
  | 'Interventional'
  | 'Mammography'
  | 'Other';

export type RadiologyCategory = 
  | 'General Radiology'
  | 'CT Interpretation'
  | 'MRI Analysis'
  | 'X-Ray Review'
  | 'Interventional Radiology'
  | 'Pediatric Radiology'
  | 'Emergency Radiology'
  | 'Breast Imaging'
  | 'Neuroradiology'
  | 'Musculoskeletal'
  | 'Other';

export type CaseStatus = 'Draft' | 'In Progress' | 'Completed' | 'Archived';

export interface SystemPrompt {
  id: string;
  name: string;
  category: RadiologyCategory;
  prompt: string;
  description: string;
  isDefault: boolean;
}

export interface AIResponse {
  message: string;
  confidence?: number;
  references?: string[];
  suggestions?: string[];
}

export interface ChatContextType {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, images?: ImageAttachment[]) => Promise<void>;
  createNewSession: (systemPrompt: string, category: RadiologyCategory) => void;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  updateSystemPrompt: (prompt: string) => void;
}

export interface CasesContextType {
  cases: RadiologyCase[];
  currentCase: RadiologyCase | null;
  isLoading: boolean;
  error: string | null;
  createCase: (caseData: Partial<RadiologyCase>) => Promise<void>;
  updateCase: (caseId: string, updates: Partial<RadiologyCase>) => Promise<void>;
  deleteCase: (caseId: string) => Promise<void>;
  loadCase: (caseId: string) => Promise<void>;
  exportCase: (caseId: string, format: 'pdf' | 'json') => Promise<void>;
}