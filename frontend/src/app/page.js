"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI Resume Scanner
        </h1>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Upload Resume
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full border rounded p-2"
          />

          {resume && (
            <p className="mt-2 text-green-600">
              Selected: {resume.name}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Job Description
          </label>

          <textarea
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full border rounded p-3"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          Analyze Resume
        </button>
      </div>
    </main>
  );
}