import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Users,
  TrendingDown,
  Award,
  BarChart3,
  Download,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  BrainCircuit,
  CloudCog,
  ShieldCheck,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts"
import { departmentData, heatmapOfficers } from "@/data/appData"

const competencyKeys = ["Survey Sampling", "Python/R", "GDP Estimation", "DPDP Compliance", "Index Numbers"]

type HeatStatus = "proficient" | "moderate" | "critical"

const statusConfig: Record<HeatStatus, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  proficient: {
    bg: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    text: "text-emerald-700",
    label: "Proficient",
    icon: <CheckCircle2 className="size-3.5" />,
  },
  moderate: {
    bg: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    text: "text-amber-700",
    label: "Moderate Gap",
    icon: <AlertCircle className="size-3.5" />,
  },
  critical: {
    bg: "bg-rose-100 text-rose-800 hover:bg-rose-200",
    text: "text-rose-700",
    label: "Critical Deficit",
    icon: <TrendingDown className="size-3.5" />,
  },
}

const chartData = departmentData.map((d) => {
  const gaps = Object.values(d.competencies).filter((v) => v !== "proficient").length
  return {
    name: d.department.split(" ").slice(0, 2).join(" "),
    gaps,
    proficient: Object.values(d.competencies).filter((v) => v === "proficient").length,
    fill: gaps >= 3 ? "oklch(0.577 0.245 27.325)" : gaps >= 2 ? "oklch(0.72 0.17 70)" : "oklch(0.55 0.18 162)",
  }
})

