
export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  avatar: string;
}

export interface Activity {
  id: string;
  type: "delivery" | "redeem" | "donation";
  description: string;
  points: number;
  timestamp: string;
  icon: string;
}

export interface WasteType {
  id: string;
  name: string;
  icon: string;
  pointsPerKg: number;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  points: number;
  eco: boolean;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  pointsNeeded: number;
  currentPoints: number;
  totalPoints: number;
  impact: string;
}

export interface Environmental {
  co2Avoided: number;
  compostGenerated: number;
  biogasProduced: number;
  treesEquivalent: number;
}
