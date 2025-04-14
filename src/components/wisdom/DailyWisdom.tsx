
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { stoicWisdom } from "@/data/stoicWisdom";

const DailyWisdom = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Wisdom</CardTitle>
        <CardDescription>
          Stoic quotes to inspire your day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stoicWisdom.map((wisdom, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-lg bg-primary/5 p-4"
            >
              <p className="mb-2 text-sm italic">{wisdom.quote}</p>
              <p className="text-right text-xs font-medium">— {wisdom.author}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyWisdom;
