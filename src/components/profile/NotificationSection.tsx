
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileFormField } from "./ProfileFormField";

interface NotificationSectionProps {
  notifyByEmail: boolean;
  setNotifyByEmail: (value: boolean) => void;
  notifyBySms: boolean;
  setNotifyBySms: (value: boolean) => void;
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({
  notifyByEmail,
  setNotifyByEmail,
  notifyBySms,
  setNotifyBySms
}) => {
  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notification Preferences</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifyByEmail"
              checked={notifyByEmail}
              onCheckedChange={(checked) => setNotifyByEmail(checked === true)}
            />
            <label
              htmlFor="notifyByEmail"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notify by email
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifyBySms"
              checked={notifyBySms}
              onCheckedChange={(checked) => setNotifyBySms(checked === true)}
            />
            <label
              htmlFor="notifyBySms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notify by SMS
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
