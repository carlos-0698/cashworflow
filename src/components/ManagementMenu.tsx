import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, CreditCard as CreditCardIcon, FolderOpen } from "lucide-react";
import { CreditCardManager, CreditCardType } from "./CreditCardManager";
import { CategoryManager } from "./CategoryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ManagementMenuProps {
  creditCards: CreditCardType[];
  onAddCard: (card: Omit<CreditCardType, "id">) => void;
  onDeleteCard: (id: string) => void;
  categories: {
    receita: string[];
    despesa: string[];
  };
  onDeleteCategory: (type: "receita" | "despesa", category: string) => void;
}

export function ManagementMenu({
  creditCards,
  onAddCard,
  onDeleteCard,
  categories,
  onDeleteCategory,
}: ManagementMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Gerenciar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciamento</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cards">
              <CreditCardIcon className="w-4 h-4 mr-2" />
              Cartões
            </TabsTrigger>
            <TabsTrigger value="categories">
              <FolderOpen className="w-4 h-4 mr-2" />
              Categorias
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cards" className="pt-4">
            <CreditCardManager
              cards={creditCards}
              onAddCard={onAddCard}
              onDeleteCard={onDeleteCard}
            />
          </TabsContent>
          <TabsContent value="categories" className="pt-4">
            <CategoryManager
              categories={categories}
              onDeleteCategory={onDeleteCategory}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
