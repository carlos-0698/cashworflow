import { useState, useMemo } from "react";
import { MetricCard } from "@/components/MetricCard";
import { TransactionForm, Transaction } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank,
  BarChart3,
  PieChart as PieChartIcon 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data inicial para demonstração
const initialTransactions: Transaction[] = [
  {
    id: "1",
    type: "receita",
    category: "Salário",
    amount: 5000,
    description: "Salário mensal",
    date: "2025-01-05",
  },
  {
    id: "2",
    type: "despesa",
    category: "Moradia",
    amount: 1200,
    description: "Aluguel",
    date: "2025-01-10",
  },
  {
    id: "3",
    type: "despesa",
    category: "Alimentação",
    amount: 450,
    description: "Supermercado",
    date: "2025-01-15",
  },
  {
    id: "4",
    type: "despesa",
    category: "Transporte",
    amount: 320,
    description: "Combustível e transporte",
    date: "2025-01-18",
  },
  {
    id: "5",
    type: "receita",
    category: "Freelance",
    amount: 1500,
    description: "Projeto freelance",
    date: "2025-01-20",
  },
  {
    id: "6",
    type: "despesa",
    category: "Lazer",
    amount: 280,
    description: "Cinema e restaurantes",
    date: "2025-01-22",
  },
];

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  // Cálculos
  const metrics = useMemo(() => {
    const totalReceitas = transactions
      .filter((t) => t.type === "receita")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDespesas = transactions
      .filter((t) => t.type === "despesa")
      .reduce((sum, t) => sum + t.amount, 0);

    const saldo = totalReceitas - totalDespesas;
    const percentualEconomia = totalReceitas > 0 ? ((saldo / totalReceitas) * 100) : 0;

    return {
      totalReceitas,
      totalDespesas,
      saldo,
      percentualEconomia,
    };
  }, [transactions]);

  // Dados mensais para gráficos
  const monthlyData = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return months.map((month) => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);

      const monthTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      });

      const receitas = monthTransactions
        .filter((t) => t.type === "receita")
        .reduce((sum, t) => sum + t.amount, 0);

      const despesas = monthTransactions
        .filter((t) => t.type === "despesa")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month: format(month, "MMM", { locale: ptBR }),
        receitas,
        despesas,
        saldo: receitas - despesas,
      };
    });
  }, [transactions]);

  // Dados por categoria
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    
    transactions
      .filter((t) => t.type === "despesa")
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  const COLORS = ["hsl(210, 100%, 50%)", "hsl(160, 80%, 45%)", "hsl(320, 100%, 60%)", "hsl(280, 80%, 65%)", "hsl(40, 100%, 55%)"];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Meu Controle Financeiro</h1>
          <p className="text-muted-foreground">
            Gerencie suas finanças de forma simples e eficiente
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Saldo Atual"
            value={`R$ ${metrics.saldo.toFixed(2)}`}
            icon={Wallet}
            variant="profit"
            subtitle={metrics.saldo >= 0 ? "Situação positiva" : "Atenção ao saldo"}
          />
          <MetricCard
            title="Receitas Totais"
            value={`R$ ${metrics.totalReceitas.toFixed(2)}`}
            icon={TrendingUp}
            variant="revenue"
            subtitle="Total de entradas"
          />
          <MetricCard
            title="Despesas Totais"
            value={`R$ ${metrics.totalDespesas.toFixed(2)}`}
            icon={TrendingDown}
            variant="expense"
            subtitle="Total de saídas"
          />
          <MetricCard
            title="% de Economia"
            value={`${metrics.percentualEconomia.toFixed(1)}%`}
            icon={PiggyBank}
            variant="savings"
            subtitle={`R$ ${metrics.saldo.toFixed(2)} poupados`}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Evolução Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(320, 100%, 60%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(320, 100%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 30%, 25%)" />
                  <XAxis dataKey="month" stroke="hsl(280, 10%, 70%)" />
                  <YAxis stroke="hsl(280, 10%, 70%)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(260, 50%, 12%)", 
                      border: "1px solid hsl(260, 30%, 25%)",
                      borderRadius: "0.5rem"
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="receitas" 
                    stroke="hsl(210, 100%, 50%)" 
                    fillOpacity={1} 
                    fill="url(#colorReceitas)"
                    name="Receitas"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="despesas" 
                    stroke="hsl(320, 100%, 60%)" 
                    fillOpacity={1} 
                    fill="url(#colorDespesas)"
                    name="Despesas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(260, 50%, 12%)", 
                      border: "1px solid hsl(260, 30%, 25%)",
                      borderRadius: "0.5rem"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de Transação */}
        <TransactionForm onAddTransaction={handleAddTransaction} />

        {/* Lista de Transações */}
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default Index;
