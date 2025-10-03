import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthNavigatorProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

export function MonthNavigator({ currentDate, onMonthChange }: MonthNavigatorProps) {
  const handlePreviousMonth = () => {
    onMonthChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    onMonthChange(new Date());
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Navegação por Mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold">
              {format(currentDate, "MMMM yyyy", { locale: ptBR })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="text-xs"
            >
              Voltar para hoje
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
