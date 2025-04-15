
import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface ProfileFormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
}

export const ProfileFormField: React.FC<ProfileFormFieldProps> = ({ id, label, children }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
};
