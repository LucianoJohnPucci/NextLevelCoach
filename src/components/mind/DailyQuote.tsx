
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface DailyQuoteProps {
  quote: string;
  author: string;
  delay?: number;
}

const DailyQuote = ({ quote, author, delay = 0.5 }: DailyQuoteProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Quote of the Day</CardTitle>
          <CardDescription>
            A thought to ponder and apply to your life.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-primary/5 p-6 text-center">
            <p className="mb-4 text-lg italic">
              "{quote}"
            </p>
            <p className="font-medium">— {author}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyQuote;
