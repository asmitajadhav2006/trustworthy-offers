export interface AnalysisInput {
  message: string;
  url: string;
  phone: string;
  email: string;
  company: string;
}

export interface RiskDetail {
  category: string;
  score: number;
  level: "safe" | "warning" | "danger";
  findings: string[];
}

export interface AnalysisResult {
  overallScore: number;
  riskLevel: "safe" | "warning" | "danger";
  explanation: string;
  risks: RiskDetail[];
  highlightedPhrases: { text: string; reason: string }[];
  recommendations: string[];
  phoneIntelligence?: import("./phoneIntelligence").PhoneIntelligenceResult;
}

const SCAM_PHRASES: { pattern: RegExp; reason: string; weight: number }[] = [
  { pattern: /earn\s*(money|cash|income)\s*fast/i, reason: "Promises quick money", weight: 25 },
  { pattern: /no\s*(interview|experience)\s*required/i, reason: "No interview/experience required is suspicious", weight: 20 },
  { pattern: /registration\s*fee/i, reason: "Legitimate jobs never charge fees", weight: 30 },
  { pattern: /work\s*from\s*home.*high\s*salary/i, reason: "Unrealistic WFH salary claims", weight: 20 },
  { pattern: /guaranteed\s*(income|job|placement)/i, reason: "No job can be guaranteed", weight: 25 },
  { pattern: /pay\s*(upfront|advance|first)/i, reason: "Requesting advance payment", weight: 30 },
  { pattern: /wire\s*transfer/i, reason: "Wire transfer requests are red flags", weight: 30 },
  { pattern: /click\s*(here|this\s*link)\s*(now|immediately|urgently)/i, reason: "Urgency tactics", weight: 20 },
  { pattern: /limited\s*(time|spots|seats)/i, reason: "Artificial scarcity pressure", weight: 15 },
  { pattern: /whatsapp.*apply/i, reason: "Legitimate companies don't recruit via WhatsApp", weight: 20 },
  { pattern: /send\s*(your\s*)?(resume|cv)\s*to\s*whatsapp/i, reason: "Resume via WhatsApp is unprofessional", weight: 20 },
  { pattern: /no\s*company\s*(name|details)/i, reason: "Missing company identification", weight: 15 },
  { pattern: /certificate\s*only/i, reason: "Certificate-only internships are often scams", weight: 20 },
  { pattern: /unpaid.*mandatory/i, reason: "Mandatory unpaid work is exploitative", weight: 15 },
  { pattern: /personal\s*(bank|account)\s*details/i, reason: "Requesting banking details upfront", weight: 30 },
  { pattern: /too\s*good\s*to\s*be\s*true/i, reason: "Self-evident warning", weight: 10 },
  { pattern: /\$\d{4,}.*per\s*(day|hour)/i, reason: "Unrealistically high pay rate", weight: 25 },
  { pattern: /data\s*entry.*high.*pay/i, reason: "Data entry scam pattern", weight: 20 },
  { pattern: /crypto|bitcoin.*invest/i, reason: "Crypto investment schemes", weight: 25 },
  { pattern: /mlm|multi.?level|pyramid/i, reason: "MLM/pyramid scheme indicators", weight: 30 },
];

