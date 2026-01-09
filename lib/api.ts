// lib/api.ts
import axios from "axios";
import { AIResponse, TTSResponse } from "@/types";

const TTS_ENDPOINT = "https://googlespeak.netlify.app/api/tts";
const AI_ENDPOINT = "https://groqprompt.netlify.app/api/ai";

// 1. Hàm gọi TTS
export const fetchAudio = async (text: string): Promise<string | null> => {
  try {
    console.log("Đang gọi TTS với text:", text); // Log 1

    const response = await axios.get<TTSResponse>(TTS_ENDPOINT, {
      params: {
        lang: "zh",
        text: text,
      },
    });

    // Log 2: Kiểm tra dữ liệu thực tế
    console.log("Dữ liệu TTS trả về:", response.data);

    if (!response.data || !response.data.audioContent) {
      console.error("API không trả về audioContent!");
      return null;
    }

    return response.data.audioContent;
  } catch (error) {
    console.error("Lỗi gọi API TTS:", error);
    return null;
  }
};

// 2. Hàm gọi AI
export const fetchQuiz = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post<AIResponse>(AI_ENDPOINT, {
      prompt: prompt,
    });
    return response.data.result;
  } catch (error) {
    console.error("Lỗi AI:", error);
    throw new Error("Không thể tạo câu hỏi lúc này.");
  }
};
