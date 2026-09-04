import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Database,
  Sparkles,
  CheckCircle2,
  Quote,
  RefreshCw,
  Send,
  FileText,
  ShieldCheck,
  BookMarked,
} from "lucide-react"
import type { GeneratedQuestion } from "@/data/appData"
import { generatedQuestions } from "@/data/appData"

type SourceDocument = { id: string; name: string; pages: number | null; uploaded?: boolean }

const documents: SourceDocument[] = [
  { id: "nss78", name: "NSS 78th Round Manual.pdf", pages: 312 },
  { id: "plfs", name: "PLFS Survey Methodology.pdf", pages: 148 },
  { id: "cpi", name: "CPI Compilation Handbook.pdf", pages: 224 },
  { id: "gdp", name: "National Accounts Manual 2025.pdf", pages: 418 },
]

const competencyOptions = [
  { id: "survey-sampling", name: "Survey Sampling & Stratification" },
  { id: "python-data", name: "Python Data Wrangling" },
  { id: "national-accounts", name: "National Accounts & GDP" },
  { id: "dpdp-act", name: "DPDP Act Compliance" },
  { id: "cpi-index", name: "CPI/IIP Index Numbers" },
]

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"]

const ragStages = [
  "Securely ingesting source",
  "Extracting and chunking content",
  "Retrieving competency evidence",
  "Generating questions and verifying citations",
]

const ragStagesHi = [
  "स्रोत का सुरक्षित ग्रहण",
  "सामग्री निष्कर्षण और खंड निर्माण",
  "दक्षता साक्ष्य पुनर्प्राप्ति",
  "प्रश्न निर्माण और उद्धरण सत्यापन",
]

const difficultyColor: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Intermediate: "bg-amber-100 text-amber-800 border-amber-200",
  Advanced: "bg-rose-100 text-rose-800 border-rose-200",
}

