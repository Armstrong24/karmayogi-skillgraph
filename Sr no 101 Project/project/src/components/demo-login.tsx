import { useState } from "react"
import { BarChart3, GraduationCap, Landmark, Languages, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Role } from "@/data/appData"

interface DemoLoginProps {
  onLogin: (role: Role) => void
  language: "en" | "hi"
  onLanguageChange: () => void
}

const roles: Array<{
  id: Role
  title: string
  subtitle: string
  description: string
  icon: typeof GraduationCap
}> = [
  {
    id: "learner",
    title: "Statistical Officer",
    subtitle: "Learner workspace",
    description: "Assess competencies, follow a personalized pathway, and track your Skill Passport.",
    icon: GraduationCap,
  },
  {
    id: "trainer",
    title: "NSSTA Assessment Lead",
    subtitle: "Trainer workspace",
    description: "Turn approved learning material into grounded assessments with human review.",
    icon: BarChart3,
  },
  {
    id: "admin",
    title: "Ministry Administrator",
    subtitle: "Workforce workspace",
    description: "Monitor capacity, identify critical gaps, and plan targeted training cohorts.",
    icon: Landmark,
  },
]

export function DemoLogin({ onLogin, language, onLanguageChange }: DemoLoginProps) {
  const [selectedRole, setSelectedRole] = useState<Role>("learner")
  const hi = language === "hi"
  const localizedRoles = roles.map((role) => ({
    ...role,
    title: hi ? ({ learner: "सांख्यिकी अधिकारी", trainer: "NSSTA मूल्यांकन प्रमुख", admin: "मंत्रालय प्रशासक" } as const)[role.id] : role.title,
    subtitle: hi ? ({ learner: "शिक्षार्थी कार्यक्षेत्र", trainer: "प्रशिक्षक कार्यक्षेत्र", admin: "कार्यबल कार्यक्षेत्र" } as const)[role.id] : role.subtitle,
    description: hi ? ({
      learner: "दक्षताओं का आकलन करें, व्यक्तिगत शिक्षण मार्ग अपनाएँ और अपना स्किल पासपोर्ट देखें।",
      trainer: "मान्य शिक्षण सामग्री से मानव समीक्षा सहित स्रोत-आधारित मूल्यांकन बनाएँ।",
      admin: "क्षमता की निगरानी करें, महत्वपूर्ण अंतर पहचानें और लक्षित प्रशिक्षण समूह बनाएँ।",
    } as const)[role.id] : role.description,
  }))

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-4 py-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-1 bg-primary" />
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="size-5" />
          </div>
          <div className="mb-3 flex items-center justify-center gap-2">
            <Badge variant="outline">SIH 2026 · PS-26101 · MoSPI DIID</Badge>
            <Button variant="outline" size="sm" onClick={onLanguageChange} className="gap-1.5">
              <Languages className="size-3.5" /> {hi ? "English" : "हिंदी"}
            </Button>
          </div>
          <h1 className="text-balance text-4xl font-medium tracking-tight sm:text-5xl">Karmayogi SkillGraph</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {hi ? "भारत की आधिकारिक सांख्यिकी प्रणाली के लिए AI-सक्षम दक्षता विश्लेषण और व्यक्तिगत क्षमता निर्माण।" : "AI-enabled competency intelligence and personalized capacity building for India&apos;s Official Statistical System."}
          </p>
        </div>

        <Card className="overflow-hidden border-border/70 bg-card/90">
          <CardContent className="p-5 sm:p-7">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">{hi ? "प्रदर्शन कार्यक्षेत्र चुनें" : "Choose a demonstration workspace"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{hi ? "सिम्युलेटेड सरकारी SSO · किसी क्रेडेंशियल या व्यक्तिगत डेटा की आवश्यकता नहीं" : "Simulated Government SSO · No credentials or personal data required"}</p>
              </div>
              <Badge className="w-fit border-emerald-200 bg-emerald-100 text-emerald-800">
                <ShieldCheck className="mr-1 size-3.5" /> {hi ? "सुरक्षित डेमो मोड" : "Secure demo mode"}
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {localizedRoles.map((role) => {
                const Icon = role.icon
                const selected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`rounded-2xl border p-5 text-left transition-all ${
                      selected
                        ? "border-primary/50 bg-primary/5 ring-2 ring-primary/15"
                        : "border-border/70 bg-background/60 hover:border-primary/30 hover:bg-card"
                    }`}
                    aria-pressed={selected}
                  >
                    <span className={`grid size-10 place-items-center rounded-xl ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="size-5" />
                    </span>
                    <span className="mt-4 block text-sm font-semibold">{role.title}</span>
                    <span className="mt-1 block text-xs font-medium text-primary">{role.subtitle}</span>
                    <span className="mt-3 block text-xs leading-5 text-muted-foreground">{role.description}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <LockKeyhole className="size-3.5" /> {hi ? "प्रोडक्शन परिनियोजन अनुमोदित SSO और RBAC से जुड़ेगा।" : "Production deployment connects approved SSO and RBAC."}
              </p>
              <Button onClick={() => onLogin(selectedRole)} className="gap-2">
                {hi ? "डेमो SSO से आगे बढ़ें" : "Continue with demo SSO"}
                <ShieldCheck className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
