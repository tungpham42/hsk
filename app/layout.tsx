import type { Metadata } from "next";
import { Merriweather, Nunito, Noto_Serif_SC } from "next/font/google";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";

// 1. Font cho văn bản dài, mang tính học thuật (Tiếng Việt/Anh)
const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["vietnamese"],
  variable: "--font-merriweather",
});

// 2. Font cho UI, nút bấm, tiêu đề nhỏ (Thân thiện, tròn trịa)
const nunito = Nunito({
  weight: ["400", "600", "700"],
  subsets: ["vietnamese"],
  variable: "--font-nunito",
});

// 3. Font CHUYÊN DỤNG cho tiếng Trung (Nét thanh đậm, đẹp như sách in)
const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "700"],
  subsets: ["latin"], // NextJS Google Font đôi khi cần preload: false nếu lỗi subset
  variable: "--font-noto-serif-sc",
  preload: false,
});

export const metadata: Metadata = {
  title: "HSK Study Corner",
  description: "Luyện thi HSK phong cách thư giãn",
  openGraph: {
    title: "HSK Study Corner",
    description: "Luyện thi HSK phong cách thư giãn",
    siteName: "HSK Study Corner",
    images: [
      {
        url: "https://hsk.soft.io.vn/1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "HSK Study Corner",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${merriweather.variable} ${nunito.variable} ${notoSerifSC.variable}`}
      >
        <AntdRegistry>
          {/* Cấu hình Antd sang tông màu Ấm (Warm) */}
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#d97757", // Terracotta
                borderRadius: 12, // Bo tròn mềm mại
                fontFamily: "var(--font-nunito)",
                colorText: "#3c3836",
                colorBgContainer: "#ffffff",
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
