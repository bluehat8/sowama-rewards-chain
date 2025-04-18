
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Leaf, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MotivationalMessage from "@/components/ui/motivational-message";
import FloatingParticles from "@/components/ui/floating-particles";
import { wasteTypes } from "@/services/dataService";
import { deliverWaste } from "@/services/dataService";
import AppLayout from "@/components/ui/app-layout";

export default function WasteDelivery() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [amount, setAmount] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedWasteType = wasteTypes.find(type => type.id === selectedType);
  const pointsToEarn = selectedWasteType ? selectedWasteType.pointsPerKg * amount : 0;

  const handleSubmit = async () => {
    if (!selectedType) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await deliverWaste(selectedType, amount);
      
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error("Error delivering waste:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AppLayout hideNav>
        <div className="container mx-auto max-w-md px-4 py-8 min-h-screen flex flex-col items-center justify-center relative">
          <FloatingParticles quantity={20} type="leaves" speed="normal" />
          
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="rounded-full p-3 bg-sowama-leaf/20 text-sowama-leaf">
              <CheckCircle size={48} />
            </div>
            <h1 className="text-2xl font-bold text-sowama-leafDark">
              ¡Entrega registrada!
            </h1>
            <p className="text-muted-foreground">
              Has ganado <span className="font-bold text-sowama-leaf">{pointsToEarn} puntos</span> por tu contribución.
            </p>
            <MotivationalMessage 
              message="¡Tu acción ayuda a reducir emisiones de CO₂!" 
              icon="🌱"
            />
            <Button
              onClick={() => navigate('/')}
              className="bg-sowama-leaf hover:bg-sowama-leafDark text-white"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto max-w-md px-4 py-8 relative">
        <FloatingParticles quantity={15} type="mixed" speed="slow" />
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-sowama-leafDark">Entregar Residuos</h1>
        </div>
        
        <MotivationalMessage 
          message="Cada 5 kg entregados te dan 100 puntos" 
          icon="🌱" 
          className="mb-6"
        />
        
        {/* Waste Type Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3 text-sowama-leafDark">
            Selecciona el tipo de residuo
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {wasteTypes.map((wasteType) => (
              <Card
                key={wasteType.id}
                onClick={() => setSelectedType(wasteType.id)}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedType === wasteType.id 
                  ? `border-2 border-${wasteType.color} shadow-md` 
                  : "border border-muted hover:border-sowama-leaf/50"
                }`}
              >
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-3xl mb-2">{wasteType.icon}</div>
                  <div className="font-medium text-sm">{wasteType.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {wasteType.pointsPerKg} pts/kg
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Weight Input */}
        {selectedType && (
          <div className="mb-8 animate-fade-in">
            <h2 className="text-lg font-medium mb-3 text-sowama-leafDark">
              ¿Cuántos kilos vas a entregar?
            </h2>
            
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[amount]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => setAmount(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={1}
                    max={20}
                    className="w-16"
                  />
                  <span className="text-sm font-medium">kg</span>
                </div>
                
                <div className="bg-sowama-leaf/10 p-3 rounded-md">
                  <p className="text-sm text-center">
                    <span className="font-bold text-sowama-leaf">{pointsToEarn}</span> puntos a ganar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedType || isSubmitting}
          className="bg-sowama-leaf hover:bg-sowama-leafDark text-white w-full py-6 h-auto"
        >
          <Leaf className="mr-2 h-5 w-5" />
          <span>Confirmar Entrega</span>
        </Button>
      </div>
    </AppLayout>
  );
}
