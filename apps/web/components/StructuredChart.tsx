"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";

export default function StructuredChart({ chart }: { chart: AnalysisResult["chart"] }) {
  const [copied, setCopied] = useState(false);

  function buildCopyText() {
    return [
      `CHIEF COMPLAINT: ${chart.chief_complaint}`,
      "",
      `HPI: ${chart.hpi.narrative}`,
      `  Elements documented: ${chart.hpi.elements_documented.join(", ")}`,
      `  Elements missing: ${chart.hpi.elements_missing.join(", ") || "None"}`,
      `  HPI Level: ${chart.hpi.hpi_level}`,
      "",
      `REVIEW OF SYSTEMS:`,
      `  Systems reviewed: ${chart.ros.systems_reviewed.join(", ")}`,
      `  ROS Level: ${chart.ros.ros_level}`,
      chart.ros.note ? `  Note: ${chart.ros.note}` : "",
      "",
      `EXAM/ASSESSMENT: ${chart.exam_assessment}`,
      "",
      `MEDICAL DECISION MAKING:`,
      `  Problems: ${chart.mdm.problems.level} — ${chart.mdm.problems.justification}`,
      `  Data: ${chart.mdm.data.level} — ${chart.mdm.data.justification}`,
      `  Risk: ${chart.mdm.risk.level} — ${chart.mdm.risk.justification}`,
      `  Overall MDM: ${chart.mdm.overall_mdm_level}`,
      "",
      `PLAN: ${chart.plan}`,
      "",
      chart.time.documented_minutes
        ? `TIME: ${chart.time.documented_minutes} minutes${chart.time.time_based_code ? ` (supports ${chart.time.time_based_code})` : ""}`
        : `TIME: Not documented`,
      chart.time.note ? `  Note: ${chart.time.note}` : "",
    ].filter(Boolean).join("\n");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildCopyText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative rounded-xl border-l-4 border-teal-500 bg-white p-5 shadow-sm">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
      >
        {copied ? (
          <>
            <svg className="h-3.5 w-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </>
        )}
      </button>

      <h3 className="mb-4 text-lg font-semibold text-slate-900">Structured Chart</h3>

      <div className="space-y-4 text-sm">
        <Section title="Chief Complaint" content={chart.chief_complaint} />

        <div>
          <h4 className="font-semibold text-slate-700">History of Present Illness</h4>
          <p className="mt-1 text-slate-600 whitespace-pre-wrap">{chart.hpi.narrative}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chart.hpi.elements_documented.map((el) => (
              <span key={el} className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                {el}
              </span>
            ))}
            {chart.hpi.elements_missing.map((el) => (
              <span key={el} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                {el} (missing)
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            HPI Level: <span className="font-medium">{chart.hpi.hpi_level}</span>
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-700">Review of Systems</h4>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {chart.ros.systems_reviewed.map((sys) => (
              <span key={sys} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {sys}
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            ROS Level: <span className="font-medium">{chart.ros.ros_level}</span>
            {chart.ros.note && <> — {chart.ros.note}</>}
          </p>
        </div>

        <Section title="Exam / Assessment" content={chart.exam_assessment} />

        <div>
          <h4 className="font-semibold text-slate-700">Medical Decision Making</h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-1.5 text-left font-semibold text-slate-500">Component</th>
                  <th className="pb-1.5 text-left font-semibold text-slate-500">Level</th>
                  <th className="pb-1.5 text-left font-semibold text-slate-500">Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <MdmRow label="Problems" {...chart.mdm.problems} />
                <MdmRow label="Data" {...chart.mdm.data} />
                <MdmRow label="Risk" {...chart.mdm.risk} />
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs font-medium text-slate-700">
            Overall MDM Level: {chart.mdm.overall_mdm_level}
          </p>
        </div>

        <Section title="Plan" content={chart.plan} />

        <div>
          <h4 className="font-semibold text-slate-700">Time</h4>
          <p className="mt-1 text-slate-600">
            {chart.time.documented_minutes
              ? `${chart.time.documented_minutes} minutes documented`
              : "No time documented"}
            {chart.time.time_based_code && (
              <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                Supports {chart.time.time_based_code}
              </span>
            )}
          </p>
          {chart.time.note && <p className="mt-0.5 text-xs text-slate-500">{chart.time.note}</p>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h4 className="font-semibold text-slate-700">{title}</h4>
      <p className="mt-1 text-slate-600 whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function MdmRow({ label, level, justification }: { label: string; level: string; justification: string }) {
  return (
    <tr>
      <td className="py-1.5 font-medium text-slate-700">{label}</td>
      <td className="py-1.5">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">{level}</span>
      </td>
      <td className="py-1.5 text-slate-600">{justification}</td>
    </tr>
  );
}
