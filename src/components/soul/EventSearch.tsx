
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { 
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Event } from "@/hooks/community-events";
import SearchDialog from "./event-search/SearchDialog";
import SearchDrawer from "./event-search/SearchDrawer";

interface EventSearchProps {
  onSearch: (location: string, date: Date | undefined, priceFilter: string | null) => void;
  onClearFilter: () => void;
  eventDates?: Date[]; // Dates that have events
  eventsOnSelectedDate?: Event[];
  onJoin: (id: string) => void;
}

const EventSearch = ({ 
  onSearch, 
  onClearFilter, 
  eventDates = [], 
  eventsOnSelectedDate = [], 
  onJoin 
}: EventSearchProps) => {
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const [priceFilter, setPriceFilter] = useState<string | null>(null); // "free", "paid", or null
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

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

  const commonProps = {
    searchLocation,
    setSearchLocation,
    searchDate,
    setSearchDate,
    priceFilter,
    setPriceFilter,
    eventDates,
    eventsOnSelectedDate,
    handleSearch,
    handleClearFilter,
    onJoin,
    setIsSearchOpen
  };

  return (
    <>
      {isMobile ? (
        <Drawer open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Search className="h-4 w-4" /> Search Global Calendar
            </Button>
          </DrawerTrigger>
          <SearchDrawer {...commonProps} />
        </Drawer>
      ) : (
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Search className="h-4 w-4" /> Search Global Calendar
            </Button>
          </DialogTrigger>
          <SearchDialog {...commonProps} />
        </Dialog>
      )}
    </>
  );
};

export default EventSearch;
