import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { Bot, Send, Sparkles, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Competency, Role } from "@/data/appData"

type Message = {
  id: number
  from: "assistant" | "user"
  text: string
}

interface AiLearningAssistantProps {
  role: Role
  competencies: Competency[]
  language: "en" | "hi"
}

const roleWelcome: Record<Role, string> = {
  learner: "I can explain your competency gaps, suggest the next course, or help you prepare for an assessment.",
  trainer: "I can help draft grounded assessment prompts, review question quality, or plan a training cohort.",
  admin: "I can summarize workforce risks, explain the heatmap, or suggest a capacity-building intervention.",
}

const roleWelcomeHi: Record<Role, string> = {
  learner: "मैं आपके दक्षता अंतर समझा सकता हूँ, अगला कोर्स सुझा सकता हूँ या मूल्यांकन की तैयारी में मदद कर सकता हूँ।",
  trainer: "मैं स्रोत-आधारित प्रश्न तैयार करने, MCQ गुणवत्ता जाँचने या प्रशिक्षण समूह की योजना बनाने में मदद कर सकता हूँ।",
  admin: "मैं कार्यबल जोखिम, हीटमैप और क्षमता निर्माण प्राथमिकताओं का सार बता सकता हूँ।",
}

const quickPrompts: Record<Role, string[]> = {
  learner: ["What should I learn next?", "Explain my biggest skill gap", "Prepare me for an assessment"],
  trainer: ["How do I create a grounded quiz?", "Check MCQ quality", "Plan an assessment"],
  admin: ["Summarize critical risks", "What training should we prioritize?", "Explain the forecast"],
}

const quickPromptsHi: Record<Role, string[]> = {
  learner: ["मुझे आगे क्या सीखना चाहिए?", "मेरा सबसे बड़ा कौशल अंतर समझाएँ", "मूल्यांकन की तैयारी कराएँ"],
  trainer: ["स्रोत-आधारित क्विज़ कैसे बनाएँ?", "MCQ गुणवत्ता जाँचें", "मूल्यांकन की योजना बनाएँ"],
  admin: ["महत्वपूर्ण जोखिमों का सार दें", "कौन सा प्रशिक्षण प्राथमिक है?", "पूर्वानुमान समझाएँ"],
}

function getAssistantReply(prompt: string, role: Role, competencies: Competency[], language: "en" | "hi") {
  const normalized = prompt.toLowerCase()
  const largestGap = [...competencies].sort(
    (a, b) => b.requiredLevel - b.currentLevel - (a.requiredLevel - a.currentLevel)
  )[0]
  const gap = largestGap ? largestGap.requiredLevel - largestGap.currentLevel : 0

  if (language === "hi") {
    if (role === "trainer") return "आधिकारिक स्रोत चुनें, दक्षता और कठिनाई निर्धारित करें, फिर RAG पाइपलाइन चलाएँ। हर प्रश्न के उत्तर और उद्धरण की मानव समीक्षा आवश्यक है।"
    if (role === "admin") return largestGap ? `वर्तमान डेटा में ${largestGap.name} सबसे महत्वपूर्ण अंतर है। लक्षित प्रशिक्षण समूह बनाएँ और पूर्व/पश्चात मूल्यांकन से प्रभाव मापें।` : roleWelcomeHi.admin
    return largestGap ? `आपकी प्राथमिकता ${largestGap.name} है। वर्तमान स्तर ${largestGap.currentLevel} और आवश्यक स्तर ${largestGap.requiredLevel} है। शिक्षण मार्ग में पहला अनुशंसित मॉड्यूल शुरू करें।` : roleWelcomeHi.learner
  }

  if (/अगला|कोर्स/.test(prompt)) {
    return largestGap
      ? `आपके लिए अगला प्राथमिक विषय ${largestGap.name} है। आपका वर्तमान स्तर ${largestGap.currentLevel} है और भूमिका के लिए स्तर ${largestGap.requiredLevel} चाहिए। Learning Pathway में सबसे पहले अनुशंसित मॉड्यूल शुरू करें।`
      : "आपकी प्रोफ़ाइल में अभी कोई महत्वपूर्ण कौशल अंतर नहीं दिख रहा है।"
  }

  if (normalized.includes("next") || normalized.includes("priorit")) {
    return largestGap
      ? `Prioritize ${largestGap.name}. It has a ${gap}-level gap for your current role. Start with the first recommended pathway module, then complete its assessment so your Skill Passport updates.`
      : "Your current competencies meet the mapped role benchmark. Consider an emerging-technology elective next."
  }

  if (normalized.includes("gap") || normalized.includes("risk")) {
    return largestGap
      ? `${largestGap.name} is the strongest current signal: Level ${largestGap.currentLevel} against a required Level ${largestGap.requiredLevel}, with ${largestGap.confidenceScore}% evidence confidence. This is a prototype recommendation based on the displayed profile and assessment data.`
      : "No critical gap is currently detected."
  }

  if (normalized.includes("quiz") || normalized.includes("mcq") || normalized.includes("assessment")) {
    return role === "trainer"
      ? "Select an official source, competency, and difficulty in the Assessment Generator. Generated items include an answer and citation for trainer review. In production, document parsing, retrieval, and LLM generation must be handled by a secured RAG backend."
      : "Use the diagnostic or end-of-module quiz to collect fresh evidence. Results update competency levels and recommendation priority in this prototype."
  }

  if (normalized.includes("forecast") || normalized.includes("heatmap")) {
    return "The admin view combines departmental gaps with an emerging-skills forecast. Use critical cells to identify affected officers, then create a targeted training batch. Forecast values are representative prototype data, not a production ML prediction."
  }

  return roleWelcome[role]
}

