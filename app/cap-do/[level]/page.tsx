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
} from "antd";
import { fetchQuiz } from "@/lib/api";
import { generateHSKPrompt } from "@/lib/prompts";
import { Question } from "@/types";
import QuestionCard from "@/components/QuestionCard";
import HanziPlayer from "@/components/HanziPlayer"; // Đảm bảo bạn đã tạo component này
import {
  LeftOutlined,
  ReloadOutlined,
  ReadOutlined,
  EditOutlined,
  SearchOutlined,
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
  const [writingChar, setWritingChar] = useState("爱"); // Chữ mặc định

  // --- Logic Load Đề (AI) ---
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
      console.error("Parse Error or API Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (level) loadQuestions();
  }, [level]); // eslint-disable-line

  // --- Handlers Trắc Nghiệm ---
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
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
              fontSize: 16,
              fontFamily: "var(--font-vi-serif)",
            }}
          >
            Đang nhờ AI soạn đề HSK {level}...
          </Text>
        </Flex>
      );
    }

    if (completed) {
      const percentage = Math.round((score / questions.length) * 100);
      return (
        <Flex align="center" justify="center" style={{ padding: 24 }}>
          <Result
            status={percentage >= 50 ? "success" : "warning"}
            title={
              <span
                style={{ fontFamily: "var(--font-vi-serif)", color: "#3c3836" }}
              >
                {percentage >= 50 ? "Chúc mừng bạn!" : "Cần cố gắng hơn!"}
              </span>
            }
            subTitle={
              <div style={{ fontSize: 16 }}>
                Bạn đã hoàn thành bộ đề HSK {level}.<br />
                <b>
                  Điểm số: {score} / {questions.length}
                </b>{" "}
                ({percentage}%)
              </div>
            }
            extra={[
              <Button
                type="primary"
                key="retry"
                size="large"
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
                style={{ marginTop: 8 }}
              />
            </div>
            <QuestionCard
              data={questions[currentIndex]}
              onNext={handleNext}
              onAnswer={handleAnswer}
            />
          </>
        )}
      </div>
    );
  };

  // --- Render Content: Writing Mode ---
  const renderWritingContent = () => {
    return (
      <Flex vertical align="center" gap="large" style={{ padding: "20px 0" }}>
        <Space direction="vertical" align="center">
          <Text
            style={{
              fontFamily: "var(--font-vi-serif)",
              fontSize: 16,
              color: "#555",
            }}
          >
            Nhập chữ Hán bạn muốn tập viết (ví dụ: 我, 你, HSK...)
          </Text>
          <Input.Search
            placeholder="Nhập 1 chữ Hán..."
            enterButton={<Button icon={<SearchOutlined />}>Đổi chữ</Button>}
            size="large"
            style={{ maxWidth: 300 }}
            onSearch={(val) => {
              if (val) setWritingChar(val[0]);
            }}
            maxLength={1}
          />
        </Space>

        {/* Component Tập Viết */}
        <div style={{ marginTop: 20 }}>
          <HanziPlayer character={writingChar} size={300} />
        </div>

        <Text type="secondary" style={{ fontSize: 12 }}>
          * Hệ thống sẽ chấm điểm từng nét viết của bạn.
        </Text>
      </Flex>
    );
  };

  // --- Main Render ---
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        backgroundColor: "var(--bg-paper)",
      }}
    >
      {/* Header Area */}
      <Flex
        justify="space-between"
        align="center"
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto 16px auto",
        }}
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
              marginBottom: 4,
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
        <div style={{ width: 64 }}></div> {/* Spacer để cân đối header */}
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
                  <ReadOutlined /> Luyện Đề (Quiz)
                </span>
              ),
              children: renderQuizContent(),
            },
            {
              key: "writing",
              label: (
                <span style={{ fontFamily: "var(--font-vi-serif)" }}>
                  <EditOutlined /> Tập Viết (Writing)
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
