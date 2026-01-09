// lib/prompts.ts

export const generateHSKPrompt = (level: string) => {
  return `
    Đóng vai một giáo viên tiếng Trung chuyên nghiệp. 
    Hãy tạo ra 5 câu hỏi trắc nghiệm luyện thi HSK cấp độ ${level}.
    
    YÊU CẦU BẮT BUỘC VỀ OUTPUT:
    1. Chỉ trả về một chuỗi JSON duy nhất, không có markdown (như \`\`\`json), không có lời dẫn.
    2. Cấu trúc JSON phải là một mảng các object như sau:
    [
      {
        "id": 1,
        "chinese": "Câu tiếng Trung hoặc từ vựng",
        "pinyin": "Phiên âm pinyin",
        "meaning": "Nghĩa tiếng Việt của câu",
        "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
        "correctIndex": 0, // Số nguyên từ 0-3 chỉ định đáp án đúng
        "explanation": "Giải thích ngắn bằng tiếng Việt tại sao chọn đáp án đó"
      }
    ]
    
    Nội dung phải phù hợp với từ vựng HSK ${level}. Đảm bảo tiếng Việt tự nhiên.
  `;
};
