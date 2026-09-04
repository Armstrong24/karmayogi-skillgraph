export type Role = "learner" | "trainer" | "admin"

export type CompetencyLevel = 1 | 2 | 3 | 4 | 5

export interface Competency {
  id: string
  name: string
  shortName: string
  description: string
  requiredLevel: CompetencyLevel
  currentLevel: CompetencyLevel
  verificationSource: string
  confidenceScore: number
  lastAssessed: string
  roleImportance: number
  domain: "Statistical" | "Technical" | "Digital Governance" | "Behavioural"
}

export interface OfficerProfile {
  name: string
  designation: string
  department: string
  cadre: string
  avatar: string
  division: string
  qualification: string
  experience: string
  previousTrainings: number
  profileCompleteness: number
}

export interface DiagnosticQuestion {
  id: number
  text: string
  competency: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface CourseRecommendation {
  id: string
  title: string
  provider: "iGOT Karmayogi" | "NSSTA Academy"
  duration: string
  targetCompetency: string
  targetLevel: CompetencyLevel
  step: number
  whyRecommended: string
  modules: string[]
  quizQuestions: QuizQuestion[]
  prerequisite?: string
}

export interface QuizQuestion {
  id: number
  text: string
  options: string[]
  correctIndex: number
}

export interface GeneratedQuestion {
  id: string
  text: string
  options: string[]
  correctIndex: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  citation: string
  competency: string
  source: string
  approved: boolean
}

export interface DepartmentCompetencyData {
  department: string
  competencies: Record<string, "proficient" | "moderate" | "critical">
  officerCount: number
}

export const officerProfile: OfficerProfile = {
  name: "Arun Sharma",
  designation: "Junior Statistical Officer (JSO)",
  department: "Ministry of Statistics & Programme Implementation",
  cadre: "ISS",
  avatar: "AS",
  division: "Field Operations Division (FOD)",
  qualification: "M.Sc. Statistics",
  experience: "6 years in household surveys",
  previousTrainings: 8,
  profileCompleteness: 92,
}

export const initialCompetencies: Competency[] = [
  {
    id: "survey-sampling",
    name: "Survey Sampling & Stratification",
    shortName: "Survey Sampling",
    description: "Design and execution of stratified random sampling for national surveys",
    requiredLevel: 4,
    currentLevel: 2,
    verificationSource: "Diagnostic Quiz – 52% Score",
    confidenceScore: 52,
    lastAssessed: "2026-08-01",
    roleImportance: 1.4,
    domain: "Statistical",
  },
  {
    id: "python-data",
    name: "Python Data Wrangling",
    shortName: "Python/R",
    description: "Data pipelines, cleaning, and analysis using Python and R",
    requiredLevel: 3,
    currentLevel: 2,
    verificationSource: "iGOT Completed – Python Basics",
    confidenceScore: 68,
    lastAssessed: "2026-07-15",
    roleImportance: 1.2,
    domain: "Technical",
  },
  {
    id: "national-accounts",
    name: "National Accounts & GDP Estimation",
    shortName: "GDP Estimation",
    description: "GDP deflators, national accounts compilation methodology",
    requiredLevel: 4,
    currentLevel: 3,
    verificationSource: "Supervisor Verified",
    confidenceScore: 78,
    lastAssessed: "2026-06-20",
    roleImportance: 1.3,
    domain: "Statistical",
  },
  {
    id: "dpdp-act",
    name: "DPDP Act & Data Privacy Compliance",
    shortName: "DPDP Compliance",
    description: "Digital Personal Data Protection Act 2023 compliance in statistical operations",
    requiredLevel: 3,
    currentLevel: 1,
    verificationSource: "Diagnostic Quiz – 38% Score",
    confidenceScore: 38,
    lastAssessed: "2026-08-01",
    roleImportance: 1.1,
    domain: "Digital Governance",
  },
  {
    id: "cpi-index",
    name: "CPI/IIP Index Numbers Compilation",
    shortName: "Index Numbers",
    description: "Consumer Price Index and Index of Industrial Production methodology",
    requiredLevel: 4,
    currentLevel: 3,
    verificationSource: "iGOT Completed – CPI Module",
    confidenceScore: 72,
    lastAssessed: "2026-07-28",
    roleImportance: 1.2,
    domain: "Statistical",
  },
  {
    id: "ai-ml",
    name: "AI/ML for Official Statistics",
    shortName: "AI/ML",
    description: "Responsible machine learning for classification, estimation, quality checks, and statistical workflows",
    requiredLevel: 3,
    currentLevel: 1,
    verificationSource: "Profile inference – assessment pending",
    confidenceScore: 34,
    lastAssessed: "2026-08-15",
    roleImportance: 1.35,
    domain: "Technical",
  },
  {
    id: "cloud-apis",
    name: "Government Cloud & API Interoperability",
    shortName: "Cloud & APIs",
    description: "Secure cloud workloads, standard APIs, and interoperable government digital ecosystems",
    requiredLevel: 3,
    currentLevel: 2,
    verificationSource: "Work-history evidence",
    confidenceScore: 58,
    lastAssessed: "2026-08-15",
    roleImportance: 1.1,
    domain: "Technical",
  },
  {
    id: "communication",
    name: "Communication & Change Management",
    shortName: "Change Mgmt",
    description: "Communicating statistical insights and leading adoption of modern data practices",
    requiredLevel: 4,
    currentLevel: 3,
    verificationSource: "Supervisor verified",
    confidenceScore: 76,
    lastAssessed: "2026-07-10",
    roleImportance: 0.9,
    domain: "Behavioural",
  },
]

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 1,
    text: "In stratified random sampling, which allocation method ensures minimum variance for a fixed total sample size?",
    competency: "survey-sampling",
    options: [
      "Equal Allocation",
      "Proportional Allocation",
      "Neyman (Optimum) Allocation",
      "Random Allocation",
    ],
    correctIndex: 2,
    explanation: "Neyman Allocation minimizes variance by allocating sample size proportional to stratum standard deviation × size.",
  },
  {
    id: 2,
    text: "In Python's pandas library, which method is used to group data and apply aggregate functions for survey data validation?",
    competency: "python-data",
    options: [
      "df.merge()",
      "df.groupby().agg()",
      "df.pivot_table()",
      "df.resample()",
    ],
    correctIndex: 1,
    explanation: "groupby().agg() is the standard pattern for grouped aggregation in pandas data pipelines.",
  },
  {
    id: 3,
    text: "The GDP Deflator is calculated as the ratio of:",
    competency: "national-accounts",
    options: [
      "Real GDP to Nominal GDP × 100",
      "Nominal GDP to Real GDP × 100",
      "CPI to WPI × 100",
      "Base Year GDP to Current Year GDP × 100",
    ],
    correctIndex: 1,
    explanation: "GDP Deflator = (Nominal GDP / Real GDP) × 100, reflecting the price level change relative to a base year.",
  },
  {
    id: 4,
    text: "Under the DPDP Act 2023, a 'Data Fiduciary' is defined as an entity that:",
    competency: "dpdp-act",
    options: [
      "Processes personal data on behalf of another",
      "Determines the purpose and means of processing personal data",
      "Provides data storage infrastructure",
      "Audits data processing activities",
    ],
    correctIndex: 1,
    explanation: "Under DPDP Act 2023, Section 2(i), a Data Fiduciary determines the purpose and means of processing personal data.",
  },
  {
    id: 5,
    text: "The Laspeyres Price Index uses prices of:",
    competency: "cpi-index",
    options: [
      "Current period with base period quantities",
      "Base period with current period quantities",
      "Base period with base period quantities",
      "Current period with current period quantities",
    ],
    correctIndex: 0,
    explanation: "Laspeyres = (Current prices × Base quantities) / (Base prices × Base quantities) × 100.",
  },
  {
    id: 6,
    text: "Which practice is most important before using an ML model in an official statistical release?",
    competency: "ai-ml",
    options: ["Use the largest model available", "Validate accuracy, bias, explainability, and reproducibility", "Remove human review", "Train only on the latest month"],
    correctIndex: 1,
    explanation: "Official statistics require validated, explainable, reproducible methods with appropriate human oversight.",
  },
  {
    id: 7,
    text: "What is the safest pattern for exchanging completion records between government platforms?",
    competency: "cloud-apis",
    options: ["Public spreadsheet links", "Authenticated, versioned APIs with encryption and audit logs", "Email attachments", "Anonymous webhook endpoints"],
    correctIndex: 1,
    explanation: "Authenticated and versioned APIs with encryption, authorization, and auditability support secure interoperability.",
  },
  {
    id: 8,
    text: "Which approach best supports adoption of a new statistical data workflow?",
    competency: "communication",
    options: ["Launch without consultation", "Communicate outcomes, involve users, train teams, and measure adoption", "Only send a policy circular", "Avoid feedback after launch"],
    correctIndex: 1,
    explanation: "Sustainable change combines stakeholder communication, participation, training, and measured feedback.",
  },
]

