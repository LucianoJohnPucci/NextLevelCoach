
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import InspirationCard from "./InspirationCard";

const InspirationSection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Daily Inspiration</CardTitle>
          <CardDescription>
            Philosophical wisdom to contemplate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InspirationCard
            quote="The happiness of your life depends upon the quality of your thoughts."
            author="Marcus Aurelius"
            delay={0.1}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InspirationSection;
