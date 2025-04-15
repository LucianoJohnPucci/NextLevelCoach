
import React from "react";
import { Input } from "@/components/ui/input";
import { ProfileFormField } from "./ProfileFormField";

interface PersonalInfoSectionProps {
  user: any;
  firstName: string;
  setFirstName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  user,
  firstName,
  setFirstName,
  phone,
  setPhone
}) => {
  return (
    <>
      <div className="space-y-2">
        <ProfileFormField id="email" label="Email">
          <Input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </ProfileFormField>
      </div>
      
      <div className="space-y-2">
        <ProfileFormField id="firstName" label="First Name">
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Your first name"
          />
        </ProfileFormField>
      </div>
      
      <div className="space-y-2">
        <ProfileFormField id="phone" label="Phone for SMS Notifications">
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
          />
        </ProfileFormField>
      </div>
    </>
  );
};
