
import { Event } from "@/hooks/community-events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Tag, Plus } from "lucide-react";

interface DateEventPreviewProps {
  searchDate: Date | undefined;
  eventsOnSelectedDate: Event[];
  onJoin: (id: string) => void;
  onSelectEvent?: (id: string) => void;
}

const DateEventPreview = ({ 
  searchDate, 
  eventsOnSelectedDate, 
  onJoin,
  onSelectEvent
}: DateEventPreviewProps) => {
  if (!searchDate || eventsOnSelectedDate.length === 0) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-medium mb-2">
        Events on {searchDate.toLocaleDateString()}: ({eventsOnSelectedDate.length})
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {eventsOnSelectedDate.map((event) => (
          <Card key={event.id} className="shadow-sm border">
            <CardHeader className="py-3 px-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {event.title}
                {event.is_open ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 text-xs dark:bg-green-900 dark:text-green-100">Open</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 text-xs dark:bg-gray-700 dark:text-gray-100">Closed</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{event.participants} participants</span>
                </div>
                {event.ticket_cost !== null && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>${event.ticket_cost.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-2 flex justify-end">
              <Button 
                size="sm" 
                className="h-7 text-xs"
                disabled={!event.is_open}
                onClick={() => {
                  onJoin(event.id);
                  if (onSelectEvent) onSelectEvent(event.id);
                }}
              >
                <Plus className="h-3 w-3 mr-1" /> 
                Add to List
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DateEventPreview;
