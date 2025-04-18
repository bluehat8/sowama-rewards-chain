
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MotivationalMessageProps {
  message?: string;
  icon?: string;
  className?: string;
  autoRotate?: boolean;
}

const MESSAGES = [
  { text: "¡Cada acción cuenta!", icon: "🌱" },
  { text: "Juntos construimos un futuro mejor", icon: "🌍" },
  { text: "¡Gracias por ser parte del cambio!", icon: "💚" },
  { text: "Tu acción ayuda a reducir emisiones de CO₂", icon: "🌱" },
  { text: "¡Tus puntos pueden cambiar el mundo!", icon: "🌍" },
  { text: "¡Gracias por cuidar el planeta!", icon: "💚" },
  { text: "Tus puntos ayudan a construir un futuro mejor", icon: "🌱" },
];

export function MotivationalMessage({
  message,
  icon,
  className,
  autoRotate = false,
}: MotivationalMessageProps) {
  const [currentMessage, setCurrentMessage] = useState({ 
    text: message || MESSAGES[0].text, 
    icon: icon || MESSAGES[0].icon 
  });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MESSAGES.length);
      setCurrentMessage(MESSAGES[randomIndex]);
      setKey(prev => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRotate]);

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-gradient-to-r from-sowama-leaf/10 to-sowama-sky/10 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/30",
        className
      )}
    >
      <p className="text-sowama-leafDark flex items-center justify-center gap-2 font-medium">
        <span className="text-xl">{currentMessage.icon}</span>
        <span>{currentMessage.text}</span>
      </p>
    </motion.div>
  );
}

export default MotivationalMessage;
