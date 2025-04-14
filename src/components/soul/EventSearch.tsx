
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Search, X, Calendar as CalendarIcon, DollarSign, Filter, Plus } from "lucide-react";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Event } from "@/hooks/use-community-events";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Users, Tag } from "lucide-react";

interface EventSearchProps {
  onSearch: (location: string, date: Date | undefined, priceFilter: string | null) => void;
  onClearFilter: () => void;
  eventDates?: Date[]; // Dates that have events
  eventsOnSelectedDate?: Event[];
  onJoin: (id: string) => void;
}

const EventSearch = ({ onSearch, onClearFilter, eventDates = [], eventsOnSelectedDate = [], onJoin }: EventSearchProps) => {
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const [priceFilter, setPriceFilter] = useState<string | null>(null); // "free", "paid", or null
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSearchDate(date);
  };

  const handleSearch = () => {
    onSearch(searchLocation, searchDate, priceFilter);
    setIsSearchOpen(false);
  };

  const handleClearFilter = () => {
    setSearchLocation("");
    setSearchDate(undefined);
    setPriceFilter(null);
    onClearFilter();
    setIsSearchOpen(false);
  };

  // Function to determine if a date has events
  const isDateWithEvent = (date: Date) => {
    return eventDates.some(eventDate => 
      eventDate.getDate() === date.getDate() && 
      eventDate.getMonth() === date.getMonth() && 
      eventDate.getFullYear() === date.getFullYear()
    );
  };

  // Custom modifier for the calendar
  const modifiers = {
    hasEvent: eventDates.map(date => new Date(date)),
  };

  // Custom modifier styles
  const modifiersStyles = {
    hasEvent: {
      backgroundColor: "#e5deff", // Light purple background for dates with events
      color: "#6E59A5", // Purple text color
      fontWeight: "bold" as const
    }
  };

  // Preview of events on selected date
  const DateEventPreview = () => {
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
                    setIsSearchOpen(false);
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

  const SearchDialog = () => (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Search Events</DialogTitle>
        <DialogDescription>
          Search for community events by location, date, or price.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="location"
            placeholder="Enter city or venue"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2">
          <label className="text-sm font-medium">Price</label>
          <RadioGroup 
            value={priceFilter || ""} 
            onValueChange={(value) => setPriceFilter(value === "" ? null : value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="free" />
              <Label htmlFor="free">Free</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paid" id="paid" />
              <Label htmlFor="paid">Paid</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="any" />
              <Label htmlFor="any">Any</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid gap-2">
          <label className="text-sm font-medium">Date</label>
          <Calendar
            mode="single"
            selected={searchDate}
            onSelect={handleDateSelect}
            className="rounded-md border pointer-events-auto"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
          <p className="text-xs text-muted-foreground mt-1">
            <span className="inline-block w-3 h-3 bg-[#e5deff] rounded-full mr-1"></span>
            Dates with events are highlighted
          </p>
        </div>

        {/* Preview section for events on selected date */}
        <DateEventPreview />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleClearFilter} variant="secondary" className="mr-2">
          <X className="h-4 w-4 mr-2" /> Clear Filter
        </Button>
        <Button onClick={handleSearch}>Search</Button>
      </DialogFooter>
    </DialogContent>
  );

  const SearchDrawer = () => (
    <DrawerContent>
      <DrawerHeader className="text-left">
        <DrawerTitle>Search Events</DrawerTitle>
        <DrawerDescription>
          Search for community events by location, date, or price.
        </DrawerDescription>
      </DrawerHeader>
      <div className="px-4">
        <div className="grid gap-2 mb-4">
          <label htmlFor="location-mobile" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="location-mobile"
            placeholder="Enter city or venue"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
        
        <div className="grid gap-2 mb-4">
          <label className="text-sm font-medium">Price</label>
          <RadioGroup 
            value={priceFilter || ""} 
            onValueChange={(value) => setPriceFilter(value === "" ? null : value)}
            className="flex justify-between px-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="free-mobile" />
              <Label htmlFor="free-mobile">Free</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paid" id="paid-mobile" />
              <Label htmlFor="paid-mobile">Paid</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="any-mobile" />
              <Label htmlFor="any-mobile">Any</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid gap-2 mb-4">
          <label className="text-sm font-medium">Date</label>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={searchDate}
              onSelect={handleDateSelect}
              className="rounded-md border pointer-events-auto"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            <span className="inline-block w-3 h-3 bg-[#e5deff] rounded-full mr-1"></span>
            Dates with events are highlighted
          </p>
        </div>

        {/* Preview section for events on selected date */}
        <div className="mb-4">
          <DateEventPreview />
        </div>
      </div>
      <DrawerFooter className="pt-2">
        <Button onClick={handleSearch}>Search Events</Button>
        <Button onClick={handleClearFilter} variant="secondary" className="mr-2">
          <X className="h-4 w-4 mr-2" /> Clear Filter
        </Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Search className="h-4 w-4" /> Search Global Calendar
            </Button>
          </DrawerTrigger>
          <SearchDrawer />
        </Drawer>
      ) : (
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Search className="h-4 w-4" /> Search Global Calendar
            </Button>
          </DialogTrigger>
          <SearchDialog />
        </Dialog>
      )}
    </>
  );
};

export default EventSearch;
