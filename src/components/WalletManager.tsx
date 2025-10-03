import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export interface WalletType {
  id: string;
  name: string;
}

interface WalletManagerProps {
  wallets: WalletType[];
  onAddWallet: (wallet: Omit<WalletType, "id">) => void;
  onDeleteWallet: (id: string) => void;
}

export function WalletManager({ wallets, onAddWallet, onDeleteWallet }: WalletManagerProps) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Digite um nome para a carteira");
      return;
    }

    onAddWallet({ name: name.trim() });
    setName("");
    setIsOpen(false);
    toast.success("Carteira criada!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Wallet className="w-4 h-4 mr-2" />
          Gerenciar Carteiras
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerenciar Carteiras</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Carteira</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Principal, Investimentos, Poupança..."
              />
            </div>
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Criar Carteira
            </Button>
          </form>

          {wallets.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border">
              <Label>Carteiras Criadas</Label>
              <div className="space-y-2">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50"
                  >
                    <span className="font-medium">{wallet.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onDeleteWallet(wallet.id);
                        toast.success("Carteira removida!");
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
      </DialogContent>
    </Dialog>
  );
}
