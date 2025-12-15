export enum ViewType {
  CHAT = 'CHAT',
  STUDIO = 'STUDIO',
  AUTOMATE = 'AUTOMATE',
  CODING = 'CODING',
  FITNESS = 'FITNESS',
  ROUTINE = 'ROUTINE',
  NEWS = 'NEWS',
  RAW = 'RAW'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  images?: ImageAttachment[];
}

export interface ImageAttachment {
  mimeType: string;
  data: string; // base64
}

export enum SocialPlatform {
  WHATSAPP = 'WhatsApp',
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  TELEGRAM = 'Telegram',
  LINKEDIN = 'LinkedIn',
  EMAIL = 'Email'
}

export enum ReplyTone {
  FORMAL = 'Formal',
  CASUAL = 'Casual',
  FUNNY = 'Funny',
  PROFESSIONAL = 'Professional',
  EMPATHETIC = 'Empathetic'
}

export enum IndianLanguage {
  ENGLISH = 'English',
  TAMIL = 'Tamil',
  TELUGU = 'Telugu',
  MALAYALAM = 'Malayalam',
  KANNADA = 'Kannada',
  HINDI = 'Hindi',
  BENGALI = 'Bengali',
  MARATHI = 'Marathi'
}

export interface GeneratedMedia {
  type: 'image' | 'video' | 'audio';
  url: string;
  prompt: string;
}

export interface NewsItem {
  text: string;
  sources: {
    web?: { uri: string; title: string };
  }[];
}

export type VideoAspectRatio = '16:9' | '9:16';

// Global interface for Veo key selection (AI Studio)
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}