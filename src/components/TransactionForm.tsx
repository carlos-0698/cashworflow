import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CreditCardType } from "./CreditCardManager";

export interface Transaction {
  id: string;
  type: "receita" | "despesa";
  category: string;
  categoryId?: string;
  amount: number;
  description: string;
  date: string;
  creditCard?: string;
  creditCardId?: string;
  wallet: string;
  walletId?: string;
  installments?: number;
  currentInstallment?: number;
  parentTransactionId?: string;
  isRecurring?: boolean;
  recurrenceFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  recurrenceEndDate?: string;
}

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  onEditTransaction?: (id: string, transaction: Omit<Transaction, "id">) => void;
  categories: {
    receita: string[];
    despesa: string[];
  };
  onAddCategory: (type: "receita" | "despesa", category: string) => void;
  creditCards: CreditCardType[];
  wallets: Array<{ id: string; name: string }>;
  activeWallet?: string;
  editingTransaction?: Transaction;
}

export function TransactionForm({ onAddTransaction, onEditTransaction, categories, onAddCategory, creditCards, wallets, activeWallet, editingTransaction }: TransactionFormProps) {
  const [type, setType] = useState<"receita" | "despesa">("despesa");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [newCategory, setNewCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creditCard, setCreditCard] = useState<string>("none");
  const [wallet, setWallet] = useState<string>(activeWallet || "");
  const [installments, setInstallments] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");

  useEffect(() => {
    if (activeWallet && !wallet) {
      setWallet(activeWallet);
    }
  }, [activeWallet]);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date);
      setCreditCard(editingTransaction.creditCard || "none");
      setWallet(editingTransaction.wallet);
      setInstallments(editingTransaction.installments?.toString() || "");
      setIsRecurring(editingTransaction.isRecurring || false);
      setRecurrenceFrequency(editingTransaction.recurrenceFrequency || "monthly");
      setRecurrenceEndDate(editingTransaction.recurrenceEndDate || "");
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount || !description || !wallet) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Validar limite do cartão de crédito
    if (type === "despesa" && creditCard && creditCard !== "none") {
      const selectedCard = creditCards.find(card => card.name === creditCard);
      if (selectedCard && parseFloat(amount) > selectedCard.limit) {
        toast.error(`O valor excede o limite do cartão ${selectedCard.name} (R$ ${selectedCard.limit.toFixed(2)})`);
        return;
      }
    }

    const transactionData = {
      type,
      category,
      amount: parseFloat(amount),
      description,
      date,
      creditCard: type === "despesa" && creditCard && creditCard !== "none" ? creditCard : undefined,
      wallet,
      installments: installments ? parseInt(installments) : undefined,
      isRecurring,
      recurrenceFrequency: isRecurring ? recurrenceFrequency : undefined,
      recurrenceEndDate: isRecurring && recurrenceEndDate ? recurrenceEndDate : undefined,
    };

    if (editingTransaction && onEditTransaction) {
      onEditTransaction(editingTransaction.id, transactionData);
      toast.success(`Transação atualizada com sucesso!`);
    } else {
      onAddTransaction(transactionData);
      toast.success(`${type === "receita" ? "Receita" : "Despesa"} adicionada com sucesso!`);
    }

    // Reset form
    setAmount("");
    setDescription("");
    setCategory("");
    setCreditCard("none");
    setInstallments("");
    setIsRecurring(false);
    setRecurrenceEndDate("");
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(type, newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory("");
      setIsDialogOpen(false);
      toast.success("Categoria adicionada!");
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as "receita" | "despesa")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Carteira</Label>
              <Select value={wallet} onValueChange={setWallet}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma carteira..." />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <div className="flex gap-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[type].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Nome da Categoria</Label>
                        <Input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Ex: Assinaturas, Farmácia..."
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddNewCategory())}
                        />
                      </div>
                      <Button onClick={handleAddNewCategory} className="w-full">
                        Adicionar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {type === "despesa" && creditCards.length > 0 && (
              <div className="space-y-2">
                <Label>Cartão de Crédito (opcional)</Label>
                <Select value={creditCard} onValueChange={setCreditCard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {creditCards.map((card) => (
                      <SelectItem key={card.id} value={card.name}>
                        {card.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {type === "despesa" && creditCard && creditCard !== "none" && (
              <div className="space-y-2">
                <Label>Número de Parcelas</Label>
                <Input
                  type="number"
                  min="1"
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  placeholder="1"
                />
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
                <Label htmlFor="recurring" className="cursor-pointer">
                  Despesa Fixa (Recorrente)
                </Label>
              </div>
            </div>

            {isRecurring && (
              <>
                <div className="space-y-2">
                  <Label>Frequência</Label>
                  <Select value={recurrenceFrequency} onValueChange={(v) => setRecurrenceFrequency(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diária</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Repetir até (opcional)</Label>
                  <Input
                    type="date"
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Compra no supermercado"
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {editingTransaction ? "Atualizar Transação" : "Adicionar Transação"}
          </Button>
        </form>
    </div>
  );
}
