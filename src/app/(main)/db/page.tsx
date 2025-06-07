"use client";

import { useState, useEffect } from "react";

type DummyForm = {
  [key: string]: any;
};
type DummyFormKey = keyof DummyForm;

const months = [0, 3, 12, 24];
const positions = ["left-lateral", "left-oblique", "front", "right-oblique", "right-lateral"];

export default function DatabasePage() {
  const [forms, setForms] = useState<DummyForm[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [viewMode, setViewMode] = useState<"month" | "position">("month");

  useEffect(() => {
    fetch("http://localhost:3001/api/get-all-patients")
      .then((res) => res.json())
      .then((data) => {
        setForms(data.patients); // 서버에서 { patients: [...] } 형식으로 보내주면 됨
      });
  }, []);

  const exportToCSV = () => {
    const allKeys = new Set<string>();
    forms.forEach((form) => {
      Object.keys(form).forEach((key) => allKeys.add(key));
    });
    const headers = Array.from(allKeys);
    const rows = forms.map((form) =>
      headers
        .map((key) => {
          const value = form[key as DummyFormKey];
          return `"${(value ?? "").toString().replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patients-${Date.now()}.csv`;
    a.click();
  };

  const headers = [
    "patientId", "name", "age", "followPeriod", "followMonth",
    "strokeShort", "myocardialShort", "bleedingShort", "thromboembolismShort",
    "skinNecrosisShort", "painShort", "serousTumorShort", "infectionShort", "breakageShort",
    "positionShort", "lrDifferenceShort", "rotationShort", "exposureShort", "allergyShort",
    "biaSccLong", "capsularContractureLong", "painLong", "rippling", "bakerClassificationLong",
    "infectionLong", "breakageLong", "positionLong", "lrDifferenceLong",
    "rotationLong", "exposureLong", "allergyLong", "biaAlclLong", "delayedHematomaLong", "delayedSeromaLong",
  ];

  return (
    <div className="max-w-[95vw] mx-auto p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📁 Patient Database</h2>
        <button
          onClick={exportToCSV}
          className="bg-[#2b362c] text-white px-4 py-2 rounded hover:bg-[#3f4b3d]"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded mb-10">
        <table className="table-auto border-collapse text-sm min-w-max w-full">
          <thead>
            <tr>
              <th colSpan={5} className="px-2 py-1 bg-gray-200 border text-xs text-center">Info</th>
              <th colSpan={14} className="px-2 py-1 bg-gray-200 border text-xs text-center">Short-term</th>
              <th colSpan={20} className="px-2 py-1 bg-gray-200 border text-xs text-center">Long-term</th>
            </tr>
            <tr>
              {headers.map((col) => (
                <th key={col} className="px-2 py-1 bg-gray-100 border whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr
                key={form.patientId}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedId(form.patientId)}
              >
                {headers.map((col) => (
                  <td key={col} className="px-2 py-1 border text-center whitespace-nowrap">
                    {form[col as DummyFormKey] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Viewer */}
      {selectedId && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              🖼️ Clinical Photo Viewer: {selectedId}
            </h3>
            <button
              onClick={() => setViewMode(viewMode === "month" ? "position" : "month")}
              className="bg-gray-800 text-white px-3 py-1 rounded"
            >
              {viewMode === "month" ? "촬영별 보기" : "개월별 보기"}
            </button>
          </div>

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
                  <div className="text-gray-400 text-sm mb-1">{pos.replace("-", " ")}</div>
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
