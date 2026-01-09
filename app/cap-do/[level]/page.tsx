"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Spin,
  Button,
  Result,
  Typography,
  Progress,
  Flex,
  Tabs,
  Input,
  Space,
  Tag,
  message,
} from "antd";
// Đảm bảo import đúng hàm generateWritingPrompt vừa tạo (hoặc viết trực tiếp)
import { fetchQuiz } from "@/lib/api";
import { generateHSKPrompt, generateWritingPrompt } from "@/lib/prompts";
import { Question } from "@/types";
import QuestionCard from "@/components/QuestionCard";
import HanziPlayer from "@/components/HanziPlayer";
import {
  LeftOutlined,
  ReloadOutlined,
  ReadOutlined,
  EditOutlined,
  SearchOutlined,
  BulbOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const level = params.level as string;

  // --- States cho phần TRẮC NGHIỆM ---
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // --- States cho phần TẬP VIẾT ---
  const [writingChar, setWritingChar] = useState("爱");
  const [suggestedChars, setSuggestedChars] = useState<string[]>([]); // Danh sách gợi ý
  const [writingLoading, setWritingLoading] = useState(false); // Loading cho phần viết

  // --- Logic Load Đề (Quiz) ---
  const loadQuestions = async () => {
    setLoading(true);
    setCompleted(false);
    setCurrentIndex(0);
    setScore(0);
    try {
      const prompt = generateHSKPrompt(level);
      const rawResult = await fetchQuiz(prompt);

      const jsonMatch = rawResult.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawResult;

      const parsedData: Question[] = JSON.parse(jsonString);
      setQuestions(parsedData);
    } catch (error) {
      console.error("Parse Quiz Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (level) loadQuestions();
  }, [level]); // eslint-disable-line

  // --- Logic Load Gợi Ý Từ Vựng (Writing) ---
  const handleGetWritingSuggestions = async () => {
    setWritingLoading(true);
    try {
      // Gọi API với prompt xin từ vựng đơn lẻ
      const prompt = generateWritingPrompt(level);
      const rawResult = await fetchQuiz(prompt); // Tận dụng hàm fetchQuiz (bản chất là gọi AI)

      const jsonMatch = rawResult.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawResult;

      const chars: string[] = JSON.parse(jsonString);

      if (Array.isArray(chars) && chars.length > 0) {
        setSuggestedChars(chars);
        setWritingChar(chars[0]); // Tự động chọn chữ đầu tiên
        message.success("Đã tạo danh sách từ vựng mới!");
      }
    } catch (error) {
      console.error("Parse Writing Error", error);
      message.error("Không lấy được từ vựng, vui lòng thử lại.");
    } finally {
      setWritingLoading(false);
    }
  };

  // --- Handlers Trắc Nghiệm ---
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((prev) => prev + 1);
  };

  // --- Render Content: Quiz Mode ---
  const renderQuizContent = () => {
    if (loading) {
      return (
        <Flex
          vertical
          align="center"
          justify="center"
          style={{ minHeight: "50vh" }}
        >
          <Spin size="large" />
          <Text
            style={{
              marginTop: 24,
              color: "#7c7572",
              fontFamily: "var(--font-vi-serif)",
            }}
          >
            Đang nhờ AI soạn đề HSK {level}...
          </Text>
        </Flex>
      );
    }
    // ... (Giữ nguyên phần hiển thị kết quả quiz của bạn)
    if (completed) {
      const percentage = Math.round((score / questions.length) * 100);
      return (
        <Flex align="center" justify="center" style={{ padding: 24 }}>
          <Result
            status={percentage >= 50 ? "success" : "warning"}
            title={`${
              percentage >= 50 ? "Chúc mừng bạn!" : "Cần cố gắng hơn!"
            }`}
            subTitle={`Điểm số: ${score} / ${questions.length} (${percentage}%)`}
            extra={[
              <Button
                key="retry"
                type="primary"
                icon={<ReloadOutlined />}
                onClick={loadQuestions}
              >
                Luyện đề mới
              </Button>,
            ]}
          />
        </Flex>
      );
    }

    return (
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {questions.length > 0 && (
          <>
            <div style={{ marginBottom: 24, textAlign: "right" }}>
              <Text style={{ color: "#7c7572" }}>
                Câu {currentIndex + 1}/{questions.length}
              </Text>
              <Progress
                percent={Math.round(
                  ((currentIndex + 1) / questions.length) * 100
                )}
                size="small"
                showInfo={false}
                strokeColor="#7da87b"
                railColor="#e6e2dd"
              />
            </div>
            <QuestionCard
              key={currentIndex}
              data={questions[currentIndex]}
              onNext={handleNext}
              onAnswer={handleAnswer}
            />
          </>
        )}
      </div>
    );
  };

  // --- Render Content: Writing Mode (ĐÃ CẬP NHẬT) ---
  const renderWritingContent = () => {
    return (
      <Flex vertical align="center" gap="middle" style={{ padding: "20px 0" }}>
        {/* Khu vực điều khiển */}
        <Space
          direction="vertical"
          align="center"
          size="large"
          style={{ width: "100%" }}
        >
          <Flex gap="small" wrap="wrap" justify="center">
            <Input.Search
              placeholder="Nhập thủ công..."
              enterButton={<Button icon={<SearchOutlined />}>Đổi</Button>}
              onSearch={(val) => {
                if (val) setWritingChar(val[0]);
              }}
              maxLength={1}
              style={{ width: 200 }}
            />

            <Button
              type="primary"
              icon={writingLoading ? <Spin size="small" /> : <BulbOutlined />}
              onClick={handleGetWritingSuggestions}
              disabled={writingLoading}
              style={{ backgroundColor: "#faad14" }}
            >
              {writingLoading ? "Đang tìm..." : "AI Gợi ý từ vựng"}
            </Button>
          </Flex>

          {/* Danh sách gợi ý từ AI */}
          {suggestedChars.length > 0 && (
            <div style={{ textAlign: "center", maxWidth: 600 }}>
              <Text
                type="secondary"
                style={{ fontSize: 12, display: "block", marginBottom: 8 }}
              >
                Click vào chữ bên dưới để tập viết:
              </Text>
              <Flex wrap="wrap" gap="8px" justify="center">
                {suggestedChars.map((char, idx) => (
                  <Tag.CheckableTag
                    key={idx}
                    checked={writingChar === char}
                    onChange={() => setWritingChar(char)}
                    style={{
                      fontSize: 18,
                      padding: "4px 12px",
                      border:
                        writingChar === char
                          ? "1px solid #1677ff"
                          : "1px solid #d9d9d9",
                    }}
                  >
                    {char}
                  </Tag.CheckableTag>
                ))}
              </Flex>
            </div>
          )}
        </Space>

        {/* Component Tập Viết */}
        <div style={{ marginTop: 20 }}>
          <HanziPlayer key={writingChar} character={writingChar} size={300} />
        </div>

        <Text type="secondary" style={{ fontSize: 12 }}>
          * Hệ thống chấm điểm từng nét. Bấm &ldquo;AI Gợi ý&rdquo; để lấy từ
          mới theo HSK {level}.
        </Text>
      </Flex>
    );
  };

  // --- Main Render (Giữ nguyên structure cũ) ---
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        backgroundColor: "var(--bg-paper)",
      }}
    >
      {/* Header Area... (Giữ nguyên như code cũ) */}
      <Flex
        justify="space-between"
        align="center"
        style={{ width: "100%", maxWidth: 900, margin: "0 auto 16px auto" }}
      >
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => router.push("/")}
          style={{ color: "#7c7572", fontWeight: 500, paddingLeft: 0 }}
        >
          Thoát
        </Button>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: 2,
              color: "#d97757",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            HSK Level {level}
          </p>
          <Title
            level={4}
            style={{
              margin: 0,
              fontFamily: "var(--font-vi-serif)",
              color: "#3c3836",
            }}
          >
            Practice Room
          </Title>
        </div>
        <div style={{ width: 64 }}></div>
      </Flex>

      {/* Tabs Layout */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Tabs
          defaultActiveKey="quiz"
          type="card"
          centered
          size="large"
          items={[
            {
              key: "quiz",
              label: (
                <span style={{ fontFamily: "var(--font-vi-serif)" }}>
                  <ReadOutlined /> Trắc Nghiệm
                </span>
              ),
              children: renderQuizContent(),
            },
            {
              key: "writing",
              label: (
                <span style={{ fontFamily: "var(--font-vi-serif)" }}>
                  <EditOutlined /> Tập Viết
                </span>
              ),
              children: renderWritingContent(),
            },
          ]}
        />
      </div>
    </div>
  );
}
