import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard as CreditCardIcon } from "lucide-react";
import { CreditCardManager, CreditCardType } from "./CreditCardManager";

interface CardManagerProps {
  creditCards: CreditCardType[];
  onAddCard: (card: Omit<CreditCardType, "id">) => void;
  onDeleteCard: (id: string) => void;
}

export function CardManager({
  creditCards,
  onAddCard,
  onDeleteCard,
}: CardManagerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CreditCardIcon className="w-4 h-4 mr-2" />
          Cartões
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Cartões</DialogTitle>
        </DialogHeader>
        <CreditCardManager
          cards={creditCards}
          onAddCard={onAddCard}
          onDeleteCard={onDeleteCard}
        />
      </DialogContent>
    </Dialog>
  );
}
