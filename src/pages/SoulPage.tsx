import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import PracticesSection from "@/components/soul/PracticesSection";
import ReadingsSection from "@/components/soul/ReadingsSection";
import ReflectionsSection from "@/components/soul/ReflectionsSection";
import { useAuth } from "@/hooks/useAuth";
import DailyReflectionsSection from "@/components/soul/DailyReflectionsSection";

const SoulPage = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Soul Practices
          </CardTitle>
          <CardDescription>
            Engage in practices that nurture your inner self and promote spiritual growth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PracticesSection />
        </CardContent>
      </Card>

      <ReadingsSection
        readings={[
          {
            title: "Meditations",
            author: "Marcus Aurelius",
            duration: "20 min",
            minutes: 20,
          },
          {
            title: "Letters from a Stoic",
            author: "Seneca",
            duration: "30 min",
            minutes: 30,
          },
          {
            title: "Discourses",
            author: "Epictetus",
            duration: "25 min",
            minutes: 25,
          },
        ]}
      />

      <ReflectionsSection />
      
      <DailyReflectionsSection />
    </motion.div>
  );
};

export default SoulPage;

