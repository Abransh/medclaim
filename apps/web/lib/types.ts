export interface CptCode {
  code: string;
  description: string;
  justification: string;
  is_addon: boolean;
  addon_to?: string;
}

export interface AnalysisResult {
  chart: {
    chief_complaint: string;
    hpi: {
      narrative: string;
      elements_documented: string[];
      elements_missing: string[];
      hpi_level: "Brief" | "Extended";
    };
    ros: {
      systems_reviewed: string[];
      ros_level: "Problem Pertinent" | "Extended" | "Complete" | "None";
      note: string;
    };
    exam_assessment: string;
    mse_documented: boolean;
    mdm: {
      problems: { level: string; justification: string };
      data: { level: string; justification: string };
      risk: { level: string; justification: string };
      overall_mdm_level: string;
    };
    plan: string;
    time: {
      total_minutes: number | null;
      therapy_minutes: number | null;
      medical_minutes: number | null;
      time_based_code: string | null;
      note: string;
    };
  };
  cpt_codes: CptCode[];
  cpt_justification: {
    by_mdm: string;
    by_time: string;
    confidence: "Low" | "Medium" | "High";
    upgrade_potential: string;
  };
  icd10: Array<{
    code: string;
    description: string;
    justification: string;
    is_primary: boolean;
  }>;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  risk_score: number;
  downcoding_probability: string;
  denial_probability: string;
  reasons: Array<{
    category: string;
    severity: "Low" | "Medium" | "High";
    issue: string;
    insurance_perspective: string;
  }>;
  fixes: Array<{
    priority: number;
    category: string;
    current_issue: string;
    specific_fix: string;
    impact: string;
    effort: "Easy" | "Medium" | "Hard";
  }>;
  code_recommendation: {
    suggested_codes: string;
    safe_codes: string;
    reasoning: string;
    if_improved_codes: string;
    if_improved_reasoning: string;
  };
  summary: string;
}

export type AnalysisStep = "idle" | "extracting" | "generating" | "auditing" | "complete" | "error";
