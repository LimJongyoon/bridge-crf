"use client";

import { useState } from "react";

export default function NewPatientPage() {
  const [form, setForm] = useState({
    patientId: "",
    name: "",
    surgeryDate: "",
    operationName: "",
    secondaryOperationName: "",
    ageAtSurgery: "",
    heightAtSurgery: "",
    weightAtSurgery: "",
    bmi: "",
    dm: false,
    ht: false,
    steroid: false,
    smoking: false,
    breastPtosis: "",
    laterality: "",
    stage: "",
    surgeryTech: [] as string[],
    axillary: "",
    removedWeight: "",
    endocrine: "",
    radiation: "",
    radiationTiming: "",
    reconstructionTiming: "",
    siliconePosition: "",
    siliconeCovering: "",
    siliconeImplantTypes: [] as string[],
    siliconeVolume: "",
    oncological: "",
    surgical: "",
    clinical: "",
    siliconeImplantType: [] as string[],
  });

  const [openSection, setOpenSection] = useState({
    info: true,
    background: true,
    profile: true,
    reconstruction: true,
  });

  const toggleSection = (key: keyof typeof openSection) => {
    setOpenSection(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSiliconeImplantTypeChange = (value: string) => {
    setForm(prev => {
      const current = prev.siliconeImplantType;
      return {
        ...prev,
        siliconeImplantType: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
      };
    });
  };

  const handleSurgeryTechChange = (value: string) => {
    setForm(prev => {
      const current = prev.surgeryTech;
      return {
        ...prev,
        surgeryTech: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
      };
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8 text-base">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">🩺 New Patient Registration</h2>

      {/* Patient Information */}
      <fieldset className="mb-10">
        <legend >
          <button
            onClick={() => toggleSection("info")}
            className="flex items-center gap-2 mb-4 font-semibold hover:underline"
          >
            <span className="text-green-700">{openSection.reconstruction ? "▼" : "▶"}</span>
            <span className="text-gray-700">Patient Information</span>
          </button>
        </legend>

        {openSection.info && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              {inputField("Patient ID", "patientId", form.patientId, handleChange)}
              {inputField("Name", "name", form.name, handleChange)}
              {inputField("Surgery Date", "surgeryDate", form.surgeryDate, handleChange)}
              {inputField("Operation Name", "operationName", form.operationName, handleChange)}
              {inputField("Secondary Operation Name", "secondaryOperationName", form.secondaryOperationName, handleChange)}
            </div>
          </div>
        )}
      </fieldset>

      {/* Patient Background */}
      <fieldset className="mb-10">
        <legend>
          <button
            onClick={() => toggleSection("background")}
            className="flex items-center gap-2 mb-4 font-semibold hover:underline"
          >
            <span className="text-green-700">{openSection.reconstruction ? "▼" : "▶"}</span>
            <span className="text-gray-700">Patient Background</span>
          </button>
        </legend>

        {openSection.background && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              {inputField("Age at the time of surgery", "ageAtSurgery", form.ageAtSurgery, handleChange)}
              {inputField("Height", "heightAtSurgery", form.heightAtSurgery, handleChange)}
              {inputField("Weight", "weightAtSurgery", form.weightAtSurgery, handleChange)}
              {inputField("BMI", "bmi", form.bmi, handleChange)}

              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Medical History</label>
                <div className="flex flex-wrap gap-4">
                  {["dm", "ht", "steroid", "smoking"].map(field => (
                    <label key={field} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        name={field}
                        checked={form[field as keyof typeof form] as boolean}
                        onChange={handleChange}
                      />
                      {field.toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Breast Ptosis</label>
                <select
                  name="breastPtosis"
                  value={form.breastPtosis}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-base"
                >
                  <option value="">Select</option>
                  {["no", "Minor", "Moderate", "Major", "Glandular", "Pseudo"].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </fieldset>

      {/* Breast Cancer Profile */}
      <fieldset className="mb-10">
        <legend>
          <button
            onClick={() => toggleSection("profile")}
            className="flex items-center gap-2 mb-4 font-semibold hover:underline"
          >
            <span className="text-green-700">{openSection.reconstruction ? "▼" : "▶"}</span>
            <span className="text-gray-700">Breast Cancer Profile</span>
          </button>
        </legend>

        {openSection.profile && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Laterality</label>
                <select
                  name="laterality"
                  value={form.laterality}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-base"
                >
                  <option value="">Select</option>
                  {[
                    "Unilateral-Left",
                    "Unilateral-Right",
                    "Bilateral-Left",
                    "Bilateral-Right",
                  ].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Stage after breast cancer surgery</label>
                <select
                  name="stage"
                  value={form.stage}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-base"
                >
                  <option value="">Select</option>
                  {["0", "1", "2", "3", "4"].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Breast cancer surgery technique</label>
                <div className="flex gap-4">
                  {["Bt/SSM", "NSM"].map(opt => (
                    <label key={opt} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={opt}
                        checked={form.surgeryTech.includes(opt)}
                        onChange={() => handleSurgeryTechChange(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Axillary surgery procedure</label>
                <select
                  name="axillary"
                  value={form.axillary}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-base"
                >
                  <option value="">Select</option>
                  {["no", "SN", "Ax", "SN->Ax"].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {inputField("Weight of removed breast cancer (g)", "removedWeight", form.removedWeight, handleChange)}

              <div>
                <label className="block text-gray-700 font-medium mb-1">Endocrine therapy</label>
                <div className="flex gap-4">
                  {["Yes", "No"].map(opt => (
                    <label key={opt} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="endocrine"
                        value={opt}
                        checked={form.endocrine === opt}
                        onChange={handleChange}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Adjuvant radiation therapy <br className="sm:hidden" />
                  <span className="text-sm text-gray-500">(Excluding recurrence cases with neoadjuvant radiation therapy)</span>
                </label>
                <div className="flex gap-4">
                  {["Yes", "No"].map(opt => (
                    <label key={opt} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="radiation"
                        value={opt}
                        checked={form.radiation === opt}
                        onChange={handleChange}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {form.radiation === "Yes" && (
                inputField("Timing of radiation therapy (months after surgery)", "radiationTiming", form.radiationTiming, handleChange)
              )}
            </div>
          </div>
        )}
      </fieldset>

      {/* Reconstruction Profile */}
      <fieldset className="mb-10">
        <legend>
          <button
            onClick={() => toggleSection("reconstruction")}
            className="flex items-center gap-2 mb-4 font-semibold hover:underline"
          >
            <span className="text-green-700">{openSection.reconstruction ? "▼" : "▶"}</span>
            <span className="text-gray-700">Reconstruction Profile</span>
          </button>

        </legend>

        {openSection.reconstruction && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">

              <div>
                <label className="block text-gray-700 font-medium mb-1">Timing/frequency of reconstruction</label>
                <select
                  name="reconstructionTiming"
                  value={form.reconstructionTiming}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-base"
                >
                  <option value="">Select</option>
                  {["immediate one-stage", "immediate two-stage"].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Silicone implant position</label>
                <select
                  name="siliconePosition"
                  value={form.siliconePosition}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-base"
                >
                  <option value="">Select</option>
                  {["pre-pectral", "sub-pectral"].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Silicone implant outer covering</label>
                <select
                  name="siliconeCovering"
                  value={form.siliconeCovering}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-base"
                >
                  <option value="">Select</option>
                  {["Outer(covering-No)", "Adipofascial flap", "Serratus anterior layer Mesh", "ADM"].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Silicone implant type</label>
                <div className="flex flex-wrap gap-4">
                  {["Anatomical- textured", "Smooth-textured", "Round-textured", "Other"].map(opt => (
                    <label key={opt} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={opt}
                        checked={form.siliconeImplantTypes.includes(opt)}
                        onChange={() => handleSiliconeImplantTypeChange(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {inputField("Silicone implant volume (cc)", "siliconeVolume", form.siliconeVolume, handleChange)}
            </div>
          </div>
        )}
      </fieldset>


      {/* Oncological Data */}
      <div className="mb-10">
        <label className="block text-gray-700 font-semibold mb-2">Oncological Data</label>
        <textarea
          name="oncological"
          value={form.oncological}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded text-base"
        />
      </div>

      {/* Surgical Data */}
      <div className="mb-10">
        <label className="block text-gray-700 font-semibold mb-2">Surgical Data</label>
        <textarea
          name="surgical"
          value={form.surgical}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded text-base"
        />
      </div>

      {/* Clinical Photos */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Clinical Photos</h3>
          <button
            onClick={() => {
              if (form.patientId) {
                window.open(`/viewer.html?id=${form.patientId}`, "_blank", "width=1200,height=800");
              } else {
                alert("Please enter Patient ID first.");
              }
            }}
            className="bg-[#2b362c] text-white px-4 py-2 rounded hover:bg-[#3f4b3d]"
          >
            Open in New Window
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {["left-lateral", "left-oblique", "front", "right-oblique", "right-lateral"].map((position) => (
            <div key={position} className="text-center text-sm">
              <div className="mb-1 text-gray-600">{position.replace("-", " ")}</div>
              {form.patientId ? (
                <img
                  src={`/images/${form.patientId}/${position}.jpg`}
                  alt={position}
                  className="w-full max-h-[280px] object-contain border rounded cursor-pointer"
                  onClick={() =>
                    window.open(`/images/${form.patientId}/${position}.jpg`, "_blank", "width=1000,height=700")
                  }
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
              ) : (
                <div className="w-full h-[200px] bg-gray-100 border rounded flex items-center justify-center text-gray-400">
                  ID required
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Data */}
      <div className="mb-10">
        <label className="block text-gray-700 font-semibold mb-2">Clinical Data</label>
        <textarea
          name="clinical"
          value={form.clinical}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded text-base"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button className="bg-[#2b362c] text-white px-6 py-2 rounded hover:bg-[#3f4b3d]">
          Submit
        </button>
      </div>
    </div>
  );
}

// Reusable input field
function inputField(
  label: string,
  name: string,
  value: string,
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={name.toLowerCase().includes("date") ? "date" : "text"}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded text-base"
      />
    </div>
  );
}
