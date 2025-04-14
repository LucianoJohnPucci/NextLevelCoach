
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./types";

interface TitleFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export const TitleField = ({ form }: TitleFieldProps) => (
  <FormField
    control={form.control}
    name="title"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Event Title</FormLabel>
        <FormControl>
          <Input placeholder="Enter event title" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface LocationFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export const LocationField = ({ form }: LocationFieldProps) => (
  <FormField
    control={form.control}
    name="location"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Location</FormLabel>
        <FormControl>
          <Input placeholder="Enter event location" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface DateFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export const DateField = ({ form }: DateFieldProps) => (
  <FormField
    control={form.control}
    name="event_date"
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>Event Date & Time</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Select event date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface NotesFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export const NotesField = ({ form }: NotesFieldProps) => (
  <FormField
    control={form.control}
    name="notes"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Special Notes</FormLabel>
        <FormControl>
          <Textarea 
            placeholder="Add any special notes or details about the event" 
            {...field} 
            className="min-h-24"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface PricingFieldsProps {
  form: UseFormReturn<EventFormValues>;
  isFree: boolean;
  setIsFree: (value: boolean) => void;
}

export const PricingFields = ({ form, isFree, setIsFree }: PricingFieldsProps) => (
  <>
    <div className="flex items-center space-x-2">
      <FormField
        control={form.control}
        name="is_free"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
            <div className="space-y-0.5">
              <FormLabel>Free Event</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  setIsFree(checked);
                  if (checked) {
                    form.setValue("ticket_cost", 0);
                  }
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>

    {!isFree && (
      <FormField
        control={form.control}
        name="ticket_cost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ticket Cost ($)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0.01" 
                step="0.01" 
                placeholder="Enter ticket price" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )}
  </>
);

interface ParticipantsFieldProps {
  form: UseFormReturn<EventFormValues>;
}

export const ParticipantsField = ({ form }: ParticipantsFieldProps) => (
  <FormField
    control={form.control}
    name="max_participants"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Maximum Participants</FormLabel>
        <FormControl>
          <Input 
            type="number" 
            min="1" 
            step="1" 
            placeholder="Enter maximum number of participants" 
            {...field}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface FormButtonsProps {
  onCancel: () => void;
}

export const FormButtons = ({ onCancel }: FormButtonsProps) => (
  <div className="flex justify-end space-x-2 pt-4">
    <Button variant="outline" type="button" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit">Create Event</Button>
  </div>
);
