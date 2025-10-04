import { Card } from "@/components/ui/card";
import { Video as LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant: "revenue" | "expense" | "profit" | "savings";
  subtitle?: string;
  chart?: ReactNode;
  onClick?: () => void;
}

const variantStyles = {
  revenue: "bg-gradient-to-br from-[hsl(210,100%,50%)] to-[hsl(200,90%,45%)]",
  expense: "bg-gradient-to-br from-[hsl(320,100%,60%)] to-[hsl(330,90%,55%)]",
  profit: "bg-gradient-to-br from-[hsl(160,80%,45%)] to-[hsl(170,75%,40%)]",
  savings: "bg-gradient-to-br from-[hsl(280,80%,65%)] to-[hsl(290,75%,60%)]",
};

export function MetricCard({ title, value, icon: Icon, variant, subtitle, chart, onClick }: MetricCardProps) {
  return (
    <Card
      className={`${variantStyles[variant]} border-0 overflow-hidden relative transition-all hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="p-6 text-white relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium opacity-90">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {subtitle && (
              <p className="text-sm mt-2 opacity-90">
                {subtitle}
              </p>
            )}
          </div>
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        {chart && (
          <div className="mt-4 h-24">
            {chart}
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]" />
    </Card>
  );
}
