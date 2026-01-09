"use client";
import React, { useState, useEffect } from "react";
import { Button, message, Tooltip } from "antd";
import { SoundFilled, LoadingOutlined } from "@ant-design/icons";
import { fetchAudio } from "@/lib/api";

interface Props {
  text: string;
}

const AudioPlayer: React.FC<Props> = ({ text }) => {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handlePlay = async () => {
    if (!text) return;
    if (audioUrl) {
      new Audio(audioUrl).play().catch((e) => message.error("Lỗi phát: " + e));
      return;
    }

    setLoading(true);
    try {
      const audioBase64 = await fetchAudio(text);
      if (!audioBase64) throw new Error("No Data");

      const base64Content = audioBase64
        .replace(/^data:audio\/\w+;base64,/, "")
        .replace(/\s/g, "");
      const binaryString = window.atob(base64Content);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "audio/mpeg" });
      const newUrl = URL.createObjectURL(blob);
      setAudioUrl(newUrl);

      await new Audio(newUrl).play();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title="Nghe phát âm">
      <Button
        shape="circle"
        size="large"
        icon={loading ? <LoadingOutlined /> : <SoundFilled />}
        onClick={handlePlay}
        style={{
          color: "#d97757",
          borderColor: "#d97757",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        ghost
      />
    </Tooltip>
  );
};

export default AudioPlayer;