export function AiLearningAssistant({ role, competencies, language }: AiLearningAssistantProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const welcome = language === "hi" ? roleWelcomeHi[role] : roleWelcome[role]
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "assistant", text: welcome },
  ])
  const prompts = useMemo(() => language === "hi" ? quickPromptsHi[role] : quickPrompts[role], [language, role])

  useEffect(() => {
    setMessages([{ id: Date.now(), from: "assistant", text: welcome }])
  }, [welcome])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  const sendMessage = (text: string) => {
    const prompt = text.trim()
    if (!prompt) return
    setMessages((current) => [
      ...current,
      { id: Date.now(), from: "user", text: prompt },
      { id: Date.now() + 1, from: "assistant", text: getAssistantReply(prompt, role, competencies, language) },
    ])
    setInput("")
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    sendMessage(input)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed right-4 bottom-4 z-40 h-11 gap-2 rounded-full px-4 shadow-lg shadow-primary/20 sm:right-6 sm:bottom-6">
          <Sparkles className="size-4" />
          <span className="hidden sm:inline">{language === "hi" ? "SkillGraph AI से पूछें" : "Ask SkillGraph AI"}</span>
          <span className="sm:hidden">{language === "hi" ? "AI से पूछें" : "Ask AI"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full border-border/70 bg-background/95 p-0 backdrop-blur-xl sm:max-w-md">
        <SheetHeader className="shrink-0 border-b border-border/70 p-5 pr-12">
          <div className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Bot className="size-4" />
            </div>
            <div>
              <SheetTitle>SkillGraph AI</SheetTitle>
              <Badge variant="outline" className="mt-1 text-[10px]">{language === "hi" ? "प्रोटोटाइप सहायक" : "Prototype assistant"}</Badge>
            </div>
          </div>
          <SheetDescription>
            {language === "hi" ? "इस डेमो में दिखाए गए दक्षता डेटा पर आधारित भूमिका-अनुकूल मार्गदर्शन।" : "Role-aware guidance using the competency data shown in this demo."}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">
          <div className="space-y-4 py-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2.5 ${message.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.from === "assistant" && (
                  <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                    message.from === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md border border-border/70 bg-card"
                  }`}
                >
                  {message.text}
                </div>
                {message.from === "user" && (
                  <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <UserRound className="size-3.5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
        </div>

        <div className="shrink-0 border-t border-border/70 bg-card/60 p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-border/80 bg-background px-2.5 py-1 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={language === "hi" ? "कौशल या सीखने के बारे में पूछें…" : "Ask about skills or learning…"}
              aria-label="Message SkillGraph AI"
              className="h-10 bg-background"
            />
            <Button type="submit" size="icon" className="size-10" disabled={!input.trim()}>
              <Send className="size-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
          <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
            {language === "hi" ? "केवल डेमो उत्तर। प्रोडक्शन के लिए अनुमोदित LLM, RAG, गोपनीयता और ऑडिट नियंत्रण आवश्यक हैं।" : "Demo responses only. Production requires approved LLM, RAG, privacy, and audit controls."}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
