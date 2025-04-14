
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  TitleField,
  LocationField,
  DateField,
  NotesField,
  PricingFields,
  ParticipantsField,
  FormButtons
} from "./FormFields";
import { eventSchema, EventFormValues } from "./types";

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
        <TitleField form={form} />
        <LocationField form={form} />
        <DateField form={form} />
        <NotesField form={form} />
        <PricingFields form={form} isFree={isFree} setIsFree={setIsFree} />
        <ParticipantsField form={form} />
        <FormButtons onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default EventForm;
