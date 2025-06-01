"use client";

import { useState, useEffect } from "react";

export default function FollowUpPage() {
  const [form, setForm] = useState({
    patientId: "",
    name: "",
    month: "",
    complication: "",
  });

  const [termLabel, setTermLabel] = useState("");

  useEffect(() => {
    const month = parseInt(form.month);
    if (!month && month !== 0) return setTermLabel("");
    if (month <= 3) setTermLabel("Short term (≤3M)");
    else if (month <= 12) setTermLabel("Intermediate term (4–12M)");
    else if (month <= 24) setTermLabel("Long term (13M–2Y)");
    else setTermLabel("Extended (2Y~)");
  }, [form.month]);

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

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">📅 Follow-Up Record</h2>

      {/* Form */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        <div className="col-span-1">
          <label className="block text-gray-700 font-medium">Patient ID</label>
          <input
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-gray-700 font-medium">Post-op Month</label>
          <div className="flex gap-2 mt-1">
            <input
              name="month"
              value={form.month}
              onChange={handleChange}
              type="number"
              min={0}
              className="w-1/2 p-2 border rounded"
              placeholder="ex. 3"
            />
            <div className="w-1/2 p-2 border rounded bg-gray-100 text-gray-700 text-sm flex items-center">
              {termLabel || "Auto term"}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Term auto-classified by month</p>
        </div>
      </div>

      {/* Complication */}
      <div className="mb-10">
        <label className="block text-gray-700 font-medium mb-2">Postoperative Complication</label>
        <textarea
          name="complication"
          value={form.complication}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Pain, hematoma, serous tumor, infection, ..."
        />
      </div>

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
        <button className="bg-[#2b362c] text-white px-6 py-2 rounded hover:bg-[#3f4b3d]">
          SUBMIT
        </button>
      </div>
    </div>
  );
}
