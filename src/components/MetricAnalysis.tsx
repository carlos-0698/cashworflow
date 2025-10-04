import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, Lightbulb, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type MetricType = "balance" | "revenue" | "expense" | "savings";

interface HistoricalData {
  month: string;
  value: number;
}

interface CategoryBreakdown {
  name: string;
  value: number;
  percentage: number;
}

interface MetricAnalysisProps {
  open: boolean;
  onClose: () => void;
  metricType: MetricType;
  currentValue: number;
  historicalData: HistoricalData[];
  categoryData?: CategoryBreakdown[];
  insights?: {
    trend: "up" | "down" | "stable";
    percentageChange: number;
    comparison: string;
    highlights: string[];
  };
}

const metricConfig = {
  balance: {
    title: "Análise do Saldo Atual",
    color: "hsl(160, 80%, 45%)",
    tips: [
      "Mantenha uma reserva de emergência equivalente a 3-6 meses de despesas",
      "Evite manter todo o dinheiro parado - considere investimentos",
      "Estabeleça metas de economia específicas para cada mês",
      "Revise seus gastos fixos regularmente para encontrar economias"
    ],
    warnings: [
      "Saldo negativo indica que está gastando mais do que ganha",
      "Considere reduzir gastos não essenciais",
      "Busque fontes alternativas de renda"
    ]
  },
  revenue: {
    title: "Análise das Receitas",
    color: "hsl(210, 100%, 50%)",
    tips: [
      "Diversifique suas fontes de renda para maior segurança financeira",
      "Busque oportunidades de renda passiva",
      "Invista em seu desenvolvimento profissional para aumentar ganhos",
      "Considere freelancing ou projetos paralelos"
    ],
    warnings: [
      "Receitas instáveis podem comprometer seu planejamento",
      "Mantenha uma reserva maior se sua renda for variável"
    ]
  },
  expense: {
    title: "Análise das Despesas",
    color: "hsl(320, 100%, 60%)",
    tips: [
      "Aplique a regra 50/30/20: 50% necessidades, 30% desejos, 20% economia",
      "Revise assinaturas e serviços que não utiliza",
      "Compare preços antes de grandes compras",
      "Evite compras por impulso - aguarde 24h antes de decidir",
      "Negocie melhores condições em contratos recorrentes"
    ],
    warnings: [
      "Despesas crescentes podem comprometer sua saúde financeira",
      "Identifique e reduza gastos desnecessários",
      "Cuidado com compras parceladas excessivas"
    ]
  },
  savings: {
    title: "Análise da Taxa de Economia",
    color: "hsl(280, 80%, 65%)",
    tips: [
      "Meta ideal: economizar pelo menos 20% da renda mensal",
      "Automatize suas economias - separe assim que receber",
      "Estabeleça objetivos claros: emergência, aposentadoria, projetos",
      "Considere investimentos de acordo com seu perfil",
      "Revise e aumente sua taxa de economia gradualmente"
    ],
    warnings: [
      "Taxa de economia abaixo de 10% é preocupante",
      "Sem economia, você fica vulnerável a imprevistos",
      "Priorize construir uma reserva de emergência"
    ]
  }
};

const COLORS = ["hsl(210, 100%, 50%)", "hsl(160, 80%, 45%)", "hsl(320, 100%, 60%)", "hsl(280, 80%, 65%)", "hsl(40, 100%, 55%)"];

