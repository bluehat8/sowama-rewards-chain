
import { User, WasteType, Product, Project } from "@/lib/types";
import blockchainService from "./blockchainService";

// Mock data for demonstration purposes
// In a real app, this would come from a backend API

// Current user
export const currentUser: User = {
  id: "user123",
  name: "María García",
  email: "maria@example.com",
  points: 1250,
  avatar: "https://i.pravatar.cc/150?img=29",
};

// Waste types
export const wasteTypes: WasteType[] = [
  {
    id: "food",
    name: "Restos de comida",
    icon: "🍎",
    pointsPerKg: 20,
    color: "#8FD275",
  },
  {
    id: "garden",
    name: "Residuos de jardín",
    icon: "🌿",
    pointsPerKg: 15,
    color: "#5EB247",
  },
  {
    id: "coffee",
    name: "Café y filtros",
    icon: "☕",
    pointsPerKg: 25,
    color: "#A67C52",
  },
  {
    id: "eggshells",
    name: "Cáscaras de huevo",
    icon: "🥚",
    pointsPerKg: 30,
    color: "#D4AA80",
  },
];

// Products for marketplace
export const products: Product[] = [
  {
    id: "prod1",
    name: "Compost Premium",
    description: "5kg de compost de alta calidad para tus plantas",
    image: "/placeholder.svg",
    points: 200,
    eco: true,
    category: "Jardinería",
  },
  {
    id: "prod2",
    name: "Kit de Jardinería",
    description: "Set de herramientas ecológicas para tu jardín",
    image: "/placeholder.svg",
    points: 350,
    eco: true,
    category: "Jardinería",
  },
  {
    id: "prod3",
    name: "Semillas Orgánicas",
    description: "Pack de semillas orgánicas de temporada",
    image: "/placeholder.svg",
    points: 150,
    eco: true,
    category: "Jardinería",
  },
  {
    id: "prod4",
    name: "Bolsas Compostables",
    description: "Pack de 50 bolsas 100% compostables",
    image: "/placeholder.svg",
    points: 100,
    eco: true,
    category: "Hogar",
  },
  {
    id: "prod5",
    name: "Botella Reutilizable",
    description: "Botella de acero inoxidable de 750ml",
    image: "/placeholder.svg",
    points: 230,
    eco: true,
    category: "Hogar",
  },
  {
    id: "prod6",
    name: "Curso de Compostaje",
    description: "Curso online de técnicas de compostaje en casa",
    image: "/placeholder.svg",
    points: 180,
    eco: true,
    category: "Educación",
  },
  {
    id: "prod7",
    name: "Buzz Lightyear",
    description: "Buzz ligth year game",
    image: "/placeholder.svg",
    points: 150,
    eco: true,
    category: "Entretenimiento",
  },
];

// Environmental projects
export const projects: Project[] = [
  {
    id: "proj1",
    name: "Reforestación Amazónica",
    description: "Ayuda a plantar árboles nativos en zonas deforestadas de la Amazonía",
    image: "/placeholder.svg",
    pointsNeeded: 500,
    currentPoints: 320,
    totalPoints: 10000,
    impact: "Cada 500 puntos = 1 árbol plantado",
  },
  {
    id: "proj2",
    name: "Energía Solar Rural",
    description: "Instalación de paneles solares en comunidades sin acceso a electricidad",
    image: "/placeholder.svg",
    pointsNeeded: 1000,
    currentPoints: 750,
    totalPoints: 20000,
    impact: "Cada 1000 puntos = 1 panel solar",
  },
  {
    id: "proj3",
    name: "Limpieza de Océanos",
    description: "Recuperación de plásticos en zonas costeras contaminadas",
    image: "/placeholder.svg",
    pointsNeeded: 300,
    currentPoints: 210,
    totalPoints: 5000,
    impact: "Cada 300 puntos = 5kg de plástico recuperado",
  },
  {
    id: "proj4",
    name: "Educación Ambiental",
    description: "Talleres de educación ambiental para escuelas rurales",
    image: "/placeholder.svg",
    pointsNeeded: 200,
    currentPoints: 130,
    totalPoints: 3000,
    impact: "Cada 200 puntos = 1 taller educativo",
  },
];

// Service functions that interact with blockchain behind the scenes
export async function getUserData(): Promise<User> {
  // Initialize blockchain wallet silently
  await blockchainService.initializeWallet(currentUser.id);
  
  // Get points from blockchain
  const points = await blockchainService.getUserPoints(currentUser.id);
  
  // Update local user data
  currentUser.points = points;
  
  return currentUser;
}

export async function deliverWaste(wasteTypeId: string, kilograms: number): Promise<boolean> {
  const wasteType = wasteTypes.find(w => w.id === wasteTypeId);
  if (!wasteType) return false;
  
  const points = wasteType.pointsPerKg * kilograms;
  
  // Add points through blockchain (invisibly to user)
  const success = await blockchainService.addPoints(currentUser.id, points);
  
  if (success) {
    currentUser.points += points;
  }
  
  return success;
}

export async function redeemProduct(productId: string): Promise<boolean> {
  const product = products.find(p => p.id === productId);
  if (!product) return false;
  
  // Use points through blockchain (invisibly to user)
  const success = await blockchainService.usePoints(currentUser.id, product.points);
  
  if (success) {
    currentUser.points -= product.points;
  }
  
  return success;
}

export async function donateToProject(projectId: string, points: number): Promise<boolean> {
  const project = projects.find(p => p.id === projectId);
  if (!project) return false;
  
  // Donate points through blockchain (invisibly to user)
  const success = await blockchainService.donateToProject(currentUser.id, projectId, points);
  
  if (success) {
    currentUser.points -= points;
    
    // Update project data
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex >= 0) {
      projects[projectIndex].currentPoints += points;
    }
  }
  
  return success;
}

export default {
  currentUser,
  wasteTypes,
  products,
  projects,
  getUserData,
  deliverWaste,
  redeemProduct,
  donateToProject,
};
