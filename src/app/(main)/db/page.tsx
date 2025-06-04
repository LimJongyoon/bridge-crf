"use client";

import { useState } from "react";

// ✅ 예시 데이터 (추후 백엔드 연동 예정)
const dummyForms = [
  {
    patientId: "demo",
    name: "김데모",
    age: 32,
    followMonth: "3",
    followPeriod: "Short-term",
    stroke: "Yes",
    strokeTiming: "1",
    infarction: "No",
    bleeding: "Yes",
    bleedingTiming: "2",
    biaAlcl: "No",
    rippling: "Yes",
    ripplingTiming: "2.5",
  },
  {
    patientId: "demo2",
    name: "이데모",
    age: 45,
    followMonth: "12",
    followPeriod: "Long-term",
    capsularContracture: "Yes",
    capsularContractureTiming: "3",
    pain: "Yes",
    painTiming: "1",
    biaScc: "No",
    animationDeformity: "Yes",
  },
];

const positions = ["left-lateral", "left-oblique", "front", "right-oblique", "right-lateral"];
const months = [0, 3, 12, 24];

// ✅ 데이터 정규화 함수
function normalizeFormData(form: any): any {
  const followPeriod = form.followPeriod;

  const prefixMap: Record<string, string> = {
    "Short-term": "Short",
    "Intermediate-term": "Intermediate",
    "Long-term": "Long",
    "Delayed": "Delayed",
  };

  const prefix = prefixMap[followPeriod] || "Unknown";

  const baseFields = {
    patientId: form.patientId,
    name: form.name,
    age: form.age,
    followPeriod,
    followMonth: form.followMonth,
  };

  const complications = [
    "stroke",
    "infarction",
    "bleeding",
    "thromboembolism",
    "ulcer",
    "pain",
    "serousTumor",
    "infection",
    "breakage",
    "position",
    "lrDifference",
    "rotation",
    "exposure",
    "allergy",
    "biaAlcl",
    "biaScc",
    "delayedHematoma",
    "delayedSeroma",
    "rippling",
    "capsularContracture",
    "bakerClassification",
    "animationDeformity",
    "animationDistortion",
    "animationAwareness",
    "animationAssessment",
  ];

  const output: Record<string, any> = { ...baseFields };

  complications.forEach((key) => {
    const value = form[key];
    if (value !== undefined) {
      output[`${key}${prefix}`] = value;
    }

    const timingKey = `${key}Timing`;
    if (form[timingKey] !== undefined) {
      output[`${key}${prefix}Timing`] = form[timingKey];
    }
  });

  return output;
}

export default function DatabasePage() {
  const [selectedId, setSelectedId] = useState("");
  const [viewMode, setViewMode] = useState<"month" | "position">("month");

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const exportToCSV = () => {
    if (!dummyForms.length) return;

    const normalized = dummyForms.map(normalizeFormData);

    const headers = Array.from(
      new Set(normalized.flatMap((row) => Object.keys(row)))
    );
    const rows = normalized.map((row) =>
      headers.map((header) => `"${(row[header] ?? "").toString().replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    const csvWithBom = "\uFEFF" + csv;
    const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `patients-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Patient Database</h2>
        <button
          onClick={exportToCSV}
          className="bg-[#2b362c] text-white px-4 py-2 rounded hover:bg-[#3f4b3d]"
        >
          Export
        </button>
      </div>

      {/* Table */}
      <table className="w-full border mb-8 text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Age</th>
            <th className="p-2">Follow Period</th>
          </tr>
        </thead>
        <tbody>
          {dummyForms.map((form) => (
            <tr key={form.patientId} className="hover:bg-gray-50 cursor-pointer">
              <td
                className="p-2 text-blue-600 underline"
                onClick={() => handleSelect(form.patientId)}
              >
                {form.patientId}
              </td>
              <td className="p-2">{form.name}</td>
              <td className="p-2">{form.age}</td>
              <td className="p-2">{form.followPeriod}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Viewer Toggle */}
      {selectedId && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              🖼️ Clinical Photo Viewer: {selectedId}
            </h3>
            <button
              className="bg-gray-800 text-white px-3 py-1 rounded"
              onClick={() =>
                setViewMode(viewMode === "month" ? "position" : "month")
              }
            >
              {viewMode === "month" ? "촬영별 보기" : "개월별 보기"}
            </button>
          </div>

          {/* Grid */}
          {viewMode === "month" ? (
            <div className="space-y-6">
              {months.map((month) => (
                <div key={month}>
                  <div className="text-gray-400 text-sm mb-1">Month {month}</div>
                  <div className="flex gap-4 overflow-x-auto">
                    {positions.map((pos) => (
                      <img
                        key={`${month}-${pos}`}
                        src={
                          month === 0
                            ? `/images/${selectedId}/${pos}.jpg`
                            : `/images/${selectedId}/post-${month}-${pos}.jpg`
                        }
                        alt={`${pos}-${month}`}
                        className="h-60 border rounded object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {positions.map((pos) => (
                <div key={pos}>
                  <div className="text-gray-400 text-sm mb-1">
                    {pos.replace("-", " ")}
                  </div>
                  <div className="flex gap-4 overflow-x-auto">
                    {months.map((month) => (
                      <img
                        key={`${pos}-${month}`}
                        src={
                          month === 0
                            ? `/images/${selectedId}/${pos}.jpg`
                            : `/images/${selectedId}/post-${month}-${pos}.jpg`
                        }
                        alt={`${pos}-${month}`}
                        className="h-60 border rounded object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
