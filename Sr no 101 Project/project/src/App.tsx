import { lazy, Suspense, useState, useMemo, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { AiLearningAssistant } from "@/components/ai-learning-assistant"
import { DemoLogin } from "@/components/demo-login"
import { ModeToggle } from "@/components/mode-toggle"
import { TrustArchitecture } from "@/components/trust-architecture"
import { Separator } from "@/components/ui/separator"
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardCheck,
  Landmark,
  Sparkles,
  ChevronRight,
  Languages,
  LogOut,
  RotateCcw,
} from "lucide-react"
import { initialCompetencies, type Competency, type Role } from "@/data/appData"

const ModuleA = lazy(() => import("@/components/modules/ModuleA"))
const ModuleB = lazy(() => import("@/components/modules/ModuleB"))
const ModuleC = lazy(() => import("@/components/modules/ModuleC"))
const ModuleD = lazy(() => import("@/components/modules/ModuleD"))

type View = "competency" | "learning"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("karmayogi-demo-auth") === "true")
  const [language, setLanguage] = useState<"en" | "hi">(() => localStorage.getItem("karmayogi-language") === "hi" ? "hi" : "en")
  const [role, setRole] = useState<Role>(() => (localStorage.getItem("karmayogi-role") as Role) || "learner")
  const [competencies, setCompetencies] = useState<Competency[]>(() => {
    try {
      const saved = localStorage.getItem("karmayogi-competencies")
      if (!saved) return initialCompetencies
      const stored = JSON.parse(saved) as Competency[]
      return initialCompetencies.map(
        (competency) => stored.find((item) => item.id === competency.id) ?? competency
      )
    } catch {
      return initialCompetencies
    }
  })
  const [activeView, setActiveView] = useState<View>("competency")

  useEffect(() => {
    localStorage.setItem("karmayogi-competencies", JSON.stringify(competencies))
  }, [competencies])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = language === "hi" ? "कर्मयोगी स्किलग्राफ" : "Karmayogi SkillGraph"
  }, [language])

  const handleDiagnosticComplete = (scores: Record<string, number>) => {
    setCompetencies((prev) =>
      prev.map((c) => {
        const score = scores[c.id]
        if (score === undefined) return c
        const newLevel = score >= 80 ? Math.min(5, c.requiredLevel) : score >= 60 ? Math.max(1, Math.min(4, c.requiredLevel - 1)) : Math.max(1, c.requiredLevel - 2) as Competency["currentLevel"]
        return {
          ...c,
          currentLevel: newLevel as Competency["currentLevel"],
          confidenceScore: score,
          verificationSource: `Diagnostic Quiz – ${score}% Score`,
          lastAssessed: new Date().toISOString().split("T")[0],
        }
      })
    )
  }

  const handleCourseComplete = (competencyId: string, newLevel: number) => {
    setCompetencies((prev) =>
      prev.map((c) =>
        c.id === competencyId
          ? {
              ...c,
              currentLevel: Math.min(5, newLevel) as Competency["currentLevel"],
              verificationSource: "iGOT Course Completed",
              confidenceScore: Math.min(100, c.confidenceScore + 15),
              lastAssessed: new Date().toISOString().split("T")[0],
            }
          : c
      )
    )
  }

  const copy = language === "hi" ? {
    learner: "सांख्यिकी अधिकारी",
    trainer: "NSSTA मूल्यांकन प्रमुख",
    admin: "मंत्रालय प्रशासक",
    learnerTitle: "मेरा दक्षता केंद्र",
    learnerDescription: "आपकी भूमिका के लिए AI-संचालित कौशल अंतर और व्यक्तिगत शिक्षण मार्ग",
    trainerTitle: "RAG-आधारित मूल्यांकन जनरेटर",
    trainerDescription: "आधिकारिक शिक्षण सामग्री से स्रोत-सत्यापित MCQ तैयार करें",
    adminTitle: "कैडर इंटेलिजेंस डैशबोर्ड",
    adminDescription: "संगठन-व्यापी दक्षता, प्रशिक्षण और उभरते कौशल का विश्लेषण",
    competencyTab: "दक्षता और निदान",
    learningTab: "शिक्षण मार्ग",
  } : {
    learner: "Statistical Officer",
    trainer: "NSSTA Assessment Lead",
    admin: "Ministry Admin",
    learnerTitle: "My Competency Hub",
    learnerDescription: "AI-powered skill gap analysis and personalised learning pathway for your role",
    trainerTitle: "RAG-Grounded Assessment Generator",
    trainerDescription: "Generate source-grounded MCQs from official learning materials with human review",
    adminTitle: "Cadre Intelligence Dashboard",
    adminDescription: "Organisation-wide competency, training, and emerging-skills intelligence",
    competencyTab: "Competency & Diagnostics",
    learningTab: "Learning Pathway",
  }

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole)
    setIsAuthenticated(true)
    localStorage.setItem("karmayogi-role", selectedRole)
    localStorage.setItem("karmayogi-demo-auth", "true")
  }

  const handleRoleChange = (selectedRole: Role) => {
    setRole(selectedRole)
    localStorage.setItem("karmayogi-role", selectedRole)
  }

  const toggleLanguage = () => {
    const nextLanguage = language === "en" ? "hi" : "en"
    setLanguage(nextLanguage)
    localStorage.setItem("karmayogi-language", nextLanguage)
  }

  const resetDemo = () => {
    localStorage.removeItem("karmayogi-competencies")
    localStorage.removeItem("karmayogi-role")
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem("karmayogi-demo-auth")
    setIsAuthenticated(false)
  }

  const roleConfig = {
    learner: {
      label: copy.learner,
      icon: <GraduationCap className="size-4" />,
      badge: "Learner View",
    },
    trainer: {
      label: copy.trainer,
      icon: <ClipboardCheck className="size-4" />,
      badge: "Trainer View",
    },
    admin: {
      label: copy.admin,
      icon: <Landmark className="size-4" />,
      badge: "Admin View",
    },
  }

  const overallIndex = useMemo(() => {
    const avg = competencies.reduce((s, c) => s + c.currentLevel, 0) / competencies.length
    return Math.round(avg * 10) / 10
  }, [competencies])

  if (!isAuthenticated) {
    return <DemoLogin onLogin={handleLogin} language={language} onLanguageChange={toggleLanguage} />
  }

  return (
    <div className="min-h-svh flex flex-col">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-352 px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
                <Sparkles className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif text-base font-semibold tracking-tight text-foreground sm:text-lg whitespace-nowrap">
                    Karmayogi SkillGraph
                  </span>
                  <Badge className="hidden sm:inline-flex bg-primary/10 text-primary border-primary/20 text-xs font-medium">
                    MoSPI · NSSTA · iGOT
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground hidden md:block">
                  SIH 2026 · Problem Statement 26101 · India's Official Statistical System
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden lg:flex items-center gap-1.5 text-xs">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                CI: {overallIndex} / 5.0
              </Badge>
              <TrustArchitecture language={language} />
              <Button variant="outline" size="icon" onClick={toggleLanguage} title={language === "en" ? "हिंदी में देखें" : "View in English"}>
                <Languages className="size-4" />
                <span className="sr-only">Change language</span>
              </Button>
              <Button variant="outline" size="icon" onClick={resetDemo} title="Reset demonstration data" className="hidden sm:inline-flex">
                <RotateCcw className="size-4" />
                <span className="sr-only">Reset demo</span>
              </Button>
              <ModeToggle />
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out of demo">
                <LogOut className="size-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-nav: Role Switcher */}
      <div className="border-b border-border/60 bg-card/35 backdrop-blur-sm">
        <div className="mx-auto max-w-352 px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center gap-1 overflow-x-auto">
            {(Object.entries(roleConfig) as [Role, typeof roleConfig.learner][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => handleRoleChange(key)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  role === key
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border/70"
                    : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
                }`}
              >
                {cfg.icon}
                {cfg.label}
                {role === key && (
                  <span className="hidden sm:inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 text-xs ml-0.5">
                    {language === "hi" ? "सक्रिय" : "Active"}
                  </span>
                )}
              </button>
            ))}
            <Separator orientation="vertical" className="h-4 mx-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Arun Sharma · JSO · FOD
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-352 flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Suspense
          fallback={(
            <div className="grid min-h-72 place-items-center rounded-2xl border border-border/70 bg-card/70">
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <span className="size-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
                Loading workspace…
              </div>
            </div>
          )}
        >
        {role === "learner" && (
          <div className="space-y-6">
            {/* Page header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>iGOT Karmayogi</span>
                <ChevronRight className="size-3" />
                <span>SkillGraph</span>
                <ChevronRight className="size-3" />
                <span className="text-foreground font-medium">{language === "hi" ? "मेरा शिक्षण केंद्र" : "My Learning Hub"}</span>
              </div>
              <h1 className="text-balance text-3xl font-medium tracking-[-0.025em] text-foreground sm:text-4xl">{copy.learnerTitle}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.learnerDescription}</p>
            </div>

            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as View)}>
              <TabsList className="mb-4">
                <TabsTrigger value="competency" className="gap-1.5 text-xs sm:text-sm">
                  <LayoutDashboard className="size-3.5" />
                  {copy.competencyTab}
                </TabsTrigger>
                <TabsTrigger value="learning" className="gap-1.5 text-xs sm:text-sm">
                  <GraduationCap className="size-3.5" />
                  {copy.learningTab}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="competency">
                <ModuleA
                  competencies={competencies}
                  onDiagnosticComplete={handleDiagnosticComplete}
                  language={language}
                />
              </TabsContent>
              <TabsContent value="learning">
                <ModuleB
                  competencies={competencies}
                  onCourseComplete={handleCourseComplete}
                  language={language}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {role === "trainer" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>NSSTA Academy</span>
                <ChevronRight className="size-3" />
                <span>{language === "hi" ? "मूल्यांकन उपकरण" : "Assessment Tools"}</span>
                <ChevronRight className="size-3" />
                <span className="text-foreground font-medium">{language === "hi" ? "RAG क्विज़ जनरेटर" : "RAG Quiz Generator"}</span>
              </div>
              <h1 className="text-balance text-3xl font-medium tracking-[-0.025em] text-foreground sm:text-4xl">{copy.trainerTitle}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{copy.trainerDescription}</p>
            </div>
            <ModuleC language={language} />
          </div>
        )}

        {role === "admin" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>MoSPI</span>
                <ChevronRight className="size-3" />
                <span>{language === "hi" ? "मंत्रालय डैशबोर्ड" : "Ministry Dashboard"}</span>
                <ChevronRight className="size-3" />
                <span className="text-foreground font-medium">{language === "hi" ? "कैडर विश्लेषण" : "Cadre Analytics"}</span>
              </div>
              <h1 className="text-balance text-3xl font-medium tracking-[-0.025em] text-foreground sm:text-4xl">{copy.adminTitle}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{copy.adminDescription}</p>
            </div>
            <ModuleD language={language} />
          </div>
        )}
        </Suspense>
      </main>

      <AiLearningAssistant role={role} competencies={competencies} language={language} />

      {/* Footer */}
      <footer className="mt-auto border-t border-border/60 bg-card/30 py-5">
        <div className="mx-auto max-w-352 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Karmayogi SkillGraph · SIH 2026 · PS-26101 · MoSPI DIID</span>
            <div className="flex items-center gap-3">
              <span>{language === "hi" ? "iGOT कर्मयोगी द्वारा समर्थित" : "Powered by iGOT Karmayogi"}</span>
              <Separator orientation="vertical" className="h-3" />
              <span>{language === "hi" ? "भारत की आधिकारिक सांख्यिकी प्रणाली" : "India's Official Statistical System"}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
