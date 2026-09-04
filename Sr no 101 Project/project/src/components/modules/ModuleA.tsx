import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { toast } from "sonner"
import { ClipboardList, BadgeCheck, Target, Zap, Pencil, Save } from "lucide-react"
import type { Competency } from "@/data/appData"
import { officerProfile, diagnosticQuestions } from "@/data/appData"

interface ModuleAProps {
  competencies: Competency[]
  onDiagnosticComplete: (scores: Record<string, number>) => void
  language: "en" | "hi"
}

const levelLabel = (level: number, hi = false): string => {
  const labels = hi
    ? ["", "जागरूकता", "मूल", "मध्यवर्ती", "उन्नत", "विशेषज्ञ"]
    : ["", "Awareness", "Basic", "Intermediate", "Advanced", "Expert"]
  return labels[level] ?? (hi ? "अज्ञात" : "Unknown")
}

const levelVariant = (level: number): string => {
  if (level >= 4) return "bg-emerald-100 text-emerald-800 border-emerald-200"
  if (level === 3) return "bg-blue-100 text-blue-800 border-blue-200"
  if (level === 2) return "bg-amber-100 text-amber-800 border-amber-200"
  return "bg-rose-100 text-rose-800 border-rose-200"
}

const diagnosticHindi: Record<number, { text: string; options: string[]; explanation: string }> = {
  1: { text: "स्तरीकृत यादृच्छिक नमूनाकरण में निश्चित कुल नमूना आकार के लिए न्यूनतम विचरण कौन-सी आवंटन विधि देती है?", options: ["समान आवंटन", "आनुपातिक आवंटन", "नेमन (इष्टतम) आवंटन", "यादृच्छिक आवंटन"], explanation: "नेमन आवंटन स्तर के मानक विचलन और आकार के अनुपात में नमूना देकर विचरण को न्यूनतम करता है।" },
  2: { text: "Python की pandas लाइब्रेरी में सर्वे डेटा के समूहबद्ध एकत्रीकरण के लिए कौन-सी विधि उपयोग होती है?", options: ["df.merge()", "df.groupby().agg()", "df.pivot_table()", "df.resample()"], explanation: "groupby().agg() pandas डेटा पाइपलाइन में समूहबद्ध एकत्रीकरण का मानक तरीका है।" },
  3: { text: "GDP डिफ्लेटर किस अनुपात से निकाला जाता है?", options: ["वास्तविक GDP / नाममात्र GDP × 100", "नाममात्र GDP / वास्तविक GDP × 100", "CPI / WPI × 100", "आधार वर्ष GDP / वर्तमान GDP × 100"], explanation: "GDP डिफ्लेटर = (नाममात्र GDP / वास्तविक GDP) × 100।" },
  4: { text: "DPDP अधिनियम 2023 में 'डेटा फिड्यूशरी' कौन है?", options: ["दूसरे की ओर से डेटा संसाधित करने वाला", "प्रसंस्करण का उद्देश्य और साधन निर्धारित करने वाला", "केवल स्टोरेज देने वाला", "ऑडिट करने वाला"], explanation: "डेटा फिड्यूशरी व्यक्तिगत डेटा के प्रसंस्करण का उद्देश्य और साधन निर्धारित करता है।" },
  5: { text: "लासपेयर मूल्य सूचकांक में किस अवधि की कीमत और मात्रा उपयोग होती है?", options: ["वर्तमान कीमत और आधार मात्रा", "आधार कीमत और वर्तमान मात्रा", "आधार कीमत और आधार मात्रा", "वर्तमान कीमत और वर्तमान मात्रा"], explanation: "लासपेयर = (वर्तमान कीमत × आधार मात्रा) / (आधार कीमत × आधार मात्रा) × 100।" },
  6: { text: "आधिकारिक सांख्यिकी में ML मॉडल उपयोग करने से पहले सबसे महत्वपूर्ण अभ्यास क्या है?", options: ["सबसे बड़ा मॉडल चुनना", "सटीकता, पक्षपात, व्याख्येयता और पुनरुत्पादकता जाँचना", "मानव समीक्षा हटाना", "केवल नवीनतम माह पर प्रशिक्षण"], explanation: "आधिकारिक सांख्यिकी को सत्यापित, व्याख्येय और पुनरुत्पादक विधियों तथा मानव निगरानी की आवश्यकता होती है।" },
  7: { text: "सरकारी प्लेटफ़ॉर्मों के बीच पूर्णता रिकॉर्ड भेजने का सबसे सुरक्षित तरीका क्या है?", options: ["सार्वजनिक स्प्रेडशीट", "प्रमाणित, संस्करणयुक्त और एन्क्रिप्टेड API व ऑडिट लॉग", "ईमेल अटैचमेंट", "अनाम वेबहुक"], explanation: "प्रमाणित और संस्करणयुक्त API सुरक्षित इंटरऑपरेबिलिटी और ऑडिट क्षमता देते हैं।" },
  8: { text: "नई सांख्यिकीय डेटा कार्यप्रणाली अपनाने में कौन-सा तरीका सबसे प्रभावी है?", options: ["बिना परामर्श लॉन्च", "परिणाम समझाना, उपयोगकर्ताओं को शामिल करना, प्रशिक्षण और अपनाव मापना", "केवल परिपत्र भेजना", "लॉन्च के बाद प्रतिक्रिया न लेना"], explanation: "स्थायी परिवर्तन के लिए संवाद, भागीदारी, प्रशिक्षण और मापी गई प्रतिक्रिया आवश्यक है।" },
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ subject: string; value: number; payload: { benchmark: number; assessed: number } }>
}