export const courseRecommendations: CourseRecommendation[] = [
  {
    id: "course-ai",
    title: "Responsible AI/ML for Official Statistics",
    provider: "NSSTA Academy",
    duration: "14 hrs",
    targetCompetency: "ai-ml",
    targetLevel: 2,
    step: 1,
    whyRecommended: "AI/ML is your highest emerging-technology gap: current Level 1 against the Level 3 benchmark. This programme introduces safe, explainable applications in data quality, classification, estimation, and dissemination.",
    modules: ["AI use cases in Official Statistics", "Data readiness & model evaluation", "Explainability, bias & human oversight", "Responsible deployment in government"],
    quizQuestions: [
      {
        id: 1,
        text: "Why should an AI-assisted official statistic retain human review?",
        options: ["To slow publication", "To validate context, quality, and accountability", "To avoid documentation", "To replace evaluation"],
        correctIndex: 1,
      },
      {
        id: 2,
        text: "Which split is used to estimate model performance on unseen data?",
        options: ["Training set only", "Held-out validation or test set", "Duplicated records", "Unlabelled production output only"],
        correctIndex: 1,
      },
      {
        id: 3,
        text: "A reproducible ML workflow should record:",
        options: ["Only the final chart", "Data version, code, parameters, model, and evaluation", "Only the model name", "Only the developer's notes"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "course-1",
    title: "Foundation of Survey Sampling Methodology",
    provider: "NSSTA Academy",
    duration: "12 hrs",
    targetCompetency: "survey-sampling",
    targetLevel: 3,
    step: 2,
    whyRecommended: "Your JSO role requires Level 4 in Survey Sampling, while the diagnostic scored Level 2 (Priority Gap: 2.0x). This foundational course addresses stratification and estimation techniques critical for NSS field surveys.",
    modules: ["Probability Sampling Theory", "Stratified Random Sampling Design", "Estimation & Variance Analysis", "Field Sampling Challenges"],
    quizQuestions: [
      {
        id: 1,
        text: "In a two-stage sampling design, the Primary Sampling Units (PSUs) in the NSS are typically:",
        options: ["Individual households", "Villages/Urban blocks", "Districts", "States"],
        correctIndex: 1,
      },
      {
        id: 2,
        text: "The design effect (DEFF) measures:",
        options: ["Survey non-response rate", "Efficiency of complex design vs SRS", "Field cost per interview", "Data entry accuracy"],
        correctIndex: 1,
      },
      {
        id: 3,
        text: "Which formula correctly expresses the Horvitz-Thompson estimator?",
        options: ["Σ yi/πi", "Σ yi × πi", "n × ȳ", "N × ȳ"],
        correctIndex: 0,
      },
    ],
    prerequisite: undefined,
  },
  {
    id: "course-2",
    title: "Python for Statistical Data Analysis",
    provider: "iGOT Karmayogi",
    duration: "16 hrs",
    targetCompetency: "python-data",
    targetLevel: 3,
    step: 3,
    whyRecommended: "Your diagnostic shows Level 2 in Python Data Wrangling vs required Level 3. This course builds pandas, numpy, and visualization skills essential for MoSPI data processing workflows.",
    modules: ["Python Data Structures for Statistics", "Pandas Data Cleaning & Validation", "Survey Data Aggregation", "Visualization with Matplotlib/Seaborn"],
    quizQuestions: [
      {
        id: 1,
        text: "To read an Excel file from PLFS survey data in pandas, the correct method is:",
        options: ["pd.read_csv()", "pd.read_excel()", "pd.load_excel()", "pd.import_excel()"],
        correctIndex: 1,
      },
      {
        id: 2,
        text: "Which pandas method removes duplicate rows from survey responses?",
        options: ["df.remove_duplicates()", "df.drop_duplicates()", "df.deduplicate()", "df.unique()"],
        correctIndex: 1,
      },
      {
        id: 3,
        text: "To calculate the weighted mean in pandas, you would use:",
        options: ["df.mean()", "np.average(df, weights=w)", "df.weighted_mean()", "df.sum()/len(df)"],
        correctIndex: 1,
      },
    ],
    prerequisite: "Foundation of Survey Sampling Methodology",
  },
  {
    id: "course-3",
    title: "Applied GDP Estimation & National Accounts",
    provider: "NSSTA Academy",
    duration: "20 hrs",
    targetCompetency: "national-accounts",
    targetLevel: 4,
    step: 4,
    whyRecommended: "Your current Level 3 must reach Level 4 for JSO role advancement. This advanced module covers SNA 2025 methodology, value-added computations, and reconciliation techniques used in MoSPI's annual GDP estimates.",
    modules: ["SNA 2025 Framework", "Value Added & Production Accounts", "GDP Deflator Computation", "Reconciliation & Benchmarking"],
    quizQuestions: [
      {
        id: 1,
        text: "In the expenditure approach to GDP, net exports are calculated as:",
        options: ["Imports - Exports", "Exports + Imports", "Exports - Imports", "Exports × Import Price Index"],
        correctIndex: 2,
      },
      {
        id: 2,
        text: "Chain-linking in national accounts is used to:",
        options: ["Link survey rounds", "Remove base year effects in volume measures", "Connect state GDP estimates", "Link quarterly and annual data"],
        correctIndex: 1,
      },
      {
        id: 3,
        text: "The Wholesale Price Index (WPI) is used as a deflator primarily for which GDP component?",
        options: ["Private Final Consumption", "Gross Fixed Capital Formation", "Government Final Consumption", "Net Exports"],
        correctIndex: 1,
      },
    ],
    prerequisite: "Python for Statistical Data Analysis",
  },
]

export const generatedQuestions: GeneratedQuestion[] = [
  {
    id: "q1",
    text: "According to the NSS 78th Round Manual, what is the reference period for measuring household consumer expenditure for 'frequently purchased items'?",
    options: [
      "A. Last 30 days",
      "B. Last 7 days",
      "C. Last 365 days",
      "D. Last 90 days",
    ],
    correctIndex: 1,
    difficulty: "Intermediate",
    citation: "\"For items purchased frequently, the reference period adopted is the last 7 days preceding the date of survey.\" — NSS 78th Round Instruction Manual, Para 2.3.1, Page 18.",
    competency: "survey-sampling",
    source: "NSS 78th Round Manual.pdf",
    approved: false,
  },
  {
    id: "q2",
    text: "As per the PLFS Survey Methodology, what is the definition of 'Usual Principal Activity' (UPA)?",
    options: [
      "A. Activity pursued for more than 183 days in the reference year",
      "B. Activity in which a person spent the major time during the reference year",
      "C. Activity generating maximum income during the reference year",
      "D. Activity listed first in the household schedule",
    ],
    correctIndex: 1,
    difficulty: "Advanced",
    citation: "\"The usual principal activity is the activity in which a person has spent relatively more time during the 365 days preceding the date of survey.\" — PLFS Survey Methodology 2017-18, Chapter 3, Para 3.2, Page 24.",
    competency: "python-data",
    source: "PLFS Survey Methodology.pdf",
    approved: false,
  },
  {
    id: "q3",
    text: "According to the CPI Compilation Handbook, which weighting base is used for the current CPI (Rural + Urban) series released by MoSPI?",
    options: [
      "A. NSSO 61st Round (2004-05)",
      "B. NSSO 66th Round (2011-12)",
      "C. NSSO 68th Round (2011-12)",
      "D. HCES 2022-23",
    ],
    correctIndex: 1,
    difficulty: "Beginner",
    citation: "\"The weighting diagrams for the CPI series are based on the Modified Mixed Reference Period (MMRP) data from the NSSO 66th Round Consumer Expenditure Survey (2009-10), which serves as the base for current CPI compilation.\" — CPI Compilation Handbook, Section 2.4, Page 31.",
    competency: "cpi-index",
    source: "CPI Compilation Handbook.pdf",
    approved: false,
  },
]

export const departmentData: DepartmentCompetencyData[] = [
  {
    department: "Field Operations Division",
    competencies: {
      "Survey Sampling": "moderate",
      "Python/R": "critical",
      "GDP Estimation": "moderate",
      "DPDP Compliance": "critical",
      "Index Numbers": "moderate",
    },
    officerCount: 342,
  },
  {
    department: "National Accounts Division",
    competencies: {
      "Survey Sampling": "proficient",
      "Python/R": "moderate",
      "GDP Estimation": "proficient",
      "DPDP Compliance": "moderate",
      "Index Numbers": "proficient",
    },
    officerCount: 128,
  },
  {
    department: "Price Statistics Division",
    competencies: {
      "Survey Sampling": "proficient",
      "Python/R": "moderate",
      "GDP Estimation": "moderate",
      "DPDP Compliance": "critical",
      "Index Numbers": "proficient",
    },
    officerCount: 97,
  },
  {
    department: "Data Analytics Unit",
    competencies: {
      "Survey Sampling": "moderate",
      "Python/R": "proficient",
      "GDP Estimation": "moderate",
      "DPDP Compliance": "moderate",
      "Index Numbers": "moderate",
    },
    officerCount: 64,
  },
]

export const heatmapOfficers: Record<string, Record<string, string[]>> = {
  "Field Operations Division": {
    "Survey Sampling": ["Ritu Verma (JSO)", "Mahesh Patil (JSO)", "Deepa Nair (SSO)"],
    "Python/R": ["Arun Sharma (JSO)", "Pooja Mehta (JSO)", "Ravi Kumar (JSO)", "Sunita Rao (SSO)"],
    "GDP Estimation": ["Kiran Joshi (SSO)", "Anand Singh (JSO)"],
    "DPDP Compliance": ["Arun Sharma (JSO)", "Meera Pillai (SSO)", "Rahul Das (JSO)", "Priya Nair (JSO)"],
    "Index Numbers": ["Suresh Babu (JSO)", "Asha Thomas (SSO)"],
  },
  "National Accounts Division": {
    "Python/R": ["Varun Gupta (SSO)", "Lakshmi Iyer (JSO)"],
    "DPDP Compliance": ["Sanjay Mishra (Dir)", "Tanvi Shah (SSO)"],
  },
  "Price Statistics Division": {
    "Python/R": ["Nikhil Roy (JSO)", "Geeta Patel (SSO)"],
    "DPDP Compliance": ["Harish Kumar (JSO)", "Kavya Reddy (JSO)", "Mohan Das (SSO)"],
    "GDP Estimation": ["Swati Jain (SSO)"],
  },
  "Data Analytics Unit": {
    "Survey Sampling": ["Rohit Sharma (SSO)"],
    "GDP Estimation": ["Nisha Agarwal (SSO)"],
  },
}
