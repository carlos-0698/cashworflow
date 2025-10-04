import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TriangleAlert as AlertTriangle, Lightbulb, Calendar, Target, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
    lastYearComparison?: number;
    avgLast6Months?: number;
  };
}

const metricConfig = {
  balance: {
    title: "Saldo Atual",
    color: "hsl(160, 80%, 45%)",
    description: "Diferença entre receitas e despesas"
  },
  revenue: {
    title: "Receitas Totais",
    color: "hsl(210, 100%, 50%)",
    description: "Total de entradas no período"
  },
  expense: {
    title: "Despesas Totais",
    color: "hsl(320, 100%, 60%)",
    description: "Total de saídas no período"
  },
  savings: {
    title: "Taxa de Economia",
    color: "hsl(280, 80%, 65%)",
    description: "Percentual economizado da renda"
  }
};

const COLORS = ["hsl(210, 100%, 50%)", "hsl(160, 80%, 45%)", "hsl(320, 100%, 60%)", "hsl(280, 80%, 65%)", "hsl(40, 100%, 55%)"];

const getRecommendations = (type: MetricType, currentValue: number, trend: "up" | "down" | "stable") => {
  const recommendations: string[] = [];

  if (type === "balance") {
    if (currentValue < 0) {
      recommendations.push("Seu saldo está negativo. Priorize reduzir despesas não essenciais.");
      recommendations.push("Considere aumentar sua renda com trabalhos extras ou freelancing.");
    } else if (currentValue > 0) {
      recommendations.push("Mantenha uma reserva de emergência de 3-6 meses de despesas.");
      recommendations.push("Considere investir o excedente para fazer seu dinheiro render.");
    }
  }

  if (type === "revenue") {
    if (trend === "down") {
      recommendations.push("Suas receitas estão caindo. Busque novas oportunidades de renda.");
      recommendations.push("Diversifique suas fontes de receita para maior segurança.");
    } else {
      recommendations.push("Invista em seu desenvolvimento profissional para aumentar ainda mais.");
      recommendations.push("Considere criar fontes de renda passiva.");
    }
  }

  if (type === "expense") {
    if (trend === "up") {
      recommendations.push("Suas despesas estão aumentando. Revise gastos desnecessários.");
      recommendations.push("Aplique a regra 50/30/20: 50% necessidades, 30% desejos, 20% poupança.");
    }
    recommendations.push("Cancele assinaturas e serviços que não usa regularmente.");
    recommendations.push("Compare preços antes de grandes compras.");
  }

  if (type === "savings") {
    if (currentValue < 10) {
      recommendations.push("Taxa de economia muito baixa. Meta mínima: 10% da renda.");
      recommendations.push("Automatize sua economia: separe assim que receber o salário.");
    } else if (currentValue < 20) {
      recommendations.push("Boa taxa! Tente aumentar gradualmente para 20%.");
    } else {
      recommendations.push("Excelente! Mantenha esse ritmo e considere investimentos.");
    }
  }

  return recommendations;
};

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
  const trendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendColor = trend === "up"
    ? (metricType === "expense" ? "text-red-500" : "text-green-500")
    : trend === "down"
    ? (metricType === "expense" ? "text-green-500" : "text-red-500")
    : "text-yellow-500";

  const recommendations = getRecommendations(metricType, currentValue, trend);

  const maxValue = historicalData.length > 0 ? Math.max(...historicalData.map(d => d.value)) : 0;
  const minValue = historicalData.length > 0 ? Math.min(...historicalData.map(d => d.value)) : 0;
  const avgValue = historicalData.length > 0
    ? historicalData.reduce((sum, d) => sum + d.value, 0) / historicalData.length
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Valor Atual</p>
              <p className="text-3xl font-bold" style={{ color: config.color }}>
                {metricType === "savings" ? `${currentValue.toFixed(1)}%` : `R$ ${currentValue.toFixed(2)}`}
              </p>
            </div>
            {insights && (
              <div className={`flex items-center gap-2 ${trendColor}`}>
                {trendIcon({ className: "w-5 h-5" })}
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {insights.percentageChange > 0 ? "+" : ""}{insights.percentageChange.toFixed(1)}%
                  </p>
                  <p className="text-xs">{insights.comparison}</p>
                </div>
              </div>
            )}
          </div>

          {insights?.highlights && insights.highlights.length > 0 && (
            <Card className="p-4 bg-blue-500/5 border-blue-500/20">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  {insights.highlights.map((highlight, index) => (
                    <p key={index} className="text-sm">• {highlight}</p>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Evolução (últimos 6 meses)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 30%, 25%)" />
                <XAxis dataKey="month" stroke="hsl(280, 10%, 70%)" style={{ fontSize: '12px' }} />
                <YAxis stroke="hsl(280, 10%, 70%)" style={{ fontSize: '12px' }} />
                <Tooltip
                  formatter={(value: number) => metricType === "savings" ? `${value.toFixed(1)}%` : `R$ ${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: "hsl(260, 50%, 12%)",
                    border: "1px solid hsl(260, 30%, 25%)",
                    borderRadius: "0.5rem",
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={2}
                  dot={{ fill: config.color, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <Card className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Máximo</p>
                <p className="text-sm font-bold" style={{ color: config.color }}>
                  {metricType === "savings" ? `${maxValue.toFixed(1)}%` : `R$ ${maxValue.toFixed(2)}`}
                </p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Média</p>
                <p className="text-sm font-bold" style={{ color: config.color }}>
                  {metricType === "savings" ? `${avgValue.toFixed(1)}%` : `R$ ${avgValue.toFixed(2)}`}
                </p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Mínimo</p>
                <p className="text-sm font-bold" style={{ color: config.color }}>
                  {metricType === "savings" ? `${minValue.toFixed(1)}%` : `R$ ${minValue.toFixed(2)}`}
                </p>
              </Card>
            </div>
          </div>

          {categoryData && categoryData.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold mb-3">Distribuição por Categoria</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percentage }) => `${percentage.toFixed(0)}%`}
                        outerRadius={70}
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
                    {categoryData.slice(0, 5).map((cat, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="font-semibold">R$ {cat.value.toFixed(2)}</span>
                          <Badge variant="secondary" className="text-xs">{cat.percentage.toFixed(0)}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Recomendações
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <Card key={index} className="p-3 bg-muted/30">
                  <p className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{rec}</span>
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {(currentValue < 0 && metricType === "balance") ||
           (currentValue < 10 && metricType === "savings") ||
           (trend === "up" && metricType === "expense") ? (
            <Card className="p-4 bg-yellow-500/5 border-yellow-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-500 mb-1">Atenção</p>
                  <p className="text-sm">
                    {metricType === "balance" && "Seu saldo negativo requer ação imediata para equilibrar as finanças."}
                    {metricType === "savings" && "Taxa de economia muito baixa. Priorize economizar pelo menos 10% da renda."}
                    {metricType === "expense" && "Despesas crescentes podem comprometer sua saúde financeira."}
                  </p>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
