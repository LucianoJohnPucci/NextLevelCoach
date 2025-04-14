
import React from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  action: string | React.ReactNode;
  delay: number;
}

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  delay 
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="mb-2 rounded-lg bg-primary/10 p-2 w-fit text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full">
            {typeof action === 'string' ? action : action}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
