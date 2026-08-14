"use client";

import { useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/client";
import { cropImageToSize } from "@/lib/utils/image";
import Avatar from "@/components/ui/Avatar";

interface AvatarUploaderProps {
  uid: string;
  name: string;
  photoURL: string;
  onUploaded: (url: string) => void;
}

export default function AvatarUploader({ uid, name, photoURL, onUploaded }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!storage) {
      alert("Firebase Storage isn't configured yet. Add your Firebase keys to .env.local.");
      return;
    }
    setUploading(true);
    try {
      const blob = await cropImageToSize(file, 200, 200);
      const storageRef = ref(storage, `avatars/${uid}.jpg`);
      await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
      const url = await getDownloadURL(storageRef);
      onUploaded(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative">
      <Avatar name={name} photoURL={photoURL} size={112} className="border-4 border-white shadow-md" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
        aria-label="Upload avatar"
      >
        {uploading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