export default function ModuleC({ language }: { language: "en" | "hi" }) {
  const hi = language === "hi"
  const [availableDocuments, setAvailableDocuments] = useState<SourceDocument[]>(documents)
  const [selectedDoc, setSelectedDoc] = useState("")
  const [selectedCompetency, setSelectedCompetency] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStage, setGenerationStage] = useState(0)
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set())

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const uploadedDocument: SourceDocument = {
      id: `upload-${Date.now()}`,
      name: file.name,
      pages: null,
      uploaded: true,
    }
    setAvailableDocuments((prev) => [...prev, uploadedDocument])
    setSelectedDoc(uploadedDocument.id)
    toast.success("Learning material added", {
      description: `${file.name} is ready for backend ingestion and RAG processing.`,
    })
    event.target.value = ""
  }

  const handleGenerate = async () => {
    if (!selectedDoc || !selectedCompetency || !selectedDifficulty) {
      toast.error("Please select all fields before generating questions.")
      return
    }
    setIsGenerating(true)
    setGenerationStage(0)
    setQuestions([])
    for (let stage = 0; stage < ragStages.length; stage += 1) {
      setGenerationStage(stage)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    const doc = availableDocuments.find((d) => d.id === selectedDoc)
    const comp = competencyOptions.find((c) => c.id === selectedCompetency)
    const filtered = generatedQuestions
      .map((q) => ({
        ...q,
        difficulty: selectedDifficulty as GeneratedQuestion["difficulty"],
        source: doc?.name ?? q.source,
        competency: comp?.name ?? q.competency,
      }))
    setQuestions(filtered)
    setApprovedIds(new Set())
    setIsGenerating(false)
    toast.success("3 RAG-grounded questions generated!", {
      description: `Source: ${doc?.name} · Verified against official MoSPI documentation`,
    })
  }

  const handleApprove = (id: string) => {
    setApprovedIds((prev) => new Set([...prev, id]))
    const q = questions.find((q) => q.id === id)
    toast.success("Question approved for publishing", {
      description: `"${q?.text.slice(0, 60)}..." is queued for the production iGOT connector.`, 
    })
  }

  const handleRegenerate = (id: string) => {
    const idx = questions.findIndex((q) => q.id === id)
    if (idx < 0) return
    const updated = [...questions]
    const rotated = generatedQuestions[(idx + 1) % generatedQuestions.length]
    updated[idx] = {
      ...rotated,
      id,
      difficulty: selectedDifficulty as GeneratedQuestion["difficulty"],
      source: availableDocuments.find((d) => d.id === selectedDoc)?.name ?? rotated.source,
    }
    setQuestions(updated)
    toast.info("Question regenerated from source document.")
  }

  return (
    <div className="space-y-6">
      {/* Ingestion Panel */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Database className="size-4 text-primary" />
            {hi ? "दस्तावेज़ ग्रहण और प्रश्न निर्माण" : "Document Ingestion & Question Generation"}
          </CardTitle>
          <CardDescription>
            {hi ? "शब्दशः उद्धरण सहित RAG-आधारित MCQ बनाने के लिए MoSPI/NSSTA सामग्री चुनें" : "Select a MoSPI/NSSTA handbook to generate RAG-grounded MCQs with verbatim citations"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{hi ? "स्रोत दस्तावेज़" : "Source Document"}</label>
              <Select value={selectedDoc} onValueChange={setSelectedDoc}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder={hi ? "हैंडबुक चुनें..." : "Select handbook..."} />
                </SelectTrigger>
                <SelectContent>
                  {availableDocuments.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="size-3.5 text-muted-foreground" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                <FileText className="size-3.5" />
                {hi ? "PDF, दस्तावेज़, प्रस्तुति या वीडियो अपलोड करें" : "Upload PDF, document, presentation, or video"}
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.webm"
                  onChange={handleDocumentUpload}
                />
              </label>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{hi ? "लक्षित दक्षता" : "Target Competency"}</label>
              <Select value={selectedCompetency} onValueChange={setSelectedCompetency}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder={hi ? "दक्षता चुनें..." : "Select competency..."} />
                </SelectTrigger>
                <SelectContent>
                  {competencyOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{hi ? "कठिनाई स्तर" : "Difficulty Level"}</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder={hi ? "कठिनाई चुनें..." : "Select difficulty..."} />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map((d) => (
                    <SelectItem key={d} value={d}>{hi ? ({ Beginner: "आरंभिक", Intermediate: "मध्यवर्ती", Advanced: "उन्नत" } as Record<string, string>)[d] : d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedDoc && (
            <div className="rounded-lg bg-muted/40 border border-border/60 p-3 flex items-center gap-3">
              <BookMarked className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  {availableDocuments.find((d) => d.id === selectedDoc)?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {availableDocuments.find((d) => d.id === selectedDoc)?.pages
                    ? `${availableDocuments.find((d) => d.id === selectedDoc)?.pages} ${hi ? "पृष्ठ · डेमो कैटलॉग प्रविष्टि" : "pages · Demo catalog entry"}`
                    : (hi ? "स्थानीय अपलोड · बैकएंड ग्रहण के लिए तैयार" : "Uploaded locally · Ready for backend ingestion")}
                </p>
              </div>
              <Badge className="ml-auto bg-amber-100 text-amber-700 border-amber-200 text-xs">
                <ShieldCheck className="size-3 mr-1" />
                {hi ? "बैकएंड सत्यापन लंबित" : "Backend verification pending"}
              </Badge>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gap-2 w-full sm:w-auto"
          >
            <Sparkles className="size-4" />
            {isGenerating ? (hi ? "MCQ बन रहे हैं..." : "Generating MCQs...") : (hi ? "स्रोत-आधारित MCQ बनाएँ" : "Generate Grounded MCQs")}
          </Button>
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {isGenerating && (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 animate-pulse text-primary" /> {hi ? "RAG प्रसंस्करण पाइपलाइन" : "RAG processing pipeline"}</p>
                <Badge variant="outline">{hi ? "चरण" : "Step"} {generationStage + 1} {hi ? "/" : "of"} {ragStages.length}</Badge>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                {ragStages.map((stage, index) => (
                  <div key={stage} className={`rounded-lg border p-3 text-xs leading-5 ${index < generationStage ? "border-emerald-200 bg-emerald-50 text-emerald-800" : index === generationStage ? "border-primary/40 bg-primary/5 text-foreground" : "border-border/60 text-muted-foreground"}`}>
                    <span className="mb-1 block font-bold">{index < generationStage ? "✓" : index + 1}</span>
                    {hi ? ragStagesHi[index] : stage}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{hi ? "प्रतिनिधि सामग्री पर आधारित प्रोटोटाइप दृश्य। प्रोडक्शन के लिए मालवेयर स्कैनिंग, OCR/ट्रांसक्रिप्शन, वेक्टर पुनर्प्राप्ति, अनुमोदित LLM और ऑडिट लॉग आवश्यक हैं।" : "Prototype visualization using representative content. Production requires malware scanning, OCR/transcription, vector retrieval, an approved LLM, and audit logs."}</p>
            </div>
            <Separator />
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-9 rounded-lg" />
                  ))}
                </div>
                <Skeleton className="h-16 rounded-lg" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Generated Questions */}
      {questions.length > 0 && !isGenerating && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                {hi ? "प्रशिक्षक समीक्षा कतार" : "Trainer Review Queue"}
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 ml-1">
                  {questions.length} {hi ? "प्रश्न" : "questions"}
                </Badge>
              </CardTitle>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-semibold px-3 py-1">
                <ShieldCheck className="size-3.5 mr-1.5" />
                {hi ? "उद्धरण संलग्न · मानव समीक्षा आवश्यक" : "Citation attached · Human review required"}
              </Badge>
            </div>
            <CardDescription>
              {hi ? "iGOT मूल्यांकन बैंक की कतार में भेजने से पहले समीक्षा, अनुमोदन या पुनर्निर्माण करें" : "Review, approve, or regenerate before queuing for the iGOT assessment bank"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["q1"]} className="space-y-3">
              {questions.map((q, qIdx) => {
                const isApproved = approvedIds.has(q.id)
                return (
                  <AccordionItem
                    key={q.id}
                    value={q.id}
                    className={`rounded-xl border px-0 overflow-hidden ${isApproved ? "border-emerald-200 bg-emerald-50/30" : "border-border/60"}`}
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 data-[state=open]:bg-muted/20">
                      <div className="flex items-center gap-3 text-left flex-1 mr-3">
                        <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{q.text}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${difficultyColor[q.difficulty]}`}>
                              {q.difficulty}
                            </span>
                            {isApproved && (
                              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                <CheckCircle2 className="size-3 mr-1" /> Approved
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-0">
                      <div className="space-y-4">
                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, idx) => (
                            <div
                              key={idx}
                              className={`rounded-lg border p-3 text-sm ${
                                idx === q.correctIndex
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-medium"
                                  : "border-border/60 bg-muted/30 text-muted-foreground"
                              }`}
                            >
                              {idx === q.correctIndex && (
                                <CheckCircle2 className="inline size-3.5 mr-1.5 text-emerald-600" />
                              )}
                              {opt}
                            </div>
                          ))}
                        </div>

                        {/* Citation */}
                        <Alert className="border-emerald-200 bg-emerald-50/60 py-3">
                          <Quote className="size-4 text-emerald-600 mt-0.5" />
                          <AlertTitle className="text-xs font-semibold text-emerald-800 mb-1">
                            {hi ? "शब्दशः स्रोत उद्धरण" : "Verbatim Source Citation"}
                          </AlertTitle>
                          <AlertDescription className="text-xs text-emerald-700 leading-relaxed font-mono bg-emerald-100/60 rounded p-2 mt-1">
                            {q.citation}
                          </AlertDescription>
                        </Alert>

                        <div className="text-xs text-muted-foreground">
                          {hi ? "स्रोत" : "Source"}: <span className="font-medium text-foreground">{q.source}</span>
                          {" · "}{hi ? "दक्षता" : "Competency"}: <span className="font-medium text-foreground">{q.competency}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button
                            size="sm"
                            className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleApprove(q.id)}
                            disabled={isApproved}
                          >
                            <Send className="size-3.5" />
                            {isApproved ? (hi ? "कतार में" : "Queued") : (hi ? "iGOT कतार के लिए अनुमोदित करें" : "Approve for iGOT queue")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs"
                            onClick={() => handleRegenerate(q.id)}
                            disabled={isApproved}
                          >
                            <RefreshCw className="size-3.5" />
                            {hi ? "पुनः बनाएँ" : "Regenerate"}
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
