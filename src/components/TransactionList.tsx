import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "./TransactionForm";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle, Filter, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function TransactionList({ transactions, onDeleteTransaction, currentMonth, onMonthChange }: TransactionListProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredTransactions = transactions.filter((t) => {
    const typeMatch = filterType === "all" || t.type === filterType;
    const categoryMatch = filterCategory === "all" || t.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  const handleDelete = (id: string) => {
    onDeleteTransaction(id);
    toast.success("Transação excluída com sucesso!");
  };

  const handlePreviousMonth = () => {
    if (currentMonth && currentMonth instanceof Date && !isNaN(currentMonth.getTime())) {
      onMonthChange(subMonths(currentMonth, 1));
    }
  };

  const handleNextMonth = () => {
    if (currentMonth && currentMonth instanceof Date && !isNaN(currentMonth.getTime())) {
      onMonthChange(addMonths(currentMonth, 1));
    }
  };

  // Validar currentMonth
  const isValidMonth = currentMonth && currentMonth instanceof Date && !isNaN(currentMonth.getTime());

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Transações</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {isValidMonth ? format(currentMonth, "MMMM yyyy", { locale: ptBR }) : "Selecione uma data"}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa">Despesas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma transação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {(() => {
                        try {
                          const date = new Date(transaction.date);
                          if (isNaN(date.getTime())) return transaction.date;
                          return format(date, "dd/MM/yyyy");
                        } catch {
                          return transaction.date;
                        }
                      })()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      {transaction.type === "receita" ? (
                        <Badge variant="outline" className="border-profit text-profit">
                          <ArrowUpCircle className="w-3 h-3 mr-1" />
                          Receita
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-expense text-expense">
                          <ArrowDownCircle className="w-3 h-3 mr-1" />
                          Despesa
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transaction.creditCard && (
                        <div>
                          <div>💳 {transaction.creditCard}</div>
                          {transaction.installments && transaction.installments > 1 && (
                            <div>Parcela {transaction.currentInstallment}/{transaction.installments}</div>
                          )}
                        </div>
                      )}
                      {transaction.isRecurring && (
                        <div className="text-xs text-blue-400">
                          🔄 Recorrente
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      <span className={transaction.type === "receita" ? "text-profit" : "text-expense"}>
                        {transaction.type === "receita" ? "+" : "-"}
                        R$ {transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
