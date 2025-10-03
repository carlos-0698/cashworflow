import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/MetricCard";
import { Transaction } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { CreditCardType } from "@/components/CreditCardManager";
import { WalletManager, WalletType } from "@/components/WalletManager";
import { QuickAddButton } from "@/components/QuickAddButton";
import { CardManager } from "@/components/CardManager";
import { CategoryManagerButton } from "@/components/CategoryManagerButton";
import { MonthNavigator } from "@/components/MonthNavigator";
import { calculateCreditCardExpensesForMonth } from "@/lib/installmentCalculator";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ChartBar as BarChart3, ChartPie as PieChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, addMonths, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCardType[]>([]);
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [activeWallet, setActiveWallet] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [categories, setCategories] = useState({
    receita: ["Salário", "Freelance", "Investimentos", "Outros"],
    despesa: ["Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Educação", "Outros"],
  });

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    if (transaction.isRecurring && transaction.recurrenceFrequency) {
      const futureDate = addMonths(new Date(), 12);
      const recurringDates = [];
      let currentDate = parseISO(transaction.date);
      const endDate = transaction.recurrenceEndDate
        ? parseISO(transaction.recurrenceEndDate)
        : futureDate;

      while (currentDate <= endDate && currentDate <= futureDate) {
        const newTransaction: Transaction = {
          ...transaction,
          id: `${Date.now()}-${currentDate.getTime()}`,
          date: format(currentDate, "yyyy-MM-dd"),
        };
        recurringDates.push(newTransaction);

        switch (transaction.recurrenceFrequency) {
          case "daily":
            currentDate = addMonths(currentDate, 0);
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case "weekly":
            currentDate = addMonths(currentDate, 0);
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case "monthly":
            currentDate = addMonths(currentDate, 1);
            break;
          case "yearly":
            currentDate = addMonths(currentDate, 12);
            break;
        }
      }

      setTransactions([...recurringDates, ...transactions]);
    } else if (transaction.creditCard && transaction.installments && transaction.installments > 1) {
      const installmentTransactions: Transaction[] = [];
      const installmentAmount = transaction.amount / transaction.installments;
      const baseDate = parseISO(transaction.date);

      for (let i = 0; i < transaction.installments; i++) {
        const installmentDate = addMonths(baseDate, i);
        const newTransaction: Transaction = {
          ...transaction,
          id: `${Date.now()}-${i}`,
          amount: installmentAmount,
          currentInstallment: i + 1,
          date: format(installmentDate, "yyyy-MM-dd"),
        };
        installmentTransactions.push(newTransaction);
      }

      setTransactions([...installmentTransactions, ...transactions]);
    } else {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
      };
      setTransactions([newTransaction, ...transactions]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleAddCategory = (type: "receita" | "despesa", category: string) => {
    if (!categories[type].includes(category)) {
      setCategories({
        ...categories,
        [type]: [...categories[type], category],
      });
    }
  };

  const handleDeleteCategory = (type: "receita" | "despesa", category: string) => {
    setCategories({
      ...categories,
      [type]: categories[type].filter((c) => c !== category),
    });
  };

  const handleAddCard = (card: Omit<CreditCardType, "id">) => {
    const newCard: CreditCardType = {
      ...card,
      id: Date.now().toString(),
    };
    setCreditCards([...creditCards, newCard]);
  };

  const handleDeleteCard = (id: string) => {
    setCreditCards(creditCards.filter((c) => c.id !== id));
  };

  const handleAddWallet = (wallet: Omit<WalletType, "id">) => {
    const newWallet: WalletType = {
      ...wallet,
      id: Date.now().toString(),
    };
    setWallets([...wallets, newWallet]);
    if (!activeWallet) {
      setActiveWallet(newWallet.id);
    }
  };

  const handleDeleteWallet = (id: string) => {
    setWallets(wallets.filter((w) => w.id !== id));
    if (activeWallet === id) {
      setActiveWallet(wallets[0]?.id || "");
    }
  };

  const metrics = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    const walletTransactions = transactions.filter((t) => {
      const transactionDate = parseISO(t.date);
      return (
        t.wallet === activeWallet &&
        transactionDate >= monthStart &&
        transactionDate <= monthEnd
      );
    });

    const totalReceitas = walletTransactions
      .filter((t) => t.type === "receita")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDespesas = walletTransactions
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
  }, [transactions, activeWallet, selectedMonth]);

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
        return date >= start && date <= end && t.wallet === activeWallet;
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
  }, [transactions, activeWallet]);

  // Dados por categoria
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    
    transactions
      .filter((t) => t.type === "despesa" && t.wallet === activeWallet)
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions, activeWallet]);

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

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <WalletManager
            wallets={wallets}
            onAddWallet={handleAddWallet}
            onDeleteWallet={handleDeleteWallet}
          />
          <CardManager
            creditCards={creditCards}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
          />
          <CategoryManagerButton
            categories={categories}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>

        {/* Tabs para Carteiras */}
        {wallets.length > 0 && (
          <Tabs value={activeWallet} onValueChange={setActiveWallet}>
            <TabsList className="grid w-full max-w-full" style={{ gridTemplateColumns: `repeat(${wallets.length}, 1fr)` }}>
              {wallets.map((wallet) => (
                <TabsTrigger key={wallet.id} value={wallet.id}>
                  {wallet.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

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

        {/* Month Navigator */}
        <MonthNavigator
          currentDate={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* Quick Add Button */}
        {wallets.length > 0 && (
          <QuickAddButton
            onAddTransaction={handleAddTransaction}
            categories={categories}
            onAddCategory={handleAddCategory}
            creditCards={creditCards}
            wallets={wallets}
            activeWallet={activeWallet}
          />
        )}

        {/* Lista de Transações */}
        {activeWallet && (
          <TransactionList
            transactions={transactions.filter((t) => {
              const transactionDate = parseISO(t.date);
              const monthStart = startOfMonth(selectedMonth);
              const monthEnd = endOfMonth(selectedMonth);
              return (
                t.wallet === activeWallet &&
                transactionDate >= monthStart &&
                transactionDate <= monthEnd
              );
            })}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
