
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import SearchForm from "./SearchForm";
import DateEventPreview from "./DateEventPreview";
import { Event } from "@/hooks/use-community-events";

interface SearchDrawerProps {
  searchLocation: string;
  setSearchLocation: (location: string) => void;
  searchDate: Date | undefined;
  setSearchDate: (date: Date | undefined) => void;
  priceFilter: string | null;
  setPriceFilter: (filter: string | null) => void;
  eventDates: Date[];
  eventsOnSelectedDate: Event[];
  handleSearch: () => void;
  handleClearFilter: () => void;
  onJoin: (id: string) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const SearchDrawer = ({
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
}: SearchDrawerProps) => {
  return (
    <DrawerContent>
      <DrawerHeader className="text-left">
        <DrawerTitle>Search Events</DrawerTitle>
        <DrawerDescription>
          Search for community events by location, date, or price.
        </DrawerDescription>
      </DrawerHeader>
      <div className="px-4">
        <SearchForm
          searchLocation={searchLocation}
          setSearchLocation={setSearchLocation}
          searchDate={searchDate}
          setSearchDate={setSearchDate}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          eventDates={eventDates}
          isMobile={true}
        />

        {/* Preview section for events on selected date */}
        <div className="mb-4">
          <DateEventPreview 
            searchDate={searchDate} 
            eventsOnSelectedDate={eventsOnSelectedDate} 
            onJoin={onJoin}
            onSelectEvent={() => setIsSearchOpen(false)}
          />
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
};

export default SearchDrawer;
