// types/index.ts

export interface Question {
  id: number;
  chinese: string; // Câu tiếng Trung
  pinyin: string; // Phiên âm
  meaning: string; // Nghĩa tiếng Việt
  options: string[]; // 4 đáp án lựa chọn
  correctIndex: number; // Index đáp án đúng (0-3)
  explanation: string; // Giải thích ngắn gọn
}

export interface AIResponse {
  result: string;
  used_model: string;
}

export interface TTSResponse {
  audioContent: string; // Base64 string
}
