"use client";

import Link from "next/link";
import { Card, Typography, Row, Col } from "antd";
import { ReadOutlined } from "@ant-design/icons"; // Thêm icon sách để tăng cảm giác học thuật

const { Title, Paragraph, Text } = Typography;

const levels = [1, 2, 3, 4, 5, 6];

export default function Home() {
  return (
    <main className="full-screen-center">
      <div style={{ maxWidth: 1000, width: "100%", textAlign: "center" }}>
        {/* === HEADER SECTION === */}
        <div style={{ marginBottom: 56 }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "3px",
              color: "#d97757",
              fontWeight: "bold",
              fontSize: 12,
              marginBottom: 8,
              fontFamily: "var(--font-nunito)",
            }}
          >
            Study Corner
          </p>
          <Title
            style={{
              margin: "0 0 16px 0",
              color: "#3c3836",
              fontFamily: "var(--font-vi-serif)", // Font Serif tạo vẻ trang trọng, hàn lâm
              fontSize: 56, // Tăng kích thước tiêu đề
              fontWeight: 400,
            }}
          >
            Luyện Thi HSK AI
          </Title>
          <Paragraph
            style={{
              fontSize: 20,
              color: "#7c7572", // Màu xám ấm
              fontFamily: "var(--font-vi-serif)",
              fontStyle: "italic",
              fontWeight: 300,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Không gian luyện nghe và ôn tập từ vựng nhẹ nhàng cùng trợ lý AI.
          </Paragraph>
        </div>

        {/* === GRID SECTION === */}
        <Row gutter={[32, 32]}>
          {levels.map((level) => (
            <Col xs={24} sm={12} md={8} key={level}>
              <Link
                href={`/cap-do/${level}`}
                style={{ display: "block", textDecoration: "none" }}
              >
                <Card
                  hoverable
                  bordered={false} // Bỏ viền để trông sạch sẽ hơn
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: 24, // Bo góc lớn hơn cho mềm mại
                    backgroundColor: "#ffffff",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.03)", // Đổ bóng rất nhẹ
                    height: "100%",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  styles={{ body: { padding: "48px 24px" } }}
                >
                  {/* Icon trang trí */}
                  <div style={{ marginBottom: 20 }}>
                    <ReadOutlined
                      style={{ fontSize: 36, color: "#d97757", opacity: 0.8 }}
                    />
                  </div>

                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#3c3836",
                      marginBottom: 8,
                      fontFamily: "var(--font-vi-serif)",
                    }}
                  >
                    HSK <span style={{ color: "#d97757" }}>{level}</span>
                  </Title>

                  <Text
                    style={{
                      color: "#9ca3af",
                      fontSize: 16,
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    Luyện tập từ vựng & ngữ pháp
                  </Text>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        {/* Footer Text nhỏ */}
        <div style={{ marginTop: 64, opacity: 0.5 }}>
          <Text style={{ fontFamily: "var(--font-nunito)", color: "#7c7572" }}>
            Designed for Vietnamese Learners
          </Text>
        </div>
      </div>
    </main>
  );
}
