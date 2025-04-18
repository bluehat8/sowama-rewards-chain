
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MotivationalMessage from "@/components/ui/motivational-message";
import FloatingParticles from "@/components/ui/floating-particles";
import blockchainService from "@/services/blockchainService";
import { Environmental } from "@/lib/types";
import { currentUser } from "@/services/dataService";

export default function EnvironmentalImpact() {
  const [impact, setImpact] = useState<Environmental | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const impact = await blockchainService.getEnvironmentalImpact(currentUser.id);
        setImpact(impact);
      } catch (error) {
        console.error("Error loading environmental impact", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const impactMetrics = [
    {
      label: "CO₂ evitado",
      value: impact?.co2Avoided || 0,
      unit: "kg",
      color: "bg-sowama-leaf",
      icon: "🌱",
    },
    {
      label: "Compost generado",
      value: impact?.compostGenerated || 0,
      unit: "kg",
      color: "bg-sowama-soil",
      icon: "🍂",
    },
    {
      label: "Biogás producido",
      value: impact?.biogasProduced || 0,
      unit: "m³",
      color: "bg-sowama-sky",
      icon: "💧",
    },
    {
      label: "Árboles equivalentes",
      value: impact?.treesEquivalent || 0,
      unit: "árboles",
      color: "bg-sowama-leafDark",
      icon: "🌳",
    },
  ];

  return (
    <div className="container mx-auto max-w-md px-4 py-8 min-h-screen relative">
      <FloatingParticles quantity={15} type="mixed" speed="slow" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-sowama-leafDark">Tu Impacto Ambiental</h1>
      </div>
      
      <MotivationalMessage 
        message="¡Has contribuido a un planeta más saludable!" 
        icon="🌍" 
        className="mb-6"
      />
      
      {/* Impact Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {impactMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4 space-y-3 text-center">
              <div className="text-3xl">{metric.icon}</div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </div>
                <div className="text-2xl font-bold">
                  {metric.value.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {metric.unit}
                </div>
              </div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${metric.color}`}
                  style={{ width: `${Math.min(metric.value * 5, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Impact Summary */}
      <Card className="bg-gradient-to-br from-sowama-leaf/10 to-sowama-sky/10 border-none mb-6">
        <CardContent className="p-6 text-center space-y-3">
          <h2 className="text-xl font-semibold text-sowama-leafDark">Tu contribución total</h2>
          <p className="text-muted-foreground">
            Gracias a tus entregas de residuos orgánicos, has ayudado a:
          </p>
          <ul className="space-y-2 text-left">
            <li className="flex items-center gap-2">
              <div className="text-lg">🌱</div>
              <span>Reducir la huella de carbono en {impact?.co2Avoided.toFixed(1)} kg de CO₂</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="text-lg">🍂</div>
              <span>Producir {impact?.compostGenerated.toFixed(1)} kg de compost natural</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="text-lg">🌳</div>
              <span>Plantar el equivalente a {impact?.treesEquivalent.toFixed(1)} árboles</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Link to="/projects">
        <Button 
          className="bg-sowama-leaf hover:bg-sowama-leafDark text-white w-full"
        >
          Ver Proyectos Ambientales
        </Button>
      </Link>
    </div>
  );
}
