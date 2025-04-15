
import React, { ReactNode } from "react";

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
};
