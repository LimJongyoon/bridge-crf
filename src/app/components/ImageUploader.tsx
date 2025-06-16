"use client";

import { useRef } from "react";

type Props = {
    patientId: string;
    name: string;
    uploadType: string; // 예: "PRE", "POST3M"
    onUploadComplete?: () => void; // ✅ 업로드 후 알려주는 콜백
};

export default function ImageUploader({ patientId, name, uploadType, onUploadComplete }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (!patientId || !name) {
            alert("Please enter patient ID and name first.");
            return;
        }
        inputRef.current?.click();
    };

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length !== 5) {
        alert("Error: You must upload exactly 5 photos.");
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
    }

    formData.append("patientId", patientId);
    formData.append("name", name);
    formData.append("uploadType", uploadType);

    try {
        const res = await fetch("http://localhost:3001/api/upload-images", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (res.ok && data.success) {
            alert("Upload successful!");
            onUploadComplete?.();
        } else {
            alert("Error: Upload failed.");
        }
    } catch (error) {
        console.error("Upload error:", error);
        alert("Error: Upload error.");
    }
};


    return (
        <div className="flex items-center space-x-2">
            <input
                type="file"
                accept="image/*"
                multiple
                ref={inputRef}
                onChange={handleUpload}
                className="hidden"
            />
            <button
                type="button"
                onClick={handleClick}
                className="bg-[#e6f0e6] text-[#2b362c] border-2 border-[#2b362c] px-4 py-2 rounded hover:bg-[#d0e8d0] shadow-sm"
                style={{ fontWeight: 550 }}
            >
                Upload Photos
            </button>
        </div>
    );
}
