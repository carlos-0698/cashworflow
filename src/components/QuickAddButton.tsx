import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { TransactionForm, Transaction } from "./TransactionForm";
import { CreditCardType } from "./CreditCardManager";

interface QuickAddButtonProps {
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
  onCloseEdit?: () => void;
}

export function QuickAddButton({
  onAddTransaction,
  onEditTransaction,
  categories,
  onAddCategory,
  creditCards,
  wallets,
  activeWallet,
  editingTransaction,
  onCloseEdit
}: QuickAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    onAddTransaction(transaction);
    setIsOpen(false);
  };

  const handleEditTransaction = (id: string, transaction: Omit<Transaction, "id">) => {
    if (onEditTransaction) {
      onEditTransaction(id, transaction);
      setIsOpen(false);
      if (onCloseEdit) onCloseEdit();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onCloseEdit) {
      onCloseEdit();
    }
  };

  return (
    <Dialog open={isOpen || !!editingTransaction} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTransaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
        </DialogHeader>
        <TransactionForm
          onAddTransaction={handleAddTransaction}
          onEditTransaction={handleEditTransaction}
          categories={categories}
          onAddCategory={onAddCategory}
          creditCards={creditCards}
          wallets={wallets}
          activeWallet={activeWallet}
          editingTransaction={editingTransaction}
        />
      </DialogContent>
    </Dialog>
  );
}
