// ==================== Enums ====================

export enum AppMode {
  CHAT = 'CHAT',
  MEDIA_STUDIO = 'MEDIA_STUDIO',
  OFFICE_ASSISTANT = 'OFFICE_ASSISTANT',
  LIFE_COACH = 'LIFE_COACH',
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export enum ErrorType {
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN'
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export enum FocusMode {
  GENERAL = 'GENERAL',
  CODING = 'CODING'
}

// ==================== Interfaces ====================

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  image?: string; // base64 or data URL
  audio?: string; // base64 or data URL
  isError?: boolean;
  groundingUrls?: GroundingUrl[];
}

export interface GroundingUrl {
  uri: string;
  title: string;
}

export interface GeneratedMedia {
  id: string;
  type: MediaType;
  url: string; // Blob URL or Data URL
  prompt: string;
  timestamp: number;
  error?: string;
}

export interface Slide {
  title: string;
  bullets: string[];
}

export interface Presentation {
  topic: string;
  slides: Slide[];
  generatedAt: number;
}

export interface FormattedReply {
  original: string;
  platform: string;
  tone: string;
  reply: string;
  generatedAt: number;
}

// ==================== API Response Types ====================

export interface ChatResponse {
  text: string;
  groundingUrls?: GroundingUrl[];
}

export interface ApiError {
  type: ErrorType;
  message: string;
  details?: unknown;
  statusCode?: number;
}

export interface GenerationConfig {
  model: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
}

// ==================== Utility Types ====================

export type AsyncTask<T> = {
  loading: boolean;
  error: ApiError | null;
  data: T | null;
};

export type ChatFocus = FocusMode.GENERAL | FocusMode.CODING;
