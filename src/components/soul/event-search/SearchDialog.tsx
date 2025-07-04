
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import SearchForm from "./SearchForm";
import DateEventPreview from "./DateEventPreview";
import { Event } from "@/hooks/community-events";

interface SearchDialogProps {
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

const SearchDialog = ({
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
}: SearchDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Search Events</DialogTitle>
        <DialogDescription>
          Search for community events by location, date, or price.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <SearchForm
          searchLocation={searchLocation}
          setSearchLocation={setSearchLocation}
          searchDate={searchDate}
          setSearchDate={setSearchDate}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          eventDates={eventDates}
          isMobile={false}
        />

        {/* Preview section for events on selected date */}
        <DateEventPreview 
          searchDate={searchDate} 
          eventsOnSelectedDate={eventsOnSelectedDate} 
          onJoin={onJoin}
          onSelectEvent={() => setIsSearchOpen(false)}
        />
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
};

export default SearchDialog;