export function MetricAnalysis({
  open,
  onClose,
  metricType,
  currentValue,
  historicalData,
  categoryData,
  insights
}: MetricAnalysisProps) {
  const config = metricConfig[metricType];

  const trend = insights?.trend || "stable";
  const trendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Target;
  const trendColor = trend === "up"
    ? (metricType === "expense" ? "text-red-500" : "text-green-500")
    : trend === "down"
    ? (metricType === "expense" ? "text-green-500" : "text-red-500")
    : "text-yellow-500";

  const shouldShowWarnings =
    (metricType === "balance" && currentValue < 0) ||
    (metricType === "savings" && currentValue < 10) ||
    (metricType === "expense" && trend === "up");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{config.title}</DialogTitle>
          <DialogDescription>
            Análise detalhada e insights para melhorar sua saúde financeira
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="tips">Dicas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Valor Atual</h3>
                  <p className="text-3xl font-bold" style={{ color: config.color }}>
                    {metricType === "savings" ? `${currentValue.toFixed(1)}%` : `R$ ${currentValue.toFixed(2)}`}
                  </p>
                  {insights && (
                    <div className={`flex items-center gap-2 mt-2 ${trendColor}`}>
                      {trendIcon({ className: "w-4 h-4" })}
                      <span className="text-sm font-medium">
                        {insights.percentageChange > 0 ? "+" : ""}{insights.percentageChange.toFixed(1)}% {insights.comparison}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {insights?.highlights && insights.highlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    Destaques
                  </h4>
                  <ul className="space-y-1">
                    {insights.highlights.map((highlight, index) => (
                      <li key={index} className="text-sm text-muted-foreground ml-6">
                        • {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {categoryData && categoryData.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percentage }) => `${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {categoryData.map((cat, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm font-medium">{cat.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">R$ {cat.value.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{cat.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Evolução Histórica</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 30%, 25%)" />
                  <XAxis dataKey="month" stroke="hsl(280, 10%, 70%)" />
                  <YAxis stroke="hsl(280, 10%, 70%)" />
                  <Tooltip
                    formatter={(value: number) => metricType === "savings" ? `${value.toFixed(1)}%` : `R$ ${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "hsl(260, 50%, 12%)",
                      border: "1px solid hsl(260, 30%, 25%)",
                      borderRadius: "0.5rem"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={config.color}
                    strokeWidth={2}
                    dot={{ fill: config.color, r: 4 }}
                    name={metricType === "savings" ? "Taxa %" : "Valor"}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Máximo</p>
                  <p className="text-lg font-bold" style={{ color: config.color }}>
                    {metricType === "savings"
                      ? `${Math.max(...historicalData.map(d => d.value)).toFixed(1)}%`
                      : `R$ ${Math.max(...historicalData.map(d => d.value)).toFixed(2)}`
                    }
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Médio</p>
                  <p className="text-lg font-bold" style={{ color: config.color }}>
                    {metricType === "savings"
                      ? `${(historicalData.reduce((sum, d) => sum + d.value, 0) / historicalData.length).toFixed(1)}%`
                      : `R$ ${(historicalData.reduce((sum, d) => sum + d.value, 0) / historicalData.length).toFixed(2)}`
                    }
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Mínimo</p>
                  <p className="text-lg font-bold" style={{ color: config.color }}>
                    {metricType === "savings"
                      ? `${Math.min(...historicalData.map(d => d.value)).toFixed(1)}%`
                      : `R$ ${Math.min(...historicalData.map(d => d.value)).toFixed(2)}`
                    }
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            {shouldShowWarnings && (
              <Card className="p-6 border-yellow-500/50 bg-yellow-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-yellow-500">Pontos de Atenção</h3>
                    <ul className="space-y-2">
                      {config.warnings.map((warning, index) => (
                        <li key={index} className="text-sm">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Dicas para Melhorar</h3>
                  <ul className="space-y-3">
                    {config.tips.map((tip, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Meta Sugerida
              </h3>
              <p className="text-sm mb-4">
                {metricType === "balance" && "Mantenha um saldo positivo equivalente a pelo menos 3 meses de despesas."}
                {metricType === "revenue" && "Busque aumentar suas receitas em 10-20% ao ano através de novas oportunidades."}
                {metricType === "expense" && "Mantenha suas despesas abaixo de 80% da sua renda mensal."}
                {metricType === "savings" && "Meta ideal: economize pelo menos 20% da sua renda todo mês."}
              </p>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Progresso estimado</p>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{
                      width: `${metricType === "savings"
                        ? Math.min(currentValue / 20 * 100, 100)
                        : metricType === "balance"
                        ? currentValue > 0 ? 60 : 20
                        : 50
                      }%`
                    }}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
