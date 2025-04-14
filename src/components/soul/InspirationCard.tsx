
import { motion } from "framer-motion";

interface InspirationCardProps { 
  quote: string;
  author: string;
  delay: number;
}

const InspirationCard = ({ 
  quote, 
  author, 
  delay 
}: InspirationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-lg bg-primary/5 p-6"
    >
      <p className="mb-4 text-lg italic">{quote}</p>
      <p className="text-right font-medium">— {author}</p>
    </motion.div>
  );
};

export default InspirationCard;
