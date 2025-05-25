
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Trash2 } from "lucide-react";

interface ProfileImageSectionProps {
  user: any;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

export const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  user,
  avatarUrl,
  setAvatarUrl
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      console.log("[ProfileImageSection] Uploading avatar:", filePath);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Avatar uploaded",
        description: "Your profile image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error("[ProfileImageSection] Error uploading avatar:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);
      
      if (avatarUrl) {
        // Extract the file path from the URL
        const urlParts = avatarUrl.split('/');
        const filePath = `${user.id}/${urlParts[urlParts.length - 1]}`;
        
        console.log("[ProfileImageSection] Removing avatar:", filePath);
        
        const { error } = await supabase.storage
          .from('avatars')
          .remove([filePath]);

        if (error) {
          throw error;
        }
      }

      setAvatarUrl(null);
      
      toast({
        title: "Avatar removed",
        description: "Your profile image has been removed",
      });
    } catch (error: any) {
      console.error("[ProfileImageSection] Error removing avatar:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const userInitial = user?.user_metadata?.f_name 
    ? user.user_metadata.f_name.charAt(0).toUpperCase() 
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="text-lg">
          {userInitial}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex gap-2">
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
            id="avatar-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            <Camera className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </div>
        
        {avatarUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={removeAvatar}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};