function CustomRadarTooltip({ active, payload, language }: CustomTooltipProps & { language: "en" | "hi" }) {
  const hi = language === "hi"
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-foreground">{payload[0]?.subject}</p>
      <p className="text-muted-foreground">{hi ? "आवश्यक" : "Required"}: <span className="text-primary font-medium">{hi ? "स्तर" : "Level"} {d?.benchmark}</span></p>
      <p className="text-muted-foreground">{hi ? "वर्तमान" : "Current"}: <span className="text-emerald-600 font-medium">{hi ? "स्तर" : "Level"} {d?.assessed}</span></p>
      <p className="text-muted-foreground">{hi ? "अंतर" : "Gap"}: <span className={`font-medium ${(d?.benchmark ?? 0) > (d?.assessed ?? 0) ? "text-rose-600" : "text-emerald-600"}`}>
        {Math.max(0, (d?.benchmark ?? 0) - (d?.assessed ?? 0))} {hi ? "स्तर" : "levels"}
      </span></p>
    </div>
  )
}

export default function ModuleA({ competencies, onDiagnosticComplete, language }: ModuleAProps) {
  const hi = language === "hi"
  const [diagnosticOpen, setDiagnosticOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profile, setProfile] = useState(officerProfile)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [answerRevealed, setAnswerRevealed] = useState(false)

  const radarData = competencies.map((c) => ({
    subject: c.shortName,
    benchmark: c.requiredLevel,
    assessed: c.currentLevel,
    fullMark: 5,
  }))

  const handleNext = () => {
    if (selectedAnswer === "") return
    if (!answerRevealed) {
      setAnswerRevealed(true)
      return
    }
    const newAnswers = { ...answers, [currentStep]: parseInt(selectedAnswer) }
    setAnswers(newAnswers)
    setSelectedAnswer("")
    setAnswerRevealed(false)
    if (currentStep < diagnosticQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Calculate scores
      const scores: Record<string, number> = {}
      diagnosticQuestions.forEach((q, i) => {
        const correct = newAnswers[i] === q.correctIndex
        const pct = correct ? 100 : 45
        scores[q.competency] = pct
      })
      setDiagnosticOpen(false)
      setCurrentStep(0)
      setAnswers({})
      onDiagnosticComplete(scores)
      toast.success("Diagnostic Complete: Competency Graph Updated!", {
        description: "Your Skill Passport has been recalculated based on evidence scores.",
        duration: 5000,
      })
    }
  }

  const progress = ((currentStep + 1) / diagnosticQuestions.length) * 100
  const currentQBase = diagnosticQuestions[currentStep]
  const currentQ = language === "hi" && currentQBase
    ? { ...currentQBase, ...diagnosticHindi[currentQBase.id] }
    : currentQBase

  return (
    <div className="space-y-6">
      {/* Officer Profile Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <div className="h-1 bg-primary" />
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                  {profile.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
                    Cadre: {profile.cadre}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{profile.designation}</p>
                <p className="text-xs text-muted-foreground">{profile.division}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setDiagnosticOpen(true)}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <ClipboardList className="size-4" />
                {hi ? "दक्षता मूल्यांकन शुरू करें" : "Take Diagnostic Assessment"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">~12 {hi ? "मिनट" : "min"} · {diagnosticQuestions.length} {hi ? "प्रश्न" : "questions"}</p>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setProfileOpen(true)}>
                <Pencil className="size-3.5" /> {hi ? "प्रोफ़ाइल संकेत संपादित करें" : "Edit profile signals"}
              </Button>
              <Badge variant="outline" className="justify-center text-xs">
                AI {hi ? "प्रोफ़ाइल" : "profile"} · {profile.profileCompleteness}% {hi ? "पूर्ण" : "complete"}
              </Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border/60 pt-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: hi ? "विभाग" : "Department", value: "MoSPI" },
              { label: hi ? "प्रभाग" : "Division", value: "FOD" },
              { label: hi ? "पदनाम" : "Designation", value: "JSO" },
              { label: hi ? "योग्यता" : "Qualification", value: profile.qualification },
              { label: hi ? "अनुभव" : "Experience", value: profile.experience },
              { label: hi ? "पिछला प्रशिक्षण" : "Previous training", value: `${profile.previousTrainings} ${hi ? "कार्यक्रम" : "programmes"}` },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart + Skill Passport */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Radar Chart */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Target className="size-4 text-primary" />
              {hi ? "दक्षता रडार" : "Competency Radar"}
            </CardTitle>
            <CardDescription>{hi ? "मानक बनाम आकलित स्तर" : "Benchmark vs Assessed Levels"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <Radar
                    name="Required Level"
                    dataKey="benchmark"
                    stroke="oklch(0.46 0.22 264)"
                    fill="oklch(0.46 0.22 264)"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Current Level"
                    dataKey="assessed"
                    stroke="oklch(0.55 0.18 162)"
                    fill="oklch(0.55 0.18 162)"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomRadarTooltip language={language} />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-3 rounded-sm bg-primary/30 border border-primary" />
                {hi ? "आवश्यक स्तर" : "Required Level"}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-3 rounded-sm bg-emerald-500/30 border border-emerald-500" />
                {hi ? "वर्तमान स्तर" : "Current Level"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Passport Table */}
        <Card className="lg:col-span-3 border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BadgeCheck className="size-4 text-primary" />
              {hi ? "साक्ष्य-आधारित स्किल पासपोर्ट" : "Evidence-Backed Skill Passport"}
            </CardTitle>
            <CardDescription>{hi ? "साक्ष्य रिकॉर्ड सहित सत्यापित दक्षता स्तर" : "Verified competency levels with evidence trail"}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-semibold pl-4">{hi ? "दक्षता" : "Competency"}</TableHead>
                    <TableHead className="text-xs font-semibold">{hi ? "वर्तमान" : "Current"}</TableHead>
                    <TableHead className="text-xs font-semibold">{hi ? "आवश्यक" : "Required"}</TableHead>
                    <TableHead className="text-xs font-semibold hidden md:table-cell">{hi ? "सत्यापन" : "Verification"}</TableHead>
                    <TableHead className="text-xs font-semibold">{hi ? "विश्वास" : "Confidence"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competencies.map((comp) => (
                    <TableRow key={comp.id} className="hover:bg-muted/30">
                      <TableCell className="pl-4">
                        <div>
                          <p className="text-xs font-medium text-foreground">{comp.shortName}</p>
                          <p className="hidden text-xs text-muted-foreground sm:block">{comp.domain} · {comp.lastAssessed}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${levelVariant(comp.currentLevel)}`}>
                          L{comp.currentLevel} · {levelLabel(comp.currentLevel, hi)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          L{comp.requiredLevel}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">{comp.verificationSource}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-20">
                          <Progress value={comp.confidenceScore} className="h-1.5 w-14" />
                          <span className="text-xs text-muted-foreground">{comp.confidenceScore}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{hi ? "दक्षता प्रोफ़ाइल संकेत संपादित करें" : "Edit competency profile signals"}</DialogTitle>
            <DialogDescription>
              {hi ? "ये फ़ील्ड दक्षता इंजन द्वारा उपयोग किए जाने वाले HRMS, SSO, कार्य इतिहास और पिछले प्रशिक्षण डेटा को दर्शाते हैं।" : "These fields represent HRMS, SSO, work-history, and prior-learning data used by the competency engine."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: "name", label: hi ? "अधिकारी का नाम" : "Officer name" },
              { key: "designation", label: hi ? "पदनाम / भूमिका" : "Designation / job role" },
              { key: "division", label: hi ? "वर्तमान कार्य" : "Current assignment" },
              { key: "qualification", label: hi ? "शैक्षिक योग्यता" : "Educational qualification" },
              { key: "experience", label: hi ? "प्रासंगिक अनुभव" : "Relevant work experience" },
              { key: "cadre", label: hi ? "सेवा कैडर" : "Service cadre" },
            ].map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={`profile-${field.key}`}>{field.label}</Label>
                <Input
                  id={`profile-${field.key}`}
                  value={String(profile[field.key as keyof typeof profile])}
                  onChange={(event) => setProfile((current) => ({ ...current, [field.key]: event.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">
            Prototype mode stores edits only for this session. Production profiles require consent, field-level authorization, source provenance, and an audit trail.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setProfileOpen(false)}>{hi ? "रद्द करें" : "Cancel"}</Button>
            <Button onClick={() => {
              setProfileOpen(false)
              toast.success("Profile signals updated", { description: "Recommendations will use the revised profile context." })
            }} className="gap-2">
              <Save className="size-4" /> {hi ? "प्रोफ़ाइल सहेजें" : "Save profile"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diagnostic Dialog */}
      <Dialog open={diagnosticOpen} onOpenChange={setDiagnosticOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              {hi ? "प्रारंभिक दक्षता मूल्यांकन" : "Baseline Competency Assessment"}
            </DialogTitle>
            <DialogDescription>
              {hi ? `अपने स्किल पासपोर्ट को अपडेट करने के लिए सभी ${diagnosticQuestions.length} प्रश्नों का उत्तर दें` : `Answer all ${diagnosticQuestions.length} questions to calibrate your Skill Passport`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{hi ? "प्रश्न" : "Question"} {currentStep + 1} {hi ? "/" : "of"} {diagnosticQuestions.length}</span>
                <span className="font-medium text-primary">{Math.round(progress)}% {hi ? "पूर्ण" : "Complete"}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            {currentQ && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted/40 border border-border/60 p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {competencies.find((c) => c.id === currentQ.competency)?.shortName}
                  </Badge>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {currentQ.text}
                  </p>
                </div>

                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={setSelectedAnswer}
                  disabled={answerRevealed}
                  className="space-y-2"
                >
                  {currentQ.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors ${
                        selectedAnswer === String(idx)
                          ? "border-primary/50 bg-primary/5"
                          : "border-border/60 hover:bg-muted/40"
                      }`}
                      onClick={() => setSelectedAnswer(String(idx))}
                    >
                      <RadioGroupItem value={String(idx)} id={`opt-${idx}`} className="mt-0.5" />
                      <Label htmlFor={`opt-${idx}`} className="text-sm cursor-pointer leading-relaxed">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {answerRevealed && (
                  <div className={`rounded-xl border p-4 text-sm ${Number(selectedAnswer) === currentQ.correctIndex ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
                    <p className="font-semibold">
                      {Number(selectedAnswer) === currentQ.correctIndex
                                              ? (hi ? "सही उत्तर" : "Correct answer")
                                              : (hi ? `सही उत्तर: ${currentQ.options[currentQ.correctIndex]}` : `Review: the correct answer is ${currentQ.options[currentQ.correctIndex]}`)}
                    </p>
                    <p className="mt-1 text-xs leading-5 opacity-80">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDiagnosticOpen(false)
                  setCurrentStep(0)
                  setAnswers({})
                  setSelectedAnswer("")
                  setAnswerRevealed(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === ""}
                className="gap-1.5"
              >
                {!answerRevealed
                  ? (hi ? "उत्तर जाँचें" : "Check answer")
                  : currentStep < diagnosticQuestions.length - 1
                    ? (hi ? "आगे बढ़ें →" : "Continue →")
                    : (hi ? "मूल्यांकन जमा करें" : "Submit Assessment")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
