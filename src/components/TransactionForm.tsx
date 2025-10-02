import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  type: "receita" | "despesa";
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  categories: {
    receita: string[];
    despesa: string[];
  };
  onAddCategory: (type: "receita" | "despesa", category: string) => void;
}

export function TransactionForm({ onAddTransaction, categories, onAddCategory }: TransactionFormProps) {
  const [type, setType] = useState<"receita" | "despesa">("despesa");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount || !description) {
      toast.error("Preencha todos os campos");
      return;
    }

    onAddTransaction({
      type,
      category,
      amount: parseFloat(amount),
      description,
      date,
    });

    // Reset form
    setAmount("");
    setDescription("");
    setCategory("");
    toast.success(`${type === "receita" ? "Receita" : "Despesa"} adicionada com sucesso!`);
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(type, newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory("");
      setIsAddingCategory(false);
      toast.success("Categoria adicionada!");
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nova Transação
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              <Label>Categoria</Label>
              {isAddingCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nova categoria"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddNewCategory())}
                  />
                  <Button type="button" onClick={handleAddNewCategory} size="sm">
                    OK
                  </Button>
                  <Button type="button" onClick={() => setIsAddingCategory(false)} variant="outline" size="sm">
                    Cancelar
                  </Button>
                </div>
              ) : (
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
                    <SelectItem value="__add_new__" onSelect={() => setIsAddingCategory(true)}>
                      + Adicionar nova categoria
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

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
            Adicionar Transação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