export default function ModuleD({ language }: { language: "en" | "hi" }) {
  const hi = language === "hi"
  const statusLabel = (status: HeatStatus) => hi
    ? ({ proficient: "प्रवीण", moderate: "मध्यम अंतर", critical: "गंभीर अंतर" } as const)[status]
    : statusConfig[status].label
  const getOfficers = (dept: string, comp: string): string[] => {
    return heatmapOfficers[dept]?.[comp] ?? []
  }

  const handleExportCsv = () => {
    const headers = ["Division", "Officer Count", ...competencyKeys]
    const rows = departmentData.map((dept) => [
      dept.department,
      dept.officerCount,
      ...competencyKeys.map((competency) => dept.competencies[competency] ?? "proficient"),
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n")
    const downloadUrl = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = "mospi-competency-data.csv"
    link.click()
    URL.revokeObjectURL(downloadUrl)
    toast.success("MoSPI competency data downloaded", {
      description: `${departmentData.length} departmental records exported as CSV.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: hi ? "कुल आकलित अधिकारी" : "Total Officers Assessed",
            value: "2,840",
            sub: "+148 this quarter",
            icon: <Users className="size-5 text-primary" />,
            bg: "bg-card border-border/80",
            valClass: "text-foreground",
          },
          {
            title: hi ? "कैडर दक्षता सूचकांक" : "Cadre Competency Index",
            value: "3.4 / 5.0",
            sub: "↑ 0.2 from last quarter",
            icon: <BarChart3 className="size-5 text-blue-600" />,
            bg: "bg-card border-border/80",
            valClass: "text-blue-700",
          },
          {
            title: hi ? "गंभीर कौशल अंतर दर" : "Critical Skill Deficit Rate",
            value: "24%",
            sub: "618 officers at risk",
            icon: <TrendingDown className="size-5 text-rose-600" />,
            bg: "bg-card border-border/80",
            valClass: "text-rose-700",
          },
          {
            title: hi ? "iGOT प्रमाणन (Q3)" : "iGOT Certifications (Q3)",
            value: "1,420",
            sub: "↑ 320 vs Q2 2026",
            icon: <Award className="size-5 text-emerald-600" />,
            bg: "bg-card border-border/80",
            valClass: "text-emerald-700",
          },
        ].map((kpi) => (
          <Card key={kpi.title} className={`border shadow-sm ${kpi.bg}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground font-medium leading-tight">{kpi.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${kpi.valClass}`}>{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
                </div>
                <div className="size-9 rounded-lg bg-background/60 flex items-center justify-center shrink-0">
                  {kpi.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <BrainCircuit className="size-4 text-primary" />
            {hi ? "उभरते कौशल का पूर्वानुमान" : "Emerging Skills Forecast"} · FY 2027–28
          </CardTitle>
          <CardDescription>
            {hi ? "क्षमता नियोजन के लिए प्रतिनिधि मांग संकेत; प्रोडक्शन के लिए निगरानी वाला पूर्वानुमान मॉडल आवश्यक है" : "Representative demand signals for capacity planning; production values require a monitored forecasting model"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "AI/ML for Official Statistics", demand: 68, officers: 720, icon: <BrainCircuit className="size-4" /> },
              { name: "Government Cloud & APIs", demand: 54, officers: 510, icon: <CloudCog className="size-4" /> },
              { name: "Cybersecurity & Data Privacy", demand: 47, officers: 438, icon: <ShieldCheck className="size-4" /> },
            ].map((skill) => (
              <div key={skill.name} className="rounded-xl border border-border/70 bg-card/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">{skill.icon}</span>
                  <span className="text-lg font-bold text-primary">+{skill.demand}%</span>
                </div>
                <p className="mt-3 text-sm font-semibold">{skill.name}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${skill.demand}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{hi ? "अनुमानित मांग" : "Projected demand"} · {skill.officers} {hi ? "अधिकारियों का कौशल विकास" : "officers to upskill"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Award className="size-4 text-primary" /> {hi ? "प्रशिक्षण प्रभावशीलता और शिक्षार्थी प्रगति" : "Training effectiveness & learner progress"}
          </CardTitle>
          <CardDescription>{hi ? "Q3 FY 2026–27 के प्रतिनिधि पूर्व/पश्चात आकलन और पूर्णता संकेत" : "Representative pre/post assessment and completion signals for Q3 FY 2026–27"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: hi ? "पूर्णता" : "Completion", value: "82%", change: "+9% QoQ" },
                { label: hi ? "कौशल वृद्धि" : "Skill uplift", value: "+0.8", change: hi ? "औसत स्तर" : "levels avg." },
                { label: hi ? "आकलन वृद्धि" : "Assessment gain", value: "+21%", change: hi ? "पूर्व बनाम पश्चात" : "pre vs post" },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl border border-border/70 bg-muted/20 p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">{metric.label}</p>
                  <p className="mt-1 text-xl font-bold text-primary">{metric.value}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{metric.change}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[
                { name: "Survey Sampling cohort", progress: 88, detail: "126 / 143 completed" },
                { name: "Python & Data cohort", progress: 76, detail: "171 / 225 completed" },
                { name: "DPDP readiness cohort", progress: 69, detail: "202 / 293 completed" },
              ].map((cohort) => (
                <div key={cohort.name}>
                  <div className="mb-1.5 flex justify-between gap-3 text-xs">
                    <span className="font-medium">{cohort.name}</span>
                    <span className="text-muted-foreground">{cohort.detail}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${cohort.progress}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">{hi ? "प्रोटोटाइप विश्लेषण। प्रोडक्शन मेट्रिक्स के लिए इवेंट इंस्ट्रूमेंटेशन, सत्यापित पूर्णता रिकॉर्ड, कैलिब्रेटेड आकलन और समूह नियंत्रण आवश्यक हैं।" : "Prototype analytics. Production metrics require event instrumentation, verified completion records, calibrated assessments, and cohort controls."}</p>
        </CardContent>
      </Card>

      {/* Gap Chart + Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" />
              {hi ? "विभाग के अनुसार कौशल अंतर" : "Skill Gap by Department"}
            </CardTitle>
            <CardDescription>{hi ? "प्रत्येक प्रभाग में दक्षता अंतर की संख्या" : "Number of competency gaps per division"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={80}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    formatter={(val) => [`${val} gaps`, "Competency Gaps"]}
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid var(--border)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="gaps" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Heatmap */}
        <Card className="lg:col-span-3 border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <UserCheck className="size-4 text-primary" />
                  {hi ? "विभागीय कौशल अंतर हीटमैप" : "Departmental Skill Deficit Heatmap"}
                </CardTitle>
                <CardDescription>{hi ? "प्रशिक्षण की आवश्यकता वाले अधिकारी देखने के लिए किसी सेल पर क्लिक करें" : "Click any cell to view officers needing training"}</CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(Object.entries(statusConfig) as [HeatStatus, typeof statusConfig.proficient][]).map(([key]) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`inline-flex size-3 rounded-sm ${key === "proficient" ? "bg-emerald-400" : key === "moderate" ? "bg-amber-400" : "bg-rose-400"}`} />
                    {statusLabel(key)}
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-xs font-semibold pl-4 min-w-40">{hi ? "प्रभाग" : "Division"}</TableHead>
                  {competencyKeys.map((key) => (
                    <TableHead key={key} className="text-xs font-semibold text-center whitespace-nowrap px-2">
                      {key}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentData.map((dept) => (
                  <TableRow key={dept.department} className="hover:bg-muted/20">
                    <TableCell className="pl-4">
                      <div>
                        <p className="text-xs font-medium text-foreground">{dept.department}</p>
                        <p className="text-xs text-muted-foreground">{dept.officerCount} officers</p>
                      </div>
                    </TableCell>
                    {competencyKeys.map((comp) => {
                      const status: HeatStatus = dept.competencies[comp] ?? "proficient"
                      const officers = getOfficers(dept.department, comp)
                      const cfg = statusConfig[status]
                      return (
                        <TableCell key={comp} className="text-center px-2 py-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium cursor-pointer transition-colors ${cfg.bg}`}
                              >
                                {cfg.icon}
                                <span className="hidden sm:inline">{statusLabel(status).split(" ")[0]}</span>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4" side="top">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold text-sm text-foreground">{comp}</h4>
                                  <p className="text-xs text-muted-foreground">{dept.department}</p>
                                </div>
                                <Separator />
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-2">
                                    {hi ? "प्रशिक्षण आवश्यक अधिकारी" : "Officers needing training"} ({officers.length}):
                                  </p>
                                  {officers.length > 0 ? (
                                    <ul className="space-y-1">
                                      {officers.map((o) => (
                                        <li key={o} className="flex items-center gap-2 text-xs text-foreground">
                                          <span className="size-1.5 rounded-full bg-primary/50 shrink-0" />
                                          {o}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-emerald-600">{hi ? "प्रशिक्षण आवश्यक नहीं — प्रवीण" : "No training required — Proficient"}</p>
                                  )}
                                </div>
                                {officers.length > 0 && (
                                  <Button
                                    size="sm"
                                    className="w-full text-xs gap-1.5"
                                    onClick={() => toast.success(`Training batch created for ${officers.length} officers in ${comp}`)}
                                  >
                                    {hi ? "प्रशिक्षण समूह बनाएँ" : "Assign Training Batch"}
                                  </Button>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Export Row */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-foreground">{hi ? "मंत्रालय रिपोर्ट और विश्लेषण निर्यात" : "Ministry Reports & Analytics Export"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {hi ? "त्रैमासिक MoSPI समीक्षा और प्रशिक्षण योजना के लिए कैडर-व्यापी दक्षता डेटा निर्यात करें" : "Export cadre-wide competency data for quarterly MoSPI review and training planning"}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
                onClick={() => toast.info("PDF export is a prototype action", {
                  description: "Connect a production reporting service to generate the Q3 FY 2026-27 report.",
                })}
              >
                <Download className="size-3.5" />
                {hi ? "PDF रिपोर्ट निर्यात करें" : "Export PDF Report"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
                onClick={handleExportCsv}
              >
                <Download className="size-3.5" />
                {hi ? "CSV डेटा निर्यात करें" : "Export CSV Data"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
