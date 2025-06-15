
import { Brain, Heart, Sparkles, Target } from "lucide-react";

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case "brain": return Brain;
    case "heart": return Heart;
    case "sparkles": return Sparkles;
    default: return Target;
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "mind": return "bg-blue-100 text-blue-800";
    case "body": return "bg-green-100 text-green-800"; 
    case "soul": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
};
