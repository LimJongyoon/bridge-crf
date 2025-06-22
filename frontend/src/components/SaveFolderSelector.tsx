"use client";

import { useState, useEffect } from "react";

export default function SaveFolderSelector() {
  const [folderPath, setFolderPath] = useState<string>("");

  // 현재 저장된 경로 불러오기
  useEffect(() => {
    fetch("http://localhost:3001/api/get-image-path")
      .then((res) => res.json())
      .then((data) => {
        if (data.imageBasePath) setFolderPath(data.imageBasePath);
      })
      .catch((err) => {
        console.error("Failed to fetch image path:", err);
      });
  }, []);

  const handleSetFolder = async () => {
    if (typeof window !== "undefined" && window.electronAPI?.selectFolder) {
      const selectedPath = await window.electronAPI.selectFolder();

      if (selectedPath) {
        try {
          const res = await fetch("http://localhost:3001/api/set-image-path", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBasePath: selectedPath }),
          });

          const data = await res.json();
          if (data.imageBasePath) {
            setFolderPath(data.imageBasePath);
            alert("✅ Save folder has been updated.");
          } else {
            alert("❌ Failed to save to server.");
          }
        } catch (err) {
          alert("❌ Failed to communicate with server.");
          console.error(err);
        }
      } else {
        alert("❌ Folder selection canceled.");
      }
    } else {
      alert("❌ This feature is only available in the Electron app.");
    }
  };

  return (
    <div className="inline-block mr-2">
      <button
        onClick={handleSetFolder}
        className="bg-[#e6f0e6] text-[#2b362c] border-2 border-[#2b362c] px-4 py-2 rounded hover:bg-[#d0e8d0] shadow-sm w-[180px]"
        style={{ fontWeight: 550 }}
      >
        Set Save Folder
      </button>
      {folderPath && (
        <div className="text-xs text-gray-700 mt-1">
          📁 <strong>{folderPath}</strong>
        </div>
      )}
    </div>
  );
}
