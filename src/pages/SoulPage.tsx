
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Book, Users, Heart, Music, Award, ArrowRight, BookOpen, Play, Clock, Bookmark } from "lucide-react";

const PracticeCard = ({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  delay 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  action: string; 
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="mb-2 w-fit rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full">
            {action} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const ReadingItem = ({ 
  title, 
  author, 
  duration,
  index
}: { 
  title: string; 
  author: string; 
  duration: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="flex justify-between rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {duration}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">By {author}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost">
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button size="icon">
          <BookOpen className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

const InspirationCard = ({ 
  quote, 
  author, 
  delay 
}: { 
  quote: string; 
  author: string; 
  delay: number;
}) => {
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

const CommunityEvent = ({ 
  title, 
  date, 
  participants,
  index
}: { 
  title: string; 
  date: string; 
  participants: number;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="flex justify-between rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{date}</span>
          <span>•</span>
          <Users className="h-3 w-3" />
          <span>{participants} participating</span>
        </div>
      </div>
      <Button>Join</Button>
    </motion.div>
  );
};

const SoulPage = () => {
  const readings = [
    {
      title: "Meditations",
      author: "Marcus Aurelius",
      duration: "15 min"
    },
    {
      title: "Letters from a Stoic",
      author: "Seneca",
      duration: "20 min"
    },
    {
      title: "The Enchiridion",
      author: "Epictetus",
      duration: "10 min"
    }
  ];
  
  const events = [
    {
      title: "Group Meditation Session",
      date: "Tomorrow, 7:00 PM",
      participants: 24
    },
    {
      title: "Stoicism Discussion Group",
      date: "Saturday, 3:00 PM",
      participants: 18
    },
    {
      title: "Mindful Walking Practice",
      date: "Sunday, 9:00 AM",
      participants: 12
    }
  ];
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Soul</h1>
        <p className="text-muted-foreground">
          Resources for spiritual growth and inner peace.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <PracticeCard
          title="Daily Reflection"
          description="Take time to reflect on your values and principles."
          icon={Sparkles}
          action="Start Reflection"
          delay={0.1}
        />
        <PracticeCard
          title="Meaningful Connections"
          description="Join community events and discussions."
          icon={Users}
          action="View Events"
          delay={0.2}
        />
        <PracticeCard
          title="Gratitude Practice"
          description="Cultivate thankfulness for life's gifts."
          icon={Heart}
          action="Begin Practice"
          delay={0.3}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Philosophical Readings
              </CardTitle>
              <CardDescription>
                Explore stoic texts and philosophical wisdom.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {readings.map((reading, index) => (
                  <ReadingItem 
                    key={index}
                    title={reading.title}
                    author={reading.author}
                    duration={reading.duration}
                    index={index}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Browse Library
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Guided Practices
              </CardTitle>
              <CardDescription>
                Soul-nourishing audio guides.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between rounded-lg border bg-card p-4 shadow-sm">
                <div className="space-y-1">
                  <h3 className="font-medium">Gratitude Meditation</h3>
                  <p className="text-sm text-muted-foreground">10 minutes</p>
                </div>
                <Button size="icon">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between rounded-lg border bg-card p-4 shadow-sm">
                <div className="space-y-1">
                  <h3 className="font-medium">Inner Peace</h3>
                  <p className="text-sm text-muted-foreground">15 minutes</p>
                </div>
                <Button size="icon">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                See All Guides
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
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
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Events
            </CardTitle>
            <CardDescription>
              Connect with like-minded individuals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event, index) => (
                <CommunityEvent 
                  key={index}
                  title={event.title}
                  date={event.date}
                  participants={event.participants}
                  index={index}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Events
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SoulPage;
