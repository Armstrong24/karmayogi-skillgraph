import { Braces, Cloud, Database, KeyRound, LockKeyhole, Network, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const architecture = [
  { title: "Experience layer", detail: "Responsive learner, trainer, and administrator workspaces", icon: Network },
  { title: "API gateway", detail: "Authenticated, versioned connectors for iGOT, NSSTA, SSO, and analytics", icon: Braces },
  { title: "Skill intelligence", detail: "Competency mapping, evidence weighting, recommendations, and explainability", icon: Database },
  { title: "AI assessment", detail: "Secure ingestion, OCR/transcription, retrieval, approved LLM, and human review", icon: Cloud },
]

const controls = [
  "Government SSO with role-based access control",
  "Encryption in transit and at rest",
  "Consent, purpose limitation, retention, and DPDP controls",
  "Malware scanning and isolated content processing",
  "Prompt, retrieval, approval, and score audit trails",
  "Model evaluation, citation checks, bias testing, and human override",
]

export function TrustArchitecture({ language }: { language: "en" | "hi" }) {
  const hi = language === "hi"
  const localizedArchitecture = hi ? architecture.map((item, index) => ({
    ...item,
    title: ["अनुभव परत", "API गेटवे", "कौशल इंटेलिजेंस", "AI मूल्यांकन"][index],
    detail: [
      "शिक्षार्थी, प्रशिक्षक और प्रशासक के लिए उत्तरदायी कार्यक्षेत्र",
      "iGOT, NSSTA, SSO और विश्लेषण के प्रमाणित व संस्करणयुक्त कनेक्टर",
      "दक्षता मैपिंग, साक्ष्य भार, अनुशंसाएँ और व्याख्येयता",
      "सुरक्षित ग्रहण, OCR/ट्रांसक्रिप्शन, पुनर्प्राप्ति, अनुमोदित LLM और मानव समीक्षा",
    ][index],
  })) : architecture
  const localizedControls = hi ? [
    "भूमिका-आधारित अभिगम सहित सरकारी SSO",
    "संचरण और संग्रहण में एन्क्रिप्शन",
    "सहमति, उद्देश्य सीमा, प्रतिधारण और DPDP नियंत्रण",
    "मालवेयर स्कैनिंग और पृथक सामग्री प्रसंस्करण",
    "प्रॉम्प्ट, पुनर्प्राप्ति, अनुमोदन और स्कोर ऑडिट रिकॉर्ड",
    "मॉडल मूल्यांकन, उद्धरण जाँच, पक्षपात परीक्षण और मानव ओवरराइड",
  ] : controls
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hidden gap-2 md:inline-flex">
          <ShieldCheck className="size-3.5" /> {hi ? "वास्तुकला और भरोसा" : "Architecture & trust"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88svh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{hi ? "प्रोडक्शन वास्तुकला और भरोसा मॉडल" : "Production architecture and trust model"}</DialogTitle>
            <Badge variant="outline">{hi ? "रूपरेखा" : "Blueprint"}</Badge>
          </div>
          <DialogDescription>
            {hi ? "वर्तमान ऐप एक फ्रंटएंड प्रोटोटाइप है। यह रूपरेखा बताती है कि इसे सुरक्षित और इंटरऑपरेबल सरकारी प्लेटफ़ॉर्म कैसे बनाया जाएगा।" : "The current app is a frontend prototype. This blueprint shows how it becomes a secure, interoperable government platform."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="architecture">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="architecture">{hi ? "वास्तुकला" : "Architecture"}</TabsTrigger>
            <TabsTrigger value="security">{hi ? "सुरक्षा" : "Security"}</TabsTrigger>
            <TabsTrigger value="integration">{hi ? "एकीकरण" : "Integration"}</TabsTrigger>
          </TabsList>
          <TabsContent value="architecture" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {localizedArchitecture.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex gap-3 rounded-xl border border-border/70 bg-muted/20 p-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span>
                    <div>
                      <p className="text-xs font-medium text-primary">{hi ? "परत" : "Layer"} {index + 1}</p>
                      <p className="mt-0.5 text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
          <TabsContent value="security" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {localizedControls.map((control) => (
                <div key={control} className="flex items-start gap-3 rounded-xl border border-border/70 p-4 text-sm">
                  <LockKeyhole className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  {control}
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="integration" className="mt-4">
            <div className="space-y-3">
              {(hi ? [
                ["iGOT Karmayogi", "कोर्स कैटलॉग, डीप लिंक, नामांकन, प्रगति, पूर्णता और दक्षता साक्ष्य"],
                ["NSSTA TPAC", "अनुशंसित प्रशिक्षण कार्यक्रम, समय-सारणी, नामांकन और पूर्णता परिणाम"],
                ["सरकारी SSO", "पहचान, पदनाम, विभाग, भूमिका दावे और अभिगम नीति"],
                ["MoSPI प्रणालियाँ", "दक्षता ढाँचे, HR प्रोफ़ाइल संकेत, कार्यबल विश्लेषण और रिपोर्टिंग"],
              ] : [
                ["iGOT Karmayogi", "Course catalogue, deep links, enrolment, progress, completion, and competency evidence"],
                ["NSSTA TPAC", "Recommended training programmes, schedules, nominations, and completion outcomes"],
                ["Government SSO", "Identity, designation, department, role claims, and access policy"],
                ["MoSPI systems", "Competency frameworks, HR profile signals, workforce analytics, and reporting"],
              ]).map(([name, detail]) => (
                <div key={name} className="flex flex-col gap-1 rounded-xl border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold"><KeyRound className="size-4 text-primary" />{name}</span>
                  <span className="max-w-xl text-xs leading-5 text-muted-foreground">{detail}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
