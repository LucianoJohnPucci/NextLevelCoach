
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Search, X } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";

interface EventSearchProps {
  onSearch: (location: string, date: Date | undefined) => void;
  onClearFilter: () => void;
}

const EventSearch = ({ onSearch, onClearFilter }: EventSearchProps) => {
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSearch = () => {
    onSearch(searchLocation, searchDate);
    setIsSearchOpen(false);
  };

  const handleClearFilter = () => {
    setSearchLocation("");
    setSearchDate(undefined);
    onClearFilter();
    setIsSearchOpen(false);
  };

  const SearchDialog = () => (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Search Events</DialogTitle>
        <DialogDescription>
          Search for community events by location or date.
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
          <label className="text-sm font-medium">Date</label>
          <Calendar
            mode="single"
            selected={searchDate}
            onSelect={setSearchDate}
            className="rounded-md border"
          />
        </div>
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
          Search for community events by location or date.
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
          <label className="text-sm font-medium">Date</label>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={searchDate}
              onSelect={setSearchDate}
              className="rounded-md border"
            />
          </div>
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
