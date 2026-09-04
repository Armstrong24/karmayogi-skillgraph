import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  ExternalLink,
  InfoIcon,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  CloudCog,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import type { Competency } from "@/data/appData"
import { courseRecommendations } from "@/data/appData"

interface ModuleBProps {
  competencies: Competency[]
  onCourseComplete: (competencyId: string, newLevel: number) => void
  language: "en" | "hi"
}

export default function ModuleB({ competencies, onCourseComplete, language }: ModuleBProps) {
  const hi = language === "hi"
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null)
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set())
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set(["course-ai"]))
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState("Today, 09:30")

  const skillGaps = useMemo(() => {
    return competencies.map((c) => ({
      ...c,
      gap: Math.max(0, c.requiredLevel - c.currentLevel),
      priority: Math.max(0, c.requiredLevel - c.currentLevel) * c.roleImportance * (1.5 - c.confidenceScore / 100),
    }))
  }, [competencies])

  const primaryDeficit = useMemo(() => {
    return [...skillGaps].sort((a, b) => b.priority - a.priority)[0]
  }, [skillGaps])

  const criticalGaps = useMemo(() => skillGaps.filter((g) => g.gap >= 2).length, [skillGaps])

  const totalHours = useMemo(
    () => courseRecommendations.reduce((sum, c) => sum + parseInt(c.duration), 0),
    []
  )

  const activeCourse = courseRecommendations.find((c) => c.id === activeCourseId)
  const quizProgress = activeCourse ? ((quizStep + 1) / activeCourse.quizQuestions.length) * 100 : 0

  const handleQuizNext = () => {
    if (!activeCourse || selectedAnswer === "") return
    if (!answerRevealed) {
      setAnswerRevealed(true)
      return
    }
    const newAnswers = { ...quizAnswers, [quizStep]: parseInt(selectedAnswer) }
    setQuizAnswers(newAnswers)
    setSelectedAnswer("")
    setAnswerRevealed(false)
    if (quizStep < activeCourse.quizQuestions.length - 1) {
      setQuizStep(quizStep + 1)
    } else {
      const correct = Object.entries(newAnswers).filter(
        ([i, a]) => activeCourse.quizQuestions[parseInt(i)]?.correctIndex === a
      ).length
      const passed = correct >= 2
      setActiveCourseId(null)
      setQuizStep(0)
      setQuizAnswers({})
      if (passed) {
        setCompletedCourses((prev) => new Set([...prev, activeCourse.id]))
        const competency = competencies.find((c) => c.id === activeCourse.targetCompetency)
        if (competency) {
          onCourseComplete(activeCourse.targetCompetency, Math.min(5, competency.currentLevel + 1))
        }
        toast.success(`Module Completed: ${activeCourse.title}`, {
          description: `Score: ${correct}/${activeCourse.quizQuestions.length}. Skill Passport updated!`,
        })
      } else {
        toast.error("Quiz Not Passed", {
          description: `Score: ${correct}/${activeCourse.quizQuestions.length}. Please retry the module.`,
        })
      }
    }
  }

  const handleCatalogSync = async () => {
    setIsSyncing(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setLastSynced("Just now")
    setIsSyncing(false)
    toast.success("Learning catalogue synchronized", {
      description: "Representative iGOT and NSSTA catalogue records are up to date. A production deployment will call approved platform APIs.",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <CloudCog className="size-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">iGOT + NSSTA {hi ? "शिक्षण कनेक्टर" : "learning connector"}</p>
                  <Badge className="border-amber-200 bg-amber-100 text-amber-800">{hi ? "प्रोटोटाइप एडाप्टर" : "Prototype adapter"}</Badge>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {hi ? "कोर्स मैपिंग, नामांकन स्थिति और पूर्णता सिंक" : "Catalogue mapping, enrolment status, and completion sync"} · {hi ? "अंतिम सिंक" : "Last synchronized"} {lastSynced}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><ShieldCheck className="size-3.5 text-emerald-600" /> 1,248 mapped courses</span>
                  <span>3 personalized matches</span>
                  <span>8 completions imported</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleCatalogSync} disabled={isSyncing} className="gap-2">
              <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? (hi ? "सिंक हो रहा है…" : "Synchronizing…") : (hi ? "कैटलॉग सिंक करें" : "Sync catalogue")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{hi ? "प्राथमिक कौशल अंतर" : "Primary Skill Deficit"}</p>
              <p className="text-sm font-bold text-rose-700">{primaryDeficit?.shortName ?? "—"}</p>
              <p className="text-xs text-rose-500">{hi ? "अंतर" : "Gap"}: {primaryDeficit?.gap ?? 0} {hi ? "स्तर" : "levels"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/80 bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <TrendingUp className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{hi ? "महत्वपूर्ण भूमिका अंतर" : "Critical Role Gaps"}</p>
              <p className="text-2xl font-bold text-amber-700">{criticalGaps}</p>
              <p className="text-xs text-amber-500">{hi ? "दक्षताएँ आवश्यक स्तर से ≥ 2 नीचे" : "Competencies ≥ 2 levels below"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/80 bg-card shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Clock className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{hi ? "लक्षित पूर्णता" : "Target Completion"}</p>
              <p className="text-2xl font-bold text-blue-700">{totalHours} {hi ? "घंटे" : "hrs"}</p>
              <p className="text-xs text-blue-500">{courseRecommendations.length} {hi ? "मॉड्यूल में" : "modules total"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">{hi ? "शिक्षण गतिविधि और नामांकन इतिहास" : "Learning activity & enrolment history"}</CardTitle>
          <CardDescription>{hi ? "iGOT Karmayogi और NSSTA TPAC से सिंक किए गए प्रतिनिधि रिकॉर्ड" : "Representative records synchronized from iGOT Karmayogi and NSSTA TPAC"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{hi ? "वर्तमान नामांकन" : "Currently enrolled"}</p>
              <p className="mt-1 text-2xl font-bold">{enrolledCourses.size}</p>
              <p className="mt-1 text-xs text-muted-foreground">{hi ? "सक्रिय शिक्षण मॉड्यूल" : "Active learning modules"}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{hi ? "डेमो में पूर्ण" : "Completed in demo"}</p>
              <p className="mt-1 text-2xl font-bold">{completedCourses.size}</p>
              <p className="mt-1 text-xs text-muted-foreground">{hi ? "स्किल पासपोर्ट अपडेट" : "Skill Passport updates"}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{hi ? "पिछला प्रशिक्षण" : "Previous learning"}</p>
              <p className="mt-1 text-2xl font-bold">8</p>
              <p className="mt-1 text-xs text-muted-foreground">{hi ? "आयातित पूर्णताएँ · 74 घंटे" : "Imported completions · 74 hrs"}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {["Python Basics · Completed 15 Jul 2026", "CPI Compilation · Completed 28 Jul 2026", "DPDP Awareness · Completed 10 Jun 2026"].map((entry) => (
              <div key={entry} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs">
                <CheckCircle2 className="size-3.5 text-emerald-600" /> {entry}
                <Badge variant="outline" className="ml-auto">iGOT sync</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Pipeline + Courses */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            {hi ? "क्रमबद्ध शिक्षण मार्ग" : "Sequenced Learning Pathway"}
          </CardTitle>
          <CardDescription>{hi ? "आपकी भूमिका के दक्षता अंतर के अनुसार पूर्वापेक्षा-आधारित कोर्स क्रम" : "Prerequisite-aware course order tailored to your JSO role gaps"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {courseRecommendations.map((course, index) => {
            const isCompleted = completedCourses.has(course.id)
            const competency = competencies.find((c) => c.id === course.targetCompetency)
            const gap = competency ? competency.requiredLevel - competency.currentLevel : 0
            return (
              <div key={course.id} className="relative">
                {/* Timeline connector */}
                {index < courseRecommendations.length - 1 && (
                  <div className="absolute left-5 top-full w-0.5 h-4 bg-border z-10" />
                )}
                <div className={`rounded-xl border p-5 transition-all ${
                  isCompleted
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-border/60 bg-card hover:border-primary/30 hover:shadow-sm"
                }`}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Step indicator */}
                    <div className={`size-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-primary/10 text-primary border-2 border-primary/30"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="size-5" /> : `S${course.step}`}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-sm text-foreground">{course.title}</h3>
                            {isCompleted && (
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                                Completed
                              </Badge>
                            )}
                          </div>
                          {course.prerequisite && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {hi ? "पूर्वापेक्षा" : "Prerequisites"}: {course.prerequisite}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {course.provider}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {course.duration}
                          </Badge>
                          {gap > 0 && (
                            <Badge className="bg-rose-100 text-rose-700 border-rose-200 text-xs">
                              {hi ? "अंतर" : "Gap"}: {gap} {hi ? "स्तर" : "levels"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Why Recommended Alert */}
                      <Alert className="border-blue-200 bg-blue-50/60 py-3">
                        <InfoIcon className="size-4 text-blue-600 mt-0.5" />
                        <AlertTitle className="text-xs font-semibold text-blue-800 mb-1">{hi ? "यह कोर्स क्यों?" : "Why this course?"}</AlertTitle>
                        <AlertDescription className="text-xs text-blue-700 leading-relaxed">
                          {course.whyRecommended}
                        </AlertDescription>
                      </Alert>

                      {/* Modules list */}
                      <div className="flex flex-wrap gap-1.5">
                        {course.modules.map((mod) => (
                          <span
                            key={mod}
                            className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            <ChevronRight className="size-3 mr-0.5 text-primary" />
                            {mod}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <Button
                          size="sm"
                          className="gap-2 text-xs"
                          onClick={() => {
                            if (!enrolledCourses.has(course.id)) {
                              setEnrolledCourses((current) => new Set([...current, course.id]))
                              toast.success(`Enrolled in ${course.title}`, { description: "Demo enrolment recorded. Production uses the approved iGOT connector." })
                              return
                            }
                            setActiveCourseId(course.id)
                            setQuizStep(0)
                            setQuizAnswers({})
                            setSelectedAnswer("")
                            setAnswerRevealed(false)
                          }}
                          disabled={isCompleted}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="size-3.5" />
                              {hi ? "पूर्ण" : "Completed"}
                            </>
                          ) : (
                            <>
                              <ExternalLink className="size-3.5" />
                              {enrolledCourses.has(course.id) ? (hi ? "डेमो मॉड्यूल खोलें" : "Open Demo Module") : (hi ? "मार्ग में नामांकन करें" : "Enroll in pathway")}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {index < courseRecommendations.length - 1 && (
                  <div className="flex justify-center my-1">
                    <Separator orientation="vertical" className="h-4" />
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Course Simulator Dialog */}
      <Dialog open={!!activeCourseId} onOpenChange={(open) => !open && setActiveCourseId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              {activeCourse?.title}
            </DialogTitle>
            <DialogDescription>
              {hi ? "मॉड्यूल-अंत मूल्यांकन — उत्तीर्ण होने पर आपका स्किल पासपोर्ट अपडेट होगा" : "End-of-Module Assessment — passing (2/3) updates your Skill Passport"}
            </DialogDescription>
          </DialogHeader>
          {activeCourse && (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{hi ? "प्रश्न" : "Question"} {quizStep + 1} {hi ? "/" : "of"} {activeCourse.quizQuestions.length}</span>
                  <span className="font-medium text-primary">{Math.round(quizProgress)}%</span>
                </div>
                <Progress value={quizProgress} className="h-2" />
              </div>
              <div className="rounded-lg bg-muted/40 border border-border/60 p-4">
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {activeCourse.quizQuestions[quizStep]?.text}
                </p>
              </div>
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={answerRevealed} className="space-y-2">
                {activeCourse.quizQuestions[quizStep]?.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors ${
                      selectedAnswer === String(idx) ? "border-primary/50 bg-primary/5" : "border-border/60 hover:bg-muted/40"
                    }`}
                    onClick={() => setSelectedAnswer(String(idx))}
                  >
                    <RadioGroupItem value={String(idx)} id={`qopt-${idx}`} className="mt-0.5" />
                    <Label htmlFor={`qopt-${idx}`} className="text-sm cursor-pointer">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
              {answerRevealed && (
                <Alert className={Number(selectedAnswer) === activeCourse.quizQuestions[quizStep]?.correctIndex ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}>
                  <CheckCircle2 className="size-4" />
                  <AlertTitle>{Number(selectedAnswer) === activeCourse.quizQuestions[quizStep]?.correctIndex ? (hi ? "सही" : "Correct") : (hi ? "पुनः देखें" : "Not quite")}</AlertTitle>
                  <AlertDescription>
                    {Number(selectedAnswer) === activeCourse.quizQuestions[quizStep]?.correctIndex
                      ? (hi ? "यह साक्ष्य आपके दक्षता स्कोर में सकारात्मक योगदान देगा।" : "This evidence will contribute positively to your competency score.")
                      : (hi ? `सही उत्तर: ${activeCourse.quizQuestions[quizStep]?.options[activeCourse.quizQuestions[quizStep]?.correctIndex]}। आगे बढ़ने से पहले मॉड्यूल की अवधारणा दोहराएँ।` : `Correct answer: ${activeCourse.quizQuestions[quizStep]?.options[activeCourse.quizQuestions[quizStep]?.correctIndex]}. Review the module concept before continuing.`)}
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => { setActiveCourseId(null); setAnswerRevealed(false) }}>
                  {hi ? "रद्द करें" : "Cancel"}
                </Button>
                <Button onClick={handleQuizNext} disabled={selectedAnswer === ""}>
                  {!answerRevealed ? (hi ? "उत्तर जाँचें" : "Check answer") : quizStep < activeCourse.quizQuestions.length - 1 ? (hi ? "आगे बढ़ें →" : "Continue →") : (hi ? "क्विज़ जमा करें" : "Submit Quiz")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
