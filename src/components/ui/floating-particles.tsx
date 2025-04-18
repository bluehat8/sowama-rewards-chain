
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FloatingParticlesProps {
  className?: string;
  quantity?: number;
  type?: "leaves" | "drops" | "mixed";
  speed?: "slow" | "normal" | "fast";
}

export function FloatingParticles({
  className,
  quantity = 10,
  type = "mixed",
  speed = "normal"
}: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Speed multiplier based on the speed prop
  const speedMultiplier = speed === "slow" ? 0.5 : speed === "fast" ? 1.5 : 1;

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];
    
    // Clear any existing particles
    container.innerHTML = "";
    
    // Create particles
    for (let i = 0; i < quantity; i++) {
      const particle = document.createElement("div");
      
      // Determine particle type
      const particleType = type === "mixed"
        ? Math.random() > 0.5 ? "leaves" : "drops"
        : type;
      
      // Set particle content based on type
      if (particleType === "leaves") {
        particle.textContent = ["🌿", "🍃", "🌱", "☘️", "🍂"][Math.floor(Math.random() * 5)];
      } else {
        particle.textContent = ["💧", "💦"][Math.floor(Math.random() * 2)];
      }
      
      // Apply styles to particle
      particle.style.position = "absolute";
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.fontSize = `${Math.random() * 10 + 10}px`;
      particle.style.opacity = `${Math.random() * 0.6 + 0.2}`;
      particle.style.pointerEvents = "none";
      particle.style.transition = "transform 0.5s ease-out";
      
      container.appendChild(particle);
      particles.push(particle);
      
      // Set initial positions outside the viewport
      const startX = Math.random() * 100;
      const startY = -20;
      
      // Animate particles
      const duration = (Math.random() * 10 + 10) / speedMultiplier;
      const delay = Math.random() * 10;
      
      particle.animate(
        [
          { transform: `translate(${startX}vw, ${startY}vh) rotate(0deg)` },
          { transform: `translate(${startX + Math.random() * 20 - 10}vw, 120vh) rotate(${Math.random() * 360}deg)` },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          iterations: Infinity,
          easing: "linear",
        }
      );
    }
    
    return () => {
      // Clean up animations when component unmounts
      particles.forEach(particle => {
        const animations = particle.getAnimations();
        animations.forEach(animation => animation.cancel());
      });
    };
  }, [quantity, type, speed, speedMultiplier]);
  
  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}

export default FloatingParticles;
