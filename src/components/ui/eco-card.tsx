
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";

interface EcoCardProps {
  title: string;
  description?: string;
  image?: string;
  points: number;
  eco?: boolean;
  actionText?: string;
  actionDisabled?: boolean;
  onAction?: () => void;
  className?: string;
  footer?: React.ReactNode;
  progress?: {
    current: number;
    total: number;
  };
}

export function EcoCard({
  title,
  description,
  image,
  points,
  eco = false,
  actionText,
  actionDisabled = false,
  onAction,
  className,
  footer,
  progress
}: EcoCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-sowama-paper border-sowama-leaf/10",
        className
      )}
    >
      {image && (
        <div className="aspect-[4/3] w-full overflow-hidden relative">
          <img 
            src={image} 
            alt={title}
            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105" 
          />
          {eco && (
            <Badge 
              variant="outline" 
              className="absolute top-2 right-2 bg-sowama-leafLight/80 text-white font-medium backdrop-blur-sm border-none shadow-sm"
            >
              Eco
            </Badge>
          )}
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-sowama-leafDark">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        {progress && (
          <div className="space-y-1">
            <div className="h-2 bg-sowama-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-sowama-leaf rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {progress.current.toLocaleString()} de {progress.total.toLocaleString()} puntos
            </p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-sowama-leafDark flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Puntos:</span> {points.toLocaleString()}
          </div>
          {actionText && onAction && (
            <Button 
              onClick={onAction} 
              disabled={actionDisabled}
              className="bg-sowama-leaf hover:bg-sowama-leafDark text-white"
            >
              {actionText}
            </Button>
          )}
        </div>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

export default EcoCard;
