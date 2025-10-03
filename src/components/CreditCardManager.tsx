import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface CreditCardType {
  id: string;
  name: string;
  limit: number;
}

interface CreditCardManagerProps {
  cards: CreditCardType[];
  onAddCard: (card: Omit<CreditCardType, "id">) => void;
  onDeleteCard: (id: string) => void;
}

export function CreditCardManager({ cards, onAddCard, onDeleteCard }: CreditCardManagerProps) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !limit) {
      toast.error("Preencha todos os campos");
      return;
    }

    onAddCard({
      name,
      limit: parseFloat(limit),
    });

    setName("");
    setLimit("");
    toast.success("Cartão adicionado!");
  };

  return (
    <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Cartão</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Nubank, Inter..."
              />
            </div>
            <div className="space-y-2">
              <Label>Limite (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>
          <Button type="submit" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Cartão
          </Button>
        </form>

        {cards.length > 0 && (
          <div className="space-y-2">
            <Label>Cartões Cadastrados</Label>
            <div className="space-y-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50"
                >
                  <div>
                    <p className="font-medium">{card.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Limite: R$ {card.limit.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onDeleteCard(card.id);
                      toast.success("Cartão removido!");
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
