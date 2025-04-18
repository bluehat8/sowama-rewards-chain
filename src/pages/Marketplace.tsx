
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Gift, Filter, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MotivationalMessage from "@/components/ui/motivational-message";
import FloatingParticles from "@/components/ui/floating-particles";
import EcoCard from "@/components/ui/eco-card";
import { products, currentUser, redeemProduct } from "@/services/dataService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Marketplace() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    const categoryMatch = category === "all" || product.category === category;
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Get unique categories
  const categories = ["all", ...new Set(products.map(p => p.category))];
  
  // Get selected product details
  const product = products.find(p => p.id === selectedProduct);
  
  // Check if user has enough points
  const canPurchase = product ? currentUser.points >= product.points : false;

  const handleRedeemClick = (productId: string) => {
    setSelectedProduct(productId);
    setIsConfirmOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;
    
    try {
      const success = await redeemProduct(selectedProduct);
      
      if (success) {
        setIsConfirmOpen(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error("Error redeeming product", error);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto max-w-md px-4 py-8 min-h-screen flex flex-col items-center justify-center relative">
        <FloatingParticles quantity={20} type="mixed" speed="normal" />
        
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="rounded-full p-3 bg-sowama-soil/20 text-sowama-soil">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-2xl font-bold text-sowama-soilDark">
            ¡Canje exitoso!
          </h1>
          <p className="text-muted-foreground">
            Tu pedido será procesado y pronto te contactaremos.
          </p>
          <MotivationalMessage 
            message="¡Gracias por ser parte del cambio!" 
            icon="💚"
          />
          <Button
            onClick={() => navigate('/')}
            className="bg-sowama-soil hover:bg-sowama-soilDark text-white"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-8 min-h-screen relative">
      <FloatingParticles quantity={15} type="mixed" speed="slow" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-sowama-soilDark">Marketplace</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {currentUser.points} <span className="text-xs">pts</span>
          </div>
        </div>
      </div>
      
      <MotivationalMessage 
        message="¡Tus puntos ayudan a construir un futuro mejor!" 
        icon="🎁" 
        className="mb-6"
      />
      
      {/* Categories */}
      <Tabs defaultValue="all" value={category} onValueChange={setCategory} className="mb-6">
        <TabsList className="w-full h-auto flex overflow-x-auto py-1 bg-muted/50">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="flex-shrink-0 capitalize"
            >
              {cat === "all" ? "Todos" : cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <EcoCard
            key={product.id}
            title={product.name}
            description={product.description}
            image={product.image}
            points={product.points}
            eco={product.eco}
            actionText="Canjear"
            actionDisabled={currentUser.points < product.points}
            onAction={() => handleRedeemClick(product.id)}
            className="h-full"
          />
        ))}
      </div>
      
      {/* Confirmation Dialog */}
      {product && (
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar canje</DialogTitle>
              <DialogDescription>
                {canPurchase 
                  ? "¿Estás seguro de que quieres canjear este producto?"
                  : "No tienes suficientes puntos para este canje."}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-4">
                {product.image && (
                  <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.points} puntos
                  </p>
                </div>
              </div>
              {!canPurchase && (
                <div className="mt-4 bg-destructive/10 p-3 rounded-md text-sm text-destructive">
                  Te faltan {product.points - currentUser.points} puntos para este canje.
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-sowama-soil hover:bg-sowama-soilDark text-white"
                disabled={!canPurchase}
                onClick={handleConfirmPurchase}
              >
                <Gift className="mr-2 h-4 w-4" />
                Confirmar canje
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
