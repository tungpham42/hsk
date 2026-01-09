"use client";

import React, { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import { Button, Card, message } from "antd";
import { PlayCircleOutlined, EditOutlined } from "@ant-design/icons";

interface HanziPlayerProps {
  character: string;
  size?: number;
}

const HanziPlayer: React.FC<HanziPlayerProps> = ({ character, size = 300 }) => {
  const writerRef = useRef<HanziWriter | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [isQuizzing, setIsQuizzing] = useState(false);

  useEffect(() => {
    const currentTarget = targetRef.current;
    if (currentTarget) {
      // Khởi tạo HanziWriter
      writerRef.current = HanziWriter.create(currentTarget, character, {
        width: size,
        height: size,
        padding: 5,
        showOutline: true,
        strokeAnimationSpeed: 1, // Tốc độ vẽ mẫu
        delayBetweenStrokes: 200, // Thời gian nghỉ giữa các nét
        radicalColor: "#1677ff", // Màu của bộ thủ (nếu có)
      });
    }

    // Cleanup khi component unmount
    return () => {
      if (currentTarget) {
        currentTarget.innerHTML = "";
      }
    };
  }, [character, size]);

  // Chức năng: Xem viết mẫu
  const animate = () => {
    if (writerRef.current) {
      setIsQuizzing(false);
      writerRef.current.animateCharacter();
    }
  };

  // Chức năng: Bắt đầu tập viết (Quiz)
  const startQuiz = () => {
    if (writerRef.current) {
      setIsQuizzing(true);
      writerRef.current.quiz({
        onMistake: function () {
          message.error("Sai nét rồi! Hãy thử lại.");
        },
        onCorrectStroke: function (strokeData) {
          console.log("Đúng nét: " + strokeData.strokeNum);
        },
        onComplete: function () {
          message.success(`Tuyệt vời! Bạn đã viết đúng trọn vẹn.`);
          setIsQuizzing(false);
        },
      });
    }
  };

  return (
    <Card
      title={`Tập viết chữ: ${character}`}
      style={{ width: "fit-content", margin: "0 auto" }}
      actions={[
        <Button
          key="animate"
          icon={<PlayCircleOutlined />}
          onClick={animate}
          disabled={isQuizzing}
        >
          Xem mẫu
        </Button>,
        <Button
          key="quiz"
          type="primary"
          icon={<EditOutlined />}
          onClick={startQuiz}
        >
          Tập viết
        </Button>,
      ]}
    >
      <div
        ref={targetRef}
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          background:
            "url('https://upload.wikimedia.org/wikipedia/commons/8/87/Grid_layout.svg') center/cover no-repeat", // Hình nền ô chữ điền
        }}
      />
      <div style={{ marginTop: 10, textAlign: "center", color: "#888" }}>
        {isQuizzing
          ? "Đang chế độ tập viết (Dùng chuột/tay vẽ vào ô)"
          : 'Chọn "Tập viết" để bắt đầu'}
      </div>
    </Card>
  );
};

export default HanziPlayer;
