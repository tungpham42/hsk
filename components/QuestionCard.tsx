"use client";
import React, { useState } from "react";
import { Card, Button, Tag, Typography, Row, Col, Flex } from "antd";
import { Question } from "@/types";
import AudioPlayer from "./AudioPlayer";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

interface Props {
  data: Question;
  onNext: () => void;
  // 1. Thêm định nghĩa prop mới
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionCard: React.FC<Props> = ({ data, onNext, onAnswer }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    if (!isSubmitted) setSelected(idx);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // 2. Gọi hàm chấm điểm ngay khi nộp bài
    const isCorrect = selected === data.correctIndex;
    onAnswer(isCorrect);
  };

  // ... (Phần render giữ nguyên như cũ)
  return (
    <Card
      bordered={false}
      style={{
        width: "100%",
        maxWidth: 800,
        margin: "32px auto",
        borderRadius: 24,
        backgroundColor: "#fff",
      }}
      bodyStyle={{ padding: 40 }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: 32 }}>
        <Tag
          color="orange"
          style={{
            padding: "4px 12px",
            borderRadius: 99,
            border: "none",
            backgroundColor: "#fff7e6",
            color: "#d46b08",
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          HSK QUESTION
        </Tag>
        <AudioPlayer text={data.chinese} />
      </Flex>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 48,
            marginBottom: 16,
            color: "#3c3836",
            fontFamily: "var(--font-noto-serif-sc)",
            lineHeight: 1.4,
            fontWeight: 400,
            marginTop: 0,
          }}
        >
          {data.chinese}
        </h1>
        <Text
          style={{
            fontSize: 20,
            color: "#7c7572",
            fontFamily: "var(--font-vi-serif)",
            fontStyle: "italic",
          }}
        >
          {data.pinyin}
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {data.options.map((opt, idx) => {
          const cardStyle: React.CSSProperties = {
            padding: 16,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            border: "2px solid transparent",
            transition: "all 0.2s",
            backgroundColor: "#fff",
          };

          let icon = null;

          if (selected === idx && !isSubmitted) {
            cardStyle.borderColor = "#d97757";
            cardStyle.backgroundColor = "#fff5f2";
          } else {
            cardStyle.borderColor = "#f0f0f0";
          }

          if (isSubmitted) {
            cardStyle.cursor = "default";
            if (idx === data.correctIndex) {
              cardStyle.borderColor = "#7da87b";
              cardStyle.backgroundColor = "#f0f9eb";
              icon = (
                <CheckCircleFilled style={{ color: "#7da87b", fontSize: 20 }} />
              );
            } else if (idx === selected && idx !== data.correctIndex) {
              cardStyle.borderColor = "#e06c75";
              cardStyle.backgroundColor = "#fff1f0";
              icon = (
                <CloseCircleFilled style={{ color: "#e06c75", fontSize: 20 }} />
              );
            } else {
              cardStyle.opacity = 0.5;
            }
          }

          return (
            <Col xs={24} md={12} key={idx}>
              <div onClick={() => handleSelect(idx)} style={cardStyle}>
                <span
                  style={{ fontSize: 16, fontWeight: 500, color: "#3c3836" }}
                >
                  {opt}
                </span>
                {icon}
              </div>
            </Col>
          );
        })}
      </Row>

      {isSubmitted && (
        <div
          className="fade-in-box"
          style={{
            backgroundColor: "#fdfbf7",
            padding: 24,
            borderRadius: 12,
            border: "1px solid #efebe9",
          }}
        >
          <Paragraph
            style={{
              fontSize: 18,
              marginBottom: 8,
              fontFamily: "var(--font-vi-serif)",
            }}
          >
            <strong style={{ color: "#3c3836" }}>Nghĩa:</strong> {data.meaning}
          </Paragraph>
          <Paragraph
            style={{ color: "#595959", fontWeight: 300, lineHeight: 1.6 }}
          >
            <span style={{ fontWeight: 600, color: "#d97757" }}>
              Giải thích:
            </span>{" "}
            {data.explanation}
          </Paragraph>

          <Button
            type="primary"
            size="large"
            onClick={onNext}
            block
            style={{
              marginTop: 16,
              height: 48,
              fontSize: 18,
              fontFamily: "var(--font-nunito)",
              boxShadow: "none",
            }}
          >
            Câu tiếp theo
          </Button>
        </div>
      )}

      {!isSubmitted && (
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          disabled={selected === null}
          block
          style={{
            height: 48,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Kiểm tra kết quả
        </Button>
      )}
    </Card>
  );
};

export default QuestionCard;
