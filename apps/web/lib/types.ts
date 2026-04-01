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
      ros_level: "Problem Pertinent" | "Extended" | "Complete";
      note: string;
    };
    exam_assessment: string;
    mdm: {
      problems: { level: string; justification: string };
      data: { level: string; justification: string };
      risk: { level: string; justification: string };
      overall_mdm_level: string;
    };
    plan: string;
    time: {
      documented_minutes: number | null;
      time_based_code: string | null;
      note: string;
    };
  };
  cpt: {
    code: string;
    description: string;
    justification_by_mdm: string;
    justification_by_time: string;
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
    suggested_code: string;
    safe_code: string;
    reasoning: string;
    if_improved_code: string;
    if_improved_reasoning: string;
  };
  summary: string;
}

export type AnalysisStep = "idle" | "extracting" | "generating" | "auditing" | "complete" | "error";
