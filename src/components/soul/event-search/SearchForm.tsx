
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SearchFormProps {
  searchLocation: string;
  setSearchLocation: (location: string) => void;
  searchDate: Date | undefined;
  setSearchDate: (date: Date | undefined) => void;
  priceFilter: string | null;
  setPriceFilter: (filter: string | null) => void;
  eventDates: Date[];
  isMobile: boolean;
}

const SearchForm = ({
  searchLocation,
  setSearchLocation,
  searchDate,
  setSearchDate,
  priceFilter,
  setPriceFilter,
  eventDates,
  isMobile
}: SearchFormProps) => {
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

  return (
    <>
      <div className={isMobile ? "grid gap-2 mb-4" : "grid gap-2"}>
        <label htmlFor={isMobile ? "location-mobile" : "location"} className="text-sm font-medium">
          Location
        </label>
        <Input
          id={isMobile ? "location-mobile" : "location"}
          placeholder="Enter city or venue"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
      </div>
      
      <div className={isMobile ? "grid gap-2 mb-4" : "grid gap-2"}>
        <label className="text-sm font-medium">Price</label>
        <RadioGroup 
          value={priceFilter || ""} 
          onValueChange={(value) => setPriceFilter(value === "" ? null : value)}
          className={isMobile ? "flex justify-between px-4" : "flex space-x-4"}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="free" id={isMobile ? "free-mobile" : "free"} />
            <Label htmlFor={isMobile ? "free-mobile" : "free"}>Free</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paid" id={isMobile ? "paid-mobile" : "paid"} />
            <Label htmlFor={isMobile ? "paid-mobile" : "paid"}>Paid</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id={isMobile ? "any-mobile" : "any"} />
            <Label htmlFor={isMobile ? "any-mobile" : "any"}>Any</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className={isMobile ? "grid gap-2 mb-4" : "grid gap-2"}>
        <label className="text-sm font-medium">Date</label>
        <div className={isMobile ? "flex justify-center" : ""}>
          <Calendar
            mode="single"
            selected={searchDate}
            onSelect={setSearchDate}
            className="rounded-md border pointer-events-auto"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </div>
        <p className={`text-xs text-muted-foreground mt-1 ${isMobile ? "text-center" : ""}`}>
          <span className="inline-block w-3 h-3 bg-[#e5deff] rounded-full mr-1"></span>
          Dates with events are highlighted
        </p>
      </div>
    </>
  );
};

export default SearchForm;
