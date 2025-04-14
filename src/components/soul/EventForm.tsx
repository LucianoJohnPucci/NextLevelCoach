
import { useState } from "react";
import { format } from "date-fns";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  location: z.string().min(3, { message: "Location is required" }),
  event_date: z.date({ required_error: "Event date is required" }),
  notes: z.string().optional(),
  is_free: z.boolean().default(true),
  ticket_cost: z.number().optional(),
  max_participants: z.number().min(1, { message: "Minimum of 1 participant required" }),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  onSubmit: (data: EventFormValues) => Promise<void>;
  onCancel: () => void;
}

const EventForm = ({ onSubmit, onCancel }: EventFormProps) => {
  const [isFree, setIsFree] = useState(true);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      location: "",
      notes: "",
      is_free: true,
      ticket_cost: 0,
      max_participants: 10,
    },
  });

  const handleSubmit = async (data: EventFormValues) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
