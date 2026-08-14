"use client";

import { useAuth } from "@/context/AuthContext";
import CoverPhotoUploader from "@/components/dashboard/CoverPhotoUploader";
import AvatarUploader from "@/components/dashboard/AvatarUploader";
import SettingsForm from "@/components/dashboard/SettingsForm";

export default function MyProfilePage() {
  const { mongoUser, refreshMongoUser, firebaseUser } = useAuth();
  if (!mongoUser || !firebaseUser) return null;

  async function persistPhoto(field: "photoURL" | "coverURL", url: string) {
    const idToken = await firebaseUser!.getIdToken();
    await fetch("/api/user/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ [field]: url }),
    });
    await refreshMongoUser();
  }

  return (
    <div>
      <h1 className="mb-6 text-lg font-bold text-[var(--color-soft-slate)]">My Profile</h1>

      <div className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <CoverPhotoUploader
          uid={mongoUser.uid}
          coverURL={mongoUser.coverURL}
          onUploaded={(url) => persistPhoto("coverURL", url)}
        >
          <div className="relative z-10 p-6">
            <AvatarUploader
              uid={mongoUser.uid}
              name={mongoUser.displayName || mongoUser.email}
              photoURL={mongoUser.photoURL}
              onUploaded={(url) => persistPhoto("photoURL", url)}
            />
          </div>
        </CoverPhotoUploader>

        <SettingsForm user={mongoUser} />
      </div>
    </div>
  );
}
