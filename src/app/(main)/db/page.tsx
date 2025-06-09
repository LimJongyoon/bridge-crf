"use client";

import { useState, useEffect } from "react";

type DummyForm = Record<string, string | number | boolean | null | undefined>;
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
        setForms(data.patients);
      });
  }, []);

  const exportToCSV = () => {
    const rows = forms.map((form) =>
      headers
        .map((key) => {
          const value = form[key as DummyFormKey];
          return `"${(value === null || value === undefined ? "" : String(value)).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [headerLabels.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patients-${Date.now()}.csv`;
    a.click();
  };

  // Header Groups 정의
  const headerGroups = [
    { label: "Patient Info", span: 5 },
    { label: "Patient Background", span: 9 },
    { label: "Breast Cancer Profile", span: 8 },
    { label: "Reconstruction Profile", span: 5 },
    { label: "Revision Surgery", span: 4 },
    { label: "Complications Short-term", span: 14 },
    { label: "Complications Intermediate", span: 20 },
    { label: "Complications Long-term", span: 20 },
    { label: "Complications Delayed", span: 20 },
    { label: "Clinical Notes", span: 3 },
  ];

  // headers 그대로 (순서 유지!)
  const headers = [
    // Patient Info
    "patientId", "name", "surgeryDate", "operationName", "secondaryOperationName",
    // Patient Background
    "ageAtSurgery", "heightAtSurgery", "weightAtSurgery", "bmi", "dm", "ht", "steroid", "smoking", "breastPtosis",
    // Breast Cancer Profile
    "laterality", "stage", "surgeryTech", "axillary", "removedWeight", "endocrine", "radiation", "radiationTiming",
    // Reconstruction Profile
    "reconstructionTiming", "siliconePosition", "siliconeCovering", "siliconeImplantTypes", "siliconeVolume",
    // Revision Surgery
    "additionalOperation", "fatInjection", "fatVolume", "fatTiming",
    // Complications Short-term
    "strokeShort", "myocardialShort", "bleedingShort", "thromboembolismShort", "skinNecrosisShort", "painShort", "serousTumorShort",
    "infectionShort", "breakageShort", "positionShort", "lrDifferenceShort", "rotationShort", "exposureShort", "allergyShort",
    // Complications Intermediate
    "biaAlclIntermediate", "biaSccIntermediate", "painIntermediate", "delayedHematomaIntermediate", "delayedHematomaIntermediateTiming",
    "delayedSeromaIntermediate", "delayedSeromaIntermediateTiming", "infectionIntermediate", "infectionIntermediateTiming",
    "breakageIntermediate", "breakageIntermediateTiming", "positionIntermediate", "positionIntermediateTiming", "lrDifferenceIntermediate",
    "lrDifferenceIntermediateTiming", "rotationIntermediate", "rotationIntermediateTiming", "exposureIntermediate", "exposureIntermediateTiming",
    "allergyIntermediate", "ripplingIntermediate", "capsularContractureIntermediate", "bakerClassificationIntermediate",
    "animationDeformityIntermediate", "animationDistortionIntermediate", "animationAwarenessIntermediate", "animationAssessmentIntermediate",
    // Complications Long-term
    "biaAlclLong", "biaSccLong", "painLong", "delayedHematomaLong", "delayedHematomaLongTiming",
    "delayedSeromaLong", "delayedSeromaLongTiming", "infectionLong", "infectionLongTiming",
    "breakageLong", "breakageLongTiming", "positionLong", "positionLongTiming", "lrDifferenceLong",
    "lrDifferenceLongTiming", "rotationLong", "rotationLongTiming", "exposureLong", "exposureLongTiming",
    "allergyLong", "ripplingLong", "capsularContractureLong", "bakerClassificationLong",
    "animationDeformityLong", "animationDistortionLong", "animationAwarenessLong", "animationAssessmentLong",
    // Complications Delayed
    "biaAlclDelayed", "biaSccDelayed", "painDelayed", "delayedHematomaDelayed", "delayedHematomaDelayedTiming",
    "delayedSeromaDelayed", "delayedSeromaDelayedTiming", "infectionDelayed", "infectionDelayedTiming",
    "breakageDelayed", "breakageDelayedTiming", "positionDelayed", "positionDelayedTiming", "lrDifferenceDelayed",
    "lrDifferenceDelayedTiming", "rotationDelayed", "rotationDelayedTiming", "exposureDelayed", "exposureDelayedTiming",
    "allergyDelayed", "ripplingDelayed", "capsularContractureDelayed", "bakerClassificationDelayed",
    "animationDeformityDelayed", "animationDistortionDelayed", "animationAwarenessDelayed", "animationAssessmentDelayed",
    // Clinical Notes
    "oncological", "surgical", "clinical",
  ];

  // CSV Header Labels (사용자 보기용 라벨)
const headerLabels = [
  // Patient Info
  "Patient ID", "Name", "Surgery Date", "Operation Name", "Secondary Operation Name",
  // Patient Background
  "Age at Surgery", "Height at Surgery", "Weight at Surgery", "BMI", "DM", "HT", "Steroid", "Smoking", "Breast Ptosis",
  // Breast Cancer Profile
  "Laterality", "Stage", "Surgery Technique", "Axillary", "Removed Weight", "Endocrine", "Radiation", "Radiation Timing",
  // Reconstruction Profile
  "Reconstruction Timing", "Silicone Position", "Silicone Covering", "Silicone Implant Types", "Silicone Volume",
  // Revision Surgery
  "Additional Operation", "Fat Injection", "Fat Volume", "Fat Timing",
  // Complications Short-term
  "Stroke (Short-term)", "Myocardial Infarction (Short-term)", "Bleeding (Short-term)", "Thromboembolism (Short-term)", "Skin Necrosis (Short-term)", "Pain (Short-term)", "Serous Tumor (Short-term)",
  "Infection (Short-term)", "Breakage (Short-term)", "Position (Short-term)", "L/R Difference (Short-term)", "Rotation (Short-term)", "Exposure (Short-term)", "Allergy (Short-term)",
  // Complications Intermediate
  "BIA-ALCL (Intermediate)", "BIA-SCC (Intermediate)", "Pain (Intermediate)", "Delayed Hematoma (Intermediate)", "Delayed Hematoma Timing (Intermediate)",
  "Delayed Seroma (Intermediate)", "Delayed Seroma Timing (Intermediate)", "Infection (Intermediate)", "Infection Timing (Intermediate)",
  "Breakage (Intermediate)", "Breakage Timing (Intermediate)", "Position (Intermediate)", "Position Timing (Intermediate)", "L/R Difference (Intermediate)",
  "L/R Difference Timing (Intermediate)", "Rotation (Intermediate)", "Rotation Timing (Intermediate)", "Exposure (Intermediate)", "Exposure Timing (Intermediate)",
  "Allergy (Intermediate)", "Rippling (Intermediate)", "Capsular Contracture (Intermediate)", "Baker Classification (Intermediate)",
  "Animation Deformity (Intermediate)", "Animation Distortion (Intermediate)", "Animation Awareness (Intermediate)", "Animation Assessment (Intermediate)",
  // Complications Long-term
  "BIA-ALCL (Long-term)", "BIA-SCC (Long-term)", "Pain (Long-term)", "Delayed Hematoma (Long-term)", "Delayed Hematoma Timing (Long-term)",
  "Delayed Seroma (Long-term)", "Delayed Seroma Timing (Long-term)", "Infection (Long-term)", "Infection Timing (Long-term)",
  "Breakage (Long-term)", "Breakage Timing (Long-term)", "Position (Long-term)", "Position Timing (Long-term)", "L/R Difference (Long-term)",
  "L/R Difference Timing (Long-term)", "Rotation (Long-term)", "Rotation Timing (Long-term)", "Exposure (Long-term)", "Exposure Timing (Long-term)",
  "Allergy (Long-term)", "Rippling (Long-term)", "Capsular Contracture (Long-term)", "Baker Classification (Long-term)",
  "Animation Deformity (Long-term)", "Animation Distortion (Long-term)", "Animation Awareness (Long-term)", "Animation Assessment (Long-term)",
  // Complications Delayed
  "BIA-ALCL (Delayed)", "BIA-SCC (Delayed)", "Pain (Delayed)", "Delayed Hematoma (Delayed)", "Delayed Hematoma Timing (Delayed)",
  "Delayed Seroma (Delayed)", "Delayed Seroma Timing (Delayed)", "Infection (Delayed)", "Infection Timing (Delayed)",
  "Breakage (Delayed)", "Breakage Timing (Delayed)", "Position (Delayed)", "Position Timing (Delayed)", "L/R Difference (Delayed)",
  "L/R Difference Timing (Delayed)", "Rotation (Delayed)", "Rotation Timing (Delayed)", "Exposure (Delayed)", "Exposure Timing (Delayed)",
  "Allergy (Delayed)", "Rippling (Delayed)", "Capsular Contracture (Delayed)", "Baker Classification (Delayed)",
  "Animation Deformity (Delayed)", "Animation Distortion (Delayed)", "Animation Awareness (Delayed)", "Animation Assessment (Delayed)",
  // Clinical Notes
  "Oncological Notes", "Surgical Notes", "Clinical Notes",
];


  // Label에서 Short 등 제거
  const cleanLabel = (field: string) =>
    field.replace(/Short|Intermediate|Long|Delayed/g, "").replace(/([A-Z])/g, " $1").trim();

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
            {/* 첫번째 Row - Group Header */}
            <tr>
              {headerGroups.map((group, idx) => (
                <th
                  key={idx}
                  colSpan={group.span}
                  className="px-2 py-1 bg-gray-200 border text-xs text-center"
                >
                  {group.label}
                </th>
              ))}
            </tr>

            {/* 두번째 Row - Clean Label */}
            <tr>
              {headers.map((col) => (
                <th key={col} className="px-2 py-1 bg-gray-100 border whitespace-nowrap">
                  {cleanLabel(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr
                key={String(form.patientId ?? "")}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedId(String(form.patientId ?? ""))}
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
