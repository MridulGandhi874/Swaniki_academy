"use client";

import { useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/client";
import { cropImageToSize } from "@/lib/utils/image";

interface CoverPhotoUploaderProps {
  uid: string;
  coverURL: string;
  onUploaded: (url: string) => void;
  children?: React.ReactNode;
}

export default function CoverPhotoUploader({ uid, coverURL, onUploaded, children }: CoverPhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!storage) {
      alert("Firebase Storage isn't configured yet. Add your Firebase keys to .env.local.");
      return;
    }
    setUploading(true);
    try {
      const blob = await cropImageToSize(file, 700, 430);
      const storageRef = ref(storage, `covers/${uid}.jpg`);
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
    <div
      className="relative flex h-44 w-full items-end overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 sm:h-56"
      style={coverURL ? { backgroundImage: `url(${coverURL})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      <div className="absolute inset-0 bg-black/10" />
      {children}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-gray-700 shadow-md transition hover:bg-white"
      >
        {uploading ? "Uploading..." : "Change Cover"}
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
