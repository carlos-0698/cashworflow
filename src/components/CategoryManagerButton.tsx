import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FolderOpen } from "lucide-react";
import { CategoryManager } from "./CategoryManager";

interface CategoryManagerButtonProps {
  categories: {
    receita: string[];
    despesa: string[];
  };
  onDeleteCategory: (type: "receita" | "despesa", category: string) => void;
}

export function CategoryManagerButton({
  categories,
  onDeleteCategory,
}: CategoryManagerButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FolderOpen className="w-4 h-4 mr-2" />
          Categorias
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias</DialogTitle>
        </DialogHeader>
        <CategoryManager
          categories={categories}
          onDeleteCategory={onDeleteCategory}
        />
      </DialogContent>
    </Dialog>
  );
}
