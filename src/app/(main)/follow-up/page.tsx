"use client";

import { useState, useEffect } from "react";
export default function FollowUpPage() {
  type FormData = {
    patientId: string;
    name: string;
    month: string;
    complication: string;
    additionalOperation: string;
    fatInjection: string;
    fatVolume: string;
    fatTiming: string;

    // Complication 항목들
    [key: string]: string;
  };

  const INITIAL_FORM: FormData = {
    patientId: "",
    name: "",
    month: "",
    complication: "",
    additionalOperation: "",
    fatInjection: "",
    fatVolume: "",
    fatTiming: "",

    // ✅ Short-term only
    strokeShort: "",
    myocardialShort: "",
    bleedingShort: "",
    thromboembolismShort: "",
    skinNecrosisShort: "",
    painShort: "",
    serousTumorShort: "",
    infectionShort: "",
    breakageShort: "",
    positionShort: "",
    lrDifferenceShort: "",
    rotationShort: "",
    exposureShort: "",
    allergyShort: "",

    // ✅ Intermediate / Long / Delayed (구분 필드)
    allergyIntermediate: "",
    allergyLong: "",
    allergyDelayed: "",

    animationAssessmentIntermediate: "",
    animationAssessmentLong: "",
    animationAssessmentDelayed: "",

    animationAwarenessIntermediate: "",
    animationAwarenessLong: "",
    animationAwarenessDelayed: "",

    animationDeformityIntermediate: "",
    animationDeformityLong: "",
    animationDeformityDelayed: "",

    animationDistortionIntermediate: "",
    animationDistortionLong: "",
    animationDistortionDelayed: "",

    bakerClassificationIntermediate: "",
    bakerClassificationLong: "",
    bakerClassificationDelayed: "",

    biaAlclIntermediate: "",
    biaAlclLong: "",
    biaAlclDelayed: "",

    biaSccIntermediate: "",
    biaSccLong: "",
    biaSccDelayed: "",

    painIntermediate: "",
    painLong: "",
    painDelayed: "",

    ripplingIntermediate: "",
    ripplingLong: "",
    ripplingDelayed: "",

    capsularContractureIntermediate: "",
    capsularContractureLong: "",
    capsularContractureDelayed: "",

    // ✅ Timing 포함 항목들 (각 시기별)
    delayedHematomaIntermediate: "",
    delayedHematomaIntermediateTiming: "",
    delayedHematomaLong: "",
    delayedHematomaLongTiming: "",
    delayedHematomaDelayed: "",
    delayedHematomaDelayedTiming: "",

    delayedSeromaIntermediate: "",
    delayedSeromaIntermediateTiming: "",
    delayedSeromaLong: "",
    delayedSeromaLongTiming: "",
    delayedSeromaDelayed: "",
    delayedSeromaDelayedTiming: "",

    infectionIntermediate: "",
    infectionIntermediateTiming: "",
    infectionLong: "",
    infectionLongTiming: "",
    infectionDelayed: "",
    infectionDelayedTiming: "",

    breakageIntermediate: "",
    breakageIntermediateTiming: "",
    breakageLong: "",
    breakageLongTiming: "",
    breakageDelayed: "",
    breakageDelayedTiming: "",

    positionIntermediate: "",
    positionIntermediateTiming: "",
    positionLong: "",
    positionLongTiming: "",
    positionDelayed: "",
    positionDelayedTiming: "",

    lrDifferenceIntermediate: "",
    lrDifferenceIntermediateTiming: "",
    lrDifferenceLong: "",
    lrDifferenceLongTiming: "",
    lrDifferenceDelayed: "",
    lrDifferenceDelayedTiming: "",

    rotationIntermediate: "",
    rotationIntermediateTiming: "",
    rotationLong: "",
    rotationLongTiming: "",
    rotationDelayed: "",
    rotationDelayedTiming: "",

    exposureIntermediate: "",
    exposureIntermediateTiming: "",
    exposureLong: "",
    exposureLongTiming: "",
    exposureDelayed: "",
    exposureDelayedTiming: ""
  };

  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const [openSection, setOpenSection] = useState({
    revision: true,
    complication: true, // ⬅️ 이제 하나만 쓰면 됨
  });


  const toggleSection = (key: keyof typeof openSection) => {
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [termLabel, setTermLabel] = useState("");
  const [complicationTabs, setComplicationTabs] = useState<string[]>([]);
  const [activeComplicationTab, setActiveComplicationTab] = useState<string>("Short-term");
  const [hasAutoSelectedTab, setHasAutoSelectedTab] = useState(false);  // 추가됨

  useEffect(() => {
    const month = parseInt(form.month);
    if (!month && month !== 0) {
      setTermLabel("");
      setComplicationTabs([]);
      setOpenSection(prev => ({ ...prev, complication: false }));
      return;
    }

    // Term label
    if (month <= 3) setTermLabel("Short-term Follow-up (≤3M)");
    else if (month <= 12) setTermLabel("Intermediate-term Follow-up (≤12M)");
    else if (month <= 24) setTermLabel("Long-term Follow-up (≤24M)");
    else if (month <= 36) setTermLabel("Delayed-term 1 (≤36M)");
    else if (month <= 48) setTermLabel("Delayed-term 2 (≤48M)");
    else if (month <= 60) setTermLabel("Delayed-term 3 (≤60M)");

    // Tabs 구성
    const tabs = [];
    if (month >= 0) tabs.push("Short-term");
    if (month > 3) tabs.push("Intermediate-term");
    if (month > 12) tabs.push("Long-term");
    if (month > 24) {
      if (month <= 36) tabs.push("Delayed-term 1");
      else if (month <= 48) tabs.push("Delayed-term 1", "Delayed-term 2");
      else if (month <= 60) tabs.push("Delayed-term 1", "Delayed-term 2", "Delayed-term 3");
    }

    setComplicationTabs(tabs);
    setHasAutoSelectedTab(false);
    setOpenSection(prev => ({ ...prev, complication: true }));
  }, [form.month]);

  useEffect(() => {
    if (complicationTabs.length > 0 && !hasAutoSelectedTab) {
      setActiveComplicationTab(complicationTabs[complicationTabs.length - 1]);
      setHasAutoSelectedTab(true);
    }
  }, [complicationTabs, hasAutoSelectedTab]);

  useEffect(() => {
    if (form.patientId.trim() !== "") {
      fetch(`http://localhost:3001/api/get-patient-info?patientId=${form.patientId}`)
        .then(res => res.json())
        .then(data => {
          if (data.name) {
            setForm(prev => ({
              ...prev,
              ...data,
              name: data.name || "",
              additionalOperation: data.additionalOperation || "",
              fatInjection: data.fatInjection || "",
              fatVolume: data.fatVolume || "",
              fatTiming: data.fatTiming || "",
              month: data.month ?? "",
            }));
          } else {
            setForm(prev => ({ ...prev, name: "" }));
          }
        })
        .catch(err => {
          console.error('Error fetching patient info:', err);
          setForm(prev => ({ ...prev, name: "" }));
        });
    } else {
      setForm(prev => ({ ...prev, name: "" }));
    }
  }, [form.patientId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getImageSrc = (month: number | string, position: string) => {
    if (month === 0) return `/images/${form.patientId}/${position}.jpg`;
    return `/images/${form.patientId}/post-${month}-${position}.jpg`;
  };

  const month = parseInt(form.month);
  let preMonth: number | null = null;
  let postMonth: number | null = null;

  if (!isNaN(month)) {
    if (month < 3) {
      postMonth = 0;
    } else if (month >= 3 && month < 12) {
      preMonth = 0;
      postMonth = 3;
    } else if (month >= 12 && month < 24) {
      preMonth = 3;
      postMonth = 12;
    } else if (month >= 24) {
      preMonth = 12;
      postMonth = 24;
    }
  }

  const renderImageRow = (label: string, month: number) => (
    <div className="grid grid-cols-[repeat(5,_1fr)_auto] gap-4 mb-4">
      {["left-lateral", "left-oblique", "front", "right-oblique", "right-lateral"].map(
        (position) => {
          const src = getImageSrc(month, position);
          return (
            <div key={`${label}-${position}`} className="aspect-[3/4] w-full bg-gray-50 border rounded flex items-center justify-center">
              <img
                src={src}
                alt={`${label}-${position}`}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => window.open(src, "_blank", "width=1000,height=700")}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            </div>
          );
        }
      )}
      <div className="flex items-center justify-center w-6">
        <div className="transform rotate-90 text-gray-600 text-xs font-semibold whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('Follow-up data saved!');
        setForm(INITIAL_FORM); // 초기 form 값으로 리셋 (초기값 선언해두면 깔끔)
      } else {
        alert('Error saving follow-up data!');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Error saving follow-up data!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Follow-Up Record</h2>

      {/* Form */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">ID</label>
          <input
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="col-span-2">
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            readOnly
            className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-700"
          />
        </div>

      </div>

      {/* Revision Surgery */}
      <fieldset className="mb-8">
        <legend>
          <button
            onClick={() => toggleSection("revision")}
            className="flex items-center gap-2 mb-4 font-semibold hover:underline"
          >
            <span className="text-green-700">{openSection.revision ? "▼" : "▶"}</span>
            <span className="text-gray-800 text-lg">Revision Surgery</span>
          </button>
        </legend>

        {openSection.revision && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Additional operation</label>
                <input
                  name="additionalOperation"
                  value={form.additionalOperation}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Scar revision, etc."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Fat injection</label>
                <div className="flex gap-4">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="fatInjection"
                        value={opt}
                        checked={form.fatInjection === opt}
                        onChange={handleChange}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Volume of fat injected (mL)</label>
                <input
                  name="fatVolume"
                  value={form.fatVolume}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 80"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Timing of fat injection (months after SBI replacement)
                </label>
                <input
                  name="fatTiming"
                  value={form.fatTiming}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 6"
                />
              </div>

              {/* Follow-up date */}
              <label className="block text-gray-700 font-medium">Follow-up date (X month)<p className="text-xs text-gray-400 mt-1">Term auto-classified by month</p></label>
              <div className="flex gap-2 mt-1">
                <input
                  name="month"
                  value={form.month ?? ""} 
                  onChange={handleChange}
                  type="number"
                  min={0}
                  className="w-1/2 p-2 border rounded"
                  placeholder="ex. 3"
                />
                <div className="w-1/2 p-2 border rounded bg-gray-100 text-gray-700 text-sm flex items-center">
                  {termLabel || "Follow period"}
                </div>
              </div>

            </div>
          </div>
        )}
      </fieldset>

      {/* Complication */}
      <fieldset className="mb-10">
        <legend>
          <button
            onClick={() => toggleSection("complication")}
            className="flex items-center gap-2 mb-4 font-semibold hover:underline"
          >
            <span className="text-green-700">{openSection.complication ? "▼" : "▶"}</span>
            <span className="text-gray-700">Complications</span>
          </button>
        </legend>

        {openSection.complication && complicationTabs.length > 0 && (
          <div className="flex gap-2 mb-4">
            {complicationTabs.map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded ${activeComplicationTab === tab ? "bg-green-700 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveComplicationTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
        )}


        {openSection.complication && termLabel && (
          <div className="text-md font-medium text-gray-600 mb-4">{termLabel}</div>
        )}

        {openSection.complication && activeComplicationTab === "Short-term" && (
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                name: "strokeShort",
                label: "Cerebral stroke",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "myocardialShort",
                label: "Myocardial infarction",
                options: ["No", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "bleedingShort",
                label: "Postoperative hemorrhage/hematoma",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "thromboembolismShort",
                label: "Thromboembolism",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "skinNecrosisShort",
                label: "Skin ulcer/necrosis & Wound margin necrosis",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "painShort",
                label: "Pain (Reconstructed breast)",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "serousTumorShort",
                label: "Serous tumor",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "infectionShort",
                label: "Infection",
                options: ["No", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "breakageShort",
                label: "Breakage",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
              },
              {
                name: "positionShort",
                label: "Abnormal position",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
              },
              {
                name: "lrDifferenceShort",
                label: "Left-Right difference",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
              },
              {
                name: "rotationShort",
                label: "Rotation",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
              },
              {
                name: "exposureShort",
                label: "Exposure",
                options: ["No", "Ⅰ", "Ⅱ", "Ointment application", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
              },
              {
                name: "allergyShort",
                label: "Implant allergies",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
            ].map(({ name, label, options }) => (
              <div key={name}>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <select
                  name={name}
                  value={form[name] ?? ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {openSection.complication && activeComplicationTab === "Intermediate-term" && (
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                name: "biaAlclIntermediate",
                label: "BIA-ALCL",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "biaSccIntermediate",
                label: "BIA-SCC",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "painIntermediate",
                label: "Pain (Reconstructed breast)",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "delayedHematomaIntermediate",
                label: "Delayed hematoma",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
                timing: true,
              },
              {
                name: "delayedSeromaIntermediate",
                label: "Delayed serous tumor",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
                timing: true,
              },
              {
                name: "infectionIntermediate",
                label: "Infection",
                options: ["No", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
                timing: true,
              },
              {
                name: "breakageIntermediate",
                label: "Breakage",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "positionIntermediate",
                label: "Abnormal position",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "lrDifferenceIntermediate",
                label: "Left-Right difference",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "rotationIntermediate",
                label: "Rotation",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "exposureIntermediate",
                label: "Exposure",
                options: ["No", "Ⅰ", "Ⅱ", "Ointment application", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "allergyIntermediate",
                label: "Implant allergies",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "ripplingIntermediate",
                label: "Rippling",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
              },
              {
                name: "capsularContractureIntermediate",
                label: "Capsular contracture",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
              },
              {
                name: "bakerClassificationIntermediate",
                label: "Capsular contracture (Baker classification)",
                options: ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"],
              },
              {
                name: "animationDeformityIntermediate",
                label: "Animation deformity",
                options: ["No", "Ⅰ", "Ⅱa", "Ⅱb", "Ⅱc", "Ⅱd"],
              },
              {
                name: "animationDistortionIntermediate",
                label: "Distortion and deviation",
                options: ["No", "Minimal", "Moderate", "Severe"],
              },
              {
                name: "animationAwarenessIntermediate",
                label: "Patient awareness",
                options: [
                  "Not applicable",
                  "Unnoticed by patient",
                  "Noticed by patient",
                  "Disturbing to patient",
                ],
              },
              {
                name: "animationAssessmentIntermediate",
                label: "Overall assessment",
                options: ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"],
              },
            ].map(({ name, label, options, timing }) => (
              <div key={name}>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <select
                  name={name}
                  value={form[name] ?? ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {timing && form[name] && form[name] !== "No" && (
                  <input
                    type="number"
                    name={`${name}Timing`}
                    value={form[`${name}Timing`] || ""}
                    onChange={handleChange}
                    className="mt-2 w-full p-2 border rounded"
                    placeholder="Timing of onset (months after surgery)"
                  />
                )}
              </div>
            ))}
          </div>
        )}


        {openSection.complication && activeComplicationTab === "Long-term" && (
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                name: "biaAlclLong",
                label: "BIA-ALCL",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "biaSccLong",
                label: "BIA-SCC",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "painLong",
                label: "Pain (Reconstructed breast)",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "delayedHematomaLong",
                label: "Delayed hematoma",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
                timing: true,
              },
              {
                name: "delayedSeromaLong",
                label: "Delayed serous tumor",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
                timing: true,
              },
              {
                name: "infectionLong",
                label: "Infection",
                options: ["No", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
                timing: true,
              },
              {
                name: "breakageLong",
                label: "Breakage",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "positionLong",
                label: "Abnormal position",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "lrDifferenceLong",
                label: "Left-Right difference",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "rotationLong",
                label: "Rotation",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "exposureLong",
                label: "Exposure",
                options: ["No", "Ⅰ", "Ⅱ", "Ointment application", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "allergyLong",
                label: "Implant allergies",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "ripplingLong",
                label: "Rippling",
                options: ["No", "Ⅰ", "Ⅱa", "Ⅱb", "Ⅱc", "Ⅱd"],
              },
              {
                name: "capsularContractureLong",
                label: "Capsular contracture",
                options: ["No", "Ⅰ", "Ⅱa", "Ⅱb", "Ⅱc", "Ⅱd"],
              },
              {
                name: "bakerClassificationLong",
                label: "Capsular contracture (Baker classification)",
                options: ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"],
              },
              {
                name: "animationDeformityLong",
                label: "Animation deformity",
                options: ["No", "Ⅰ", "Ⅱa", "Ⅱb", "Ⅱc", "Ⅱd"],
              },
              {
                name: "animationDistortionLong",
                label: "Distortion and deviation",
                options: ["No", "Minimal", "Moderate", "Severe"],
              },
              {
                name: "animationAwarenessLong",
                label: "Patient awareness",
                options: [
                  "Not applicable",
                  "Unnoticed by patient",
                  "Noticed by patient",
                  "Disturbing to patient",
                ],
              },
              {
                name: "animationAssessmentLong",
                label: "Overall assessment",
                options: ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"],
              },
            ].map(({ name, label, options, timing }) => (
              <div key={name}>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <select
                  name={name}
                  value={form[name] ?? ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {timing && form[name] && form[name] !== "No" && (
                  <input
                    type="number"
                    name={`${name}Timing`}
                    value={form[`${name}Timing`] || ""}
                    onChange={handleChange}
                    className="mt-2 w-full p-2 border rounded"
                    placeholder="Timing of onset (months after surgery)"
                  />
                )}
              </div>
            ))}
          </div>
        )}


        {openSection.complication && activeComplicationTab.startsWith("Delayed-term") && (
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                name: "biaAlclDelayed",
                label: "BIA-ALCL",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "biaSccDelayed",
                label: "BIA-SCC",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "painDelayed",
                label: "Pain (Reconstructed breast)",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "delayedHematomaDelayed",
                label: "Delayed hematoma",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
                timing: true,
              },
              {
                name: "delayedSeromaDelayed",
                label: "Delayed serous tumor",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
                timing: true,
              },
              {
                name: "infectionDelayed",
                label: "Infection",
                options: ["No", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
                timing: true,
              },
              {
                name: "breakageDelayed",
                label: "Breakage",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "positionDelayed",
                label: "Abnormal position",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "lrDifferenceDelayed",
                label: "Left-Right difference",
                options: ["No", "Ⅰ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "rotationDelayed",
                label: "Rotation",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "exposureDelayed",
                label: "Exposure",
                options: ["No", "Ⅰ", "Ⅱ", "Ointment application", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd"],
                timing: true,
              },
              {
                name: "allergyDelayed",
                label: "Implant allergies",
                options: ["No", "Ⅰ", "Ⅱ", "Ⅲa", "Ⅲb", "Ⅲc", "Ⅲd", "Ⅳ", "Ⅴ"],
              },
              {
                name: "ripplingDelayed",
                label: "Rippling",
                options: ["No", "Ⅰ", "Ⅱa", "Ⅱb", "Ⅱc", "Ⅱd"],
              },
              {
                name: "capsularContractureDelayed",
                label: "Capsular contracture",
                options: ["No", "Ⅰ", "Ⅱa", "Ⅱb", "Ⅱc", "Ⅱd"],
              },
              {
                name: "bakerClassificationDelayed",
                label: "Capsular contracture (Baker classification)",
                options: ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"],
              },
              {
                name: "animationDeformityDelayed",
                label: "Animation deformity",
                options: ["No", "Ⅰ", "Ⅱa", "Ⅱb", "Ⅱc", "Ⅱd"],
              },
              {
                name: "animationDistortionDelayed",
                label: "Distortion and deviation",
                options: ["No", "Minimal", "Moderate", "Severe"],
              },
              {
                name: "animationAwarenessDelayed",
                label: "Patient awareness",
                options: [
                  "Not applicable",
                  "Unnoticed by patient",
                  "Noticed by patient",
                  "Disturbing to patient",
                ],
              },
              {
                name: "animationAssessmentDelayed",
                label: "Overall assessment",
                options: ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"],
              },
            ].map(({ name, label, options, timing }) => (
              <div key={name}>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <select
                  name={name}
                  value={form[name] ?? ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                {timing && form[name] && form[name] !== "No" && (
                  <input
                    type="number"
                    name={`${name}Timing`}
                    value={form[`${name}Timing`] || ""}
                    onChange={handleChange}
                    className="mt-2 w-full p-2 border rounded"
                    placeholder="Timing of onset (months after surgery)"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* Clinical Photos */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Clinical Photos</h3>
          <button
            onClick={() => {
              if (form.patientId && form.month) {
                window.open(
                  `/viewer-followup.html?id=${form.patientId}&month=${form.month}`,
                  "_blank",
                  "width=1200,height=800"
                );
              } else {
                alert("Please enter both Patient ID and Month first.");
              }
            }}
            className="bg-[#2b362c] text-white px-4 py-1 rounded hover:bg-[#3f4b3d]"
          >
            Open in new window
          </button>
        </div>

        {/* Header */}
        <div className="grid grid-cols-[repeat(5,_1fr)_auto] gap-4 text-center text-sm text-gray-600 mb-2">
          <div>Left Lateral</div>
          <div>Left Oblique</div>
          <div>Front</div>
          <div>Right Oblique</div>
          <div>Right Lateral</div>
          <div></div>
        </div>

        {/* Image Rows */}
        {preMonth !== null && renderImageRow("Pre-op", preMonth)}
        {postMonth !== null && renderImageRow(`Post-op (${postMonth}M)`, postMonth)}
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-10">
        <button
          onClick={handleSubmit}
          className="bg-[#2b362c] text-white px-6 py-2 rounded hover:bg-[#3f4b3d]"
        >
          SUBMIT
        </button>

      </div>
    </div>
  );
}
