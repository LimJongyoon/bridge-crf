"use client";

import { useState } from "react";

type ViewMode = "month" | "position";

export default function ClinicalViewerPage() {
  const [patientId, setPatientId] = useState("");
  const [confirmedId, setConfirmedId] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const positions = ["left-lateral", "left-oblique", "front", "right-oblique", "right-lateral"];
  const months = ["3M", "12M", "24M"]; // 문자열로
  const numImagesPerSet = 5; // 각 시기당 5장

  const handleConfirm = () => {
    if (patientId.trim()) {
      setConfirmedId(patientId.trim());
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📷 Clinical Photo Viewer</h2>

      {/* ID 입력 */}
      <div className="flex gap-3 mb-8">
        <input
          className="p-2 border rounded w-64"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
        />
        <button
          onClick={handleConfirm}
          className="bg-[#2b362c] text-white px-4 py-2 rounded hover:bg-[#3f4b3d]"
        >
          View
        </button>
        {confirmedId && (
          <button
            onClick={() => setViewMode(viewMode === "month" ? "position" : "month")}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            {viewMode === "month" ? "촬영별 보기" : "개월별 보기"}
          </button>
        )}
      </div>

      {/* 이미지 렌더링 */}
      {confirmedId && (
        <div className="space-y-10">
          {/* PRE 이미지 */}
<div>
  <div className="text-gray-500 text-sm mb-1">PRE</div>
  <div className="flex gap-4 flex-wrap">
    {Array.from({ length: numImagesPerSet }, (_, i) => (
      <img
        key={`PRE-${i}`}
        src={`/images/${confirmedId}/${confirmedId}_PRE_(${i + 1}).jpg`}
        className="h-60 object-contain border rounded"
        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        alt={`PRE-${i + 1}`}
      />
    ))}
  </div>
</div>

          {/* POST 이미지 */}
{viewMode === "month" ? (
  months.map((month) => (
    <div key={month}>
      <div className="text-gray-500 text-sm mb-1">POST-{month}</div>
      <div className="flex gap-4 flex-wrap">
        {Array.from({ length: numImagesPerSet }, (_, i) => (
          <img
            key={`${month}-${i}`}
            src={`/images/${confirmedId}/${confirmedId}_POST${month}_(${i + 1}).jpg`}
            className="h-60 object-contain border rounded"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            alt={`${month}-${i + 1}`}
          />
        ))}
      </div>
    </div>
  ))
          ) : (
            positions.map((pos) => (
              <div key={pos}>
                <div className="text-gray-500 text-sm mb-1">{pos.replace("-", " ")}</div>
                <div className="flex gap-4 overflow-x-auto">
                  {months.map((month) => (
                    <img
                      key={`${pos}-${month}`}
                      src={`/images/${confirmedId}/post-${month}-${pos}.jpg`}
                      className="h-60 object-contain border rounded"
                      onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.png")}
                      alt={`${pos}-${month}`}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
