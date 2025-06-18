"use client";

import { useRef } from "react";

type Props = {
  patientId: string;
  name: string;
  month?: string; // ✅ month는 follow-up일 경우만 필요
  requireMonth?: boolean; // ✅ true일 경우 month까지 체크
  onFilesSelected: (files: File[]) => void;
    uploadType?: string; // 선택적 prop
};

export default function ImageUploader({
  patientId,
  name,
  month,
  requireMonth = false,
  onFilesSelected,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!patientId.trim() || !name.trim()) {
      alert("Please enter Patient ID and Name first.");
      return;
    }

    if (requireMonth && (!month || month.trim() === "")) {
      alert("Please enter Follow-up month.");
      return;
    }

    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length !== 5) {
      alert("You must select exactly 5 photos.");
      return;
    }
    onFilesSelected(Array.from(files));
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="file"
        accept="image/*"
        multiple
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        className="bg-[#e6f0e6] text-[#2b362c] border-2 border-[#2b362c] px-4 py-2 rounded hover:bg-[#d0e8d0] shadow-sm"
        style={{ fontWeight: 550 }}
      >
        Select Photos
      </button>
    </div>
  );
}