function analyzeMessage(text: string): { score: number; findings: string[]; highlights: { text: string; reason: string }[] } {
  if (!text.trim()) return { score: 100, findings: [], highlights: [] };
  
  let penalty = 0;
  const findings: string[] = [];
  const highlights: { text: string; reason: string }[] = [];

  for (const { pattern, reason, weight } of SCAM_PHRASES) {
    const match = text.match(pattern);
    if (match) {
      penalty += weight;
      findings.push(reason);
      highlights.push({ text: match[0], reason });
    }
  }

  // Check for ALL CAPS (shouting)
  const words = text.split(/\s+/);
  const capsWords = words.filter(w => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  if (capsWords.length > 3) {
    penalty += 10;
    findings.push("Excessive use of CAPS (shouting tactics)");
  }

  // Check for excessive exclamation marks
  if ((text.match(/!/g) || []).length > 3) {
    penalty += 5;
    findings.push("Excessive exclamation marks suggest hype");
  }

  // Grammar/spelling issues (simple heuristic)
  if (text.length > 50 && !/[.!?]$/.test(text.trim())) {
    penalty += 5;
    findings.push("Poor formatting detected");
  }

  return { score: Math.max(0, 100 - penalty), findings, highlights };
}

function analyzeUrl(url: string): { score: number; findings: string[] } {
  if (!url.trim()) return { score: 100, findings: [] };
  
  let penalty = 0;
  const findings: string[] = [];

  if (!url.startsWith("https://")) {
    penalty += 25;
    findings.push("URL does not use HTTPS encryption");
  }

  // Check for suspicious TLDs
  if (/\.(xyz|tk|ml|ga|cf|gq|top|buzz|click)$/i.test(url)) {
    penalty += 20;
    findings.push("Suspicious top-level domain detected");
  }

  // Check for IP-based URLs
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i.test(url)) {
    penalty += 30;
    findings.push("URL uses IP address instead of domain name");
  }

  // Check for URL shorteners
  if (/bit\.ly|tinyurl|t\.co|goo\.gl|short\.link/i.test(url)) {
    penalty += 15;
    findings.push("URL shortener detected — may hide malicious destination");
  }

  // Lookalike domains
  if (/amaz0n|g00gle|faceb00k|linkedln|micros0ft/i.test(url)) {
    penalty += 35;
    findings.push("Lookalike domain detected (typosquatting)");
  }

  // Excessive subdomains
  const domainPart = url.replace(/https?:\/\//, "").split("/")[0];
  if ((domainPart.match(/\./g) || []).length > 3) {
    penalty += 15;
    findings.push("Excessive subdomains — possible phishing");
  }

  return { score: Math.max(0, 100 - penalty), findings };
}

function analyzeEmail(email: string): { score: number; findings: string[] } {
  if (!email.trim()) return { score: 100, findings: [] };
  
  let penalty = 0;
  const findings: string[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    penalty += 30;
    findings.push("Invalid email format");
  }

  // Free email providers for business
  if (/@(gmail|yahoo|hotmail|outlook|aol|mail)\./i.test(email)) {
    penalty += 15;
    findings.push("Uses free email provider (legitimate companies use company domains)");
  }

  // Lookalike domains
  if (/@.*?(amaz0n|g00gle|faceb00k|linkedln|micros0ft)/i.test(email)) {
    penalty += 35;
    findings.push("Spoofed domain detected in email");
  }

  // Random string local part
  if (/^[a-z0-9]{15,}@/i.test(email)) {
    penalty += 10;
    findings.push("Email local part appears randomly generated");
  }

  return { score: Math.max(0, 100 - penalty), findings };
}

function analyzePhone(phone: string): { score: number; findings: string[] } {
  if (!phone.trim()) return { score: 100, findings: [] };
  
  let penalty = 0;
  const findings: string[] = [];

  const digits = phone.replace(/\D/g, "");

  if (digits.length < 7 || digits.length > 15) {
    penalty += 25;
    findings.push("Invalid phone number length");
  }

  // Premium rate numbers
  if (/^(900|976|809|284)/.test(digits)) {
    penalty += 30;
    findings.push("Premium rate number detected — may incur charges");
  }

  // All same digits
  if (/^(\d)\1+$/.test(digits)) {
    penalty += 20;
    findings.push("Suspicious repeated digit pattern");
  }

  return { score: Math.max(0, 100 - penalty), findings };
}

function analyzeCompany(company: string): { score: number; findings: string[] } {
  if (!company.trim()) return { score: 100, findings: [] };
  
  let penalty = 0;
  const findings: string[] = [];

  if (company.length < 3) {
    penalty += 15;
    findings.push("Company name too short to verify");
  }

  // Generic company names
  if (/^(global|international|world|universal)\s+(solutions|services|corp|inc)/i.test(company)) {
    penalty += 15;
    findings.push("Very generic company name — often used by scammers");
  }

  // No online presence simulation
  if (/xyz corp|test company|fake inc/i.test(company)) {
    penalty += 30;
    findings.push("Company name appears fabricated");
  }

  return { score: Math.max(0, 100 - penalty), findings };
}

export function performAnalysis(input: AnalysisInput): AnalysisResult {
  const { analyzePhoneIntelligence } = require("./phoneIntelligence") as typeof import("./phoneIntelligence");
  
  const messageResult = analyzeMessage(input.message);
  const urlResult = analyzeUrl(input.url);
  const emailResult = analyzeEmail(input.email);
  const phoneResult = analyzePhone(input.phone);
  const companyResult = analyzeCompany(input.company);
  
  const phoneIntel = input.phone.trim() ? analyzePhoneIntelligence(input.phone) : undefined;

  const activeModules: { score: number; findings: string[]; category: string }[] = [];

  if (input.message.trim()) activeModules.push({ ...messageResult, category: "Message Analysis" });
  if (input.url.trim()) activeModules.push({ ...urlResult, category: "Link Verification" });
  if (input.email.trim()) activeModules.push({ ...emailResult, category: "Email Validation" });
  if (input.phone.trim()) activeModules.push({ ...phoneResult, category: "Phone Analysis" });
  if (input.company.trim()) activeModules.push({ ...companyResult, category: "Company Verification" });

  if (activeModules.length === 0) {
    return {
      overallScore: 0,
      riskLevel: "danger",
      explanation: "No input provided for analysis.",
      risks: [],
      highlightedPhrases: [],
      recommendations: ["Please provide at least one input to analyze."],
    };
  }

  const overallScore = Math.round(
    activeModules.reduce((sum, m) => sum + m.score, 0) / activeModules.length
  );

  const riskLevel: "safe" | "warning" | "danger" =
    overallScore >= 80 ? "safe" : overallScore >= 50 ? "warning" : "danger";

  const risks: RiskDetail[] = activeModules.map((m) => ({
    category: m.category,
    score: m.score,
    level: m.score >= 80 ? "safe" as const : m.score >= 50 ? "warning" as const : "danger" as const,
    findings: m.findings.length > 0 ? m.findings : ["No issues detected"],
  }));

  const allFindings = activeModules.flatMap((m) => m.findings);

  let explanation = "";
  if (riskLevel === "safe") {
    explanation = "This opportunity appears legitimate based on our analysis. No major red flags were detected across the verified inputs.";
  } else if (riskLevel === "warning") {
    explanation = `This opportunity shows some suspicious signs. ${allFindings.slice(0, 3).join(". ")}. Exercise caution and verify independently.`;
  } else {
    explanation = `⚠️ HIGH RISK: This opportunity is likely fraudulent. ${allFindings.slice(0, 3).join(". ")}. We strongly recommend avoiding this offer.`;
  }

  const recommendations: string[] = [];
  if (riskLevel !== "safe") {
    recommendations.push("Never pay any fee for a job or internship");
    recommendations.push("Verify the company through official channels");
    recommendations.push("Check the company's website and LinkedIn presence");
    if (allFindings.some((f) => f.includes("email") || f.includes("Email")))
      recommendations.push("Contact the company directly using their official email");
    if (allFindings.some((f) => f.includes("URL") || f.includes("domain")))
      recommendations.push("Do not click suspicious links — verify URLs manually");
  } else {
    recommendations.push("Always stay vigilant even with legitimate-looking offers");
    recommendations.push("Research the company before sharing personal information");
  }

  return {
    overallScore,
    riskLevel,
    explanation,
    risks,
    highlightedPhrases: messageResult.highlights,
    recommendations,
    phoneIntelligence: phoneIntel,
  };
}
