
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, PenTool } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

const MindPage = () => {
  const { user } = useAuth();
  const [readCount, setReadCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  
  const handleReadClick = () => {
    const newCount = readCount + 1;
    setReadCount(newCount);
    if (user) {
      toast.success("Reading session recorded!");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
  const handleLearnClick = () => {
    const newCount = learnCount + 1;
    setLearnCount(newCount);
    if (user) {
      toast.success("Learning session recorded!");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
  const handleJournalClick = () => {
    const newCount = journalCount + 1;
    setJournalCount(newCount);
    if (user) {
      toast.success("Journal entry recorded!");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Mind</h1>
        <p className="text-muted-foreground">
          Daily check-ins for mental growth and learning.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleReadClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-blue-100 p-3 text-blue-600">
                <BookOpen className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Read</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {readCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Reading sessions today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReadClick();
                }}
              >
                + Add Reading
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleLearnClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-green-100 p-3 text-green-600">
                <GraduationCap className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Learned</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {learnCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Learning sessions today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLearnClick();
                }}
              >
                + Add Learning
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleJournalClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-purple-100 p-3 text-purple-600">
                <PenTool className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Journal</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {journalCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Journal entries today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJournalClick();
                }}
              >
                + Add Entry
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        className="max-w-2xl mx-auto text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="rounded-lg bg-primary/5 p-6">
          <h3 className="text-lg font-semibold mb-2">Today's Mind Progress</h3>
          <p className="text-muted-foreground">
            Keep nurturing your mental growth through daily reading, learning, and journaling.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MindPage;
