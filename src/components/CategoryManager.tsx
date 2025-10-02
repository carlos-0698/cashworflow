import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CategoryManagerProps {
  categories: {
    receita: string[];
    despesa: string[];
  };
  onDeleteCategory: (type: "receita" | "despesa", category: string) => void;
}

export function CategoryManager({ categories, onDeleteCategory }: CategoryManagerProps) {
  const [activeTab, setActiveTab] = useState<"receita" | "despesa">("despesa");

  const handleDelete = (type: "receita" | "despesa", category: string) => {
    onDeleteCategory(type, category);
    toast.success("Categoria removida!");
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Gerenciar Categorias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "receita" | "despesa")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="receita">Receitas</TabsTrigger>
            <TabsTrigger value="despesa">Despesas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="receita" className="space-y-2 mt-4">
            {categories.receita.map((cat) => (
              <div
                key={cat}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50"
              >
                <span>{cat}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete("receita", cat)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="despesa" className="space-y-2 mt-4">
            {categories.despesa.map((cat) => (
              <div
                key={cat}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50"
              >
                <span>{cat}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete("despesa", cat)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
