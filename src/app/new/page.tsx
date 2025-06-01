"use client";

import { useState } from "react";

export default function NewPatientPage() {
  const [form, setForm] = useState({
    patientId: "",
    name: "",
    age: "",
    opDate: "",
    htn: "",
    dm: "",
    smoking: "",
    steroid: "",
    oncological: "",
    surgical: "",
    clinical: "", // ✅ 추가됨
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">🩺 New Patient Registration</h2>

      {/* ID + Name */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium">Patient ID</label>
          <input
            type="text"
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Patient Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Information</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Operation Date</label>
            <input
              type="date"
              name="opDate"
              value={form.opDate}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          {["htn", "dm", "smoking", "steroid"].map(field => (
            <div key={field}>
              <label className="block text-gray-700 font-medium capitalize">{field}</label>
              <select
                name={field}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Oncological Data */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Oncological Data</h3>
        <textarea
          name="oncological"
          value={form.oncological}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Enter oncological information..."
        />
      </div>

      {/* Surgical Data */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Surgical Data</h3>
        <textarea
          name="surgical"
          value={form.surgical}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Enter surgical information..."
        />
      </div>

      {/* Clinical Photos Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Clinical Photos</h3>
          <button
            onClick={() => {
              if (form.patientId) {
                window.open(
                  `/viewer.html?id=${form.patientId}`,
                  "_blank",
                  "width=1200,height=800"
                );
              } else {
                alert("Please enter Patient ID first.");
              }
            }}
            className="bg-[#2b362c] text-white px-4 py-1 rounded hover:bg-[#3f4b3d]"
          >
            Open in new window
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4 items-center">
          {["left-lateral", "left-oblique", "front", "right-oblique", "right-lateral"].map(
            (position) => (
              <div key={position} className="flex flex-col items-center gap-2">
                <div className="text-sm text-gray-600">{position.replace("-", " ")}</div>
                {form.patientId ? (
                  <img
                    src={`/images/${form.patientId}/${position}.jpg`}
                    alt={position}
                    className="w-full max-h-[320px] object-contain border rounded cursor-pointer"
                    onClick={() =>
                      window.open(
                        `/images/${form.patientId}/${position}.jpg`,
                        "_blank",
                        "width=1000,height=700"
                      )
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
            )
          )}
        </div>
      </div>


      {/* Clinical Data 입력 */}
      <div className="mt-12 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Clinical Data</h3>
        <textarea
          name="clinical"
          value={form.clinical}
          onChange={handleChange}
          rows={5}
          className="w-full p-3 border rounded"
          placeholder="Breast size, breast width, ptosis grade, etc..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button className="bg-[#2b362c] text-white px-6 py-2 rounded hover:bg-[#3f4b3d]">
          SUBMIT
        </button>
      </div>
    </div>
  );
}
