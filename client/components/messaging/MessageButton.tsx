import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageButtonProps {
  userId: string;
  userName?: string;
  variant?: "default" | "outline" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick: (userId: string, userName?: string) => void;
  children?: React.ReactNode;
}

export const MessageButton: React.FC<MessageButtonProps> = ({
  userId,
  userName,
  variant = "default",
  size = "md",
  className,
  onClick,
  children,
}) => {
  const handleClick = () => {
    onClick(userId, userName);
  };

  const buttonSizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-6 text-sm",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (variant === "icon") {
    return (
      <Button
        onClick={handleClick}
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full p-2 hover:bg-primary/10 hover:text-primary transition-colors",
          className,
        )}
        title={`Message ${userName || "user"}`}
      >
        <MessageCircle className={iconSizes[size]} />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      className={cn(
        buttonSizes[size],
        "font-medium transition-all duration-200 hover:shadow-md active:scale-95",
        variant === "default" &&
          "bg-primary hover:bg-primary/90 text-white shadow-sm",
        variant === "outline" &&
          "border-primary text-primary hover:bg-primary hover:text-white",
        variant === "ghost" && "text-primary hover:bg-primary/10",
        className,
      )}
    >
      <MessageCircle className={cn(iconSizes[size], children && "mr-2")} />
      {children || "Message"}
    </Button>
  );
};
