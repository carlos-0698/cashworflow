import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TransactionForm, Transaction } from "./TransactionForm";
import { CreditCardType } from "./CreditCardManager";

interface QuickAddButtonProps {
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  categories: {
    receita: string[];
    despesa: string[];
  };
  onAddCategory: (type: "receita" | "despesa", category: string) => void;
  creditCards: CreditCardType[];
  wallets: Array<{ id: string; name: string }>;
}

export function QuickAddButton({ 
  onAddTransaction, 
  categories, 
  onAddCategory, 
  creditCards,
  wallets 
}: QuickAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    onAddTransaction(transaction);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>
        <TransactionForm
          onAddTransaction={handleAddTransaction}
          categories={categories}
          onAddCategory={onAddCategory}
          creditCards={creditCards}
          wallets={wallets}
        />
      </DialogContent>
    </Dialog>
  );
}
