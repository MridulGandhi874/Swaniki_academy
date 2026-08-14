"use client";

import { useState } from "react";
import { useAuth, type MongoUser } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-gray-500";

export default function SettingsForm({ user }: { user: MongoUser }) {
  const { firebaseUser, refreshMongoUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user.firstName || user.displayName.split(" ")[0] || "",
    lastName: user.lastName || user.displayName.split(" ").slice(1).join(" ") || "",
    username: user.username,
    phone: user.phone,
    occupation: user.occupation,
    timezone: user.timezone,
    bio: user.bio,
    publicDisplayName: user.publicDisplayName || "full",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseUser) return;
    setSaving(true);
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await refreshMongoUser();
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>First Name</label>
          <input className={inputClass} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input className={inputClass} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>User Name</label>
          <input className={inputClass} value={form.username} onChange={(e) => update("username", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Skill / Occupation</label>
          <input
            className={inputClass}
            value={form.occupation}
            onChange={(e) => update("occupation", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Timezone</label>
          <input className={inputClass} value={form.timezone} onChange={(e) => update("timezone", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Bio</label>
          <textarea
            className={inputClass}
            rows={4}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Public Display Name</label>
          <select
            className={inputClass}
            value={form.publicDisplayName}
            onChange={(e) => update("publicDisplayName", e.target.value)}
          >
            <option value="full">{`${form.firstName} ${form.lastName}`.trim() || "Full Name"}</option>
            <option value="username">{form.username || "Username"}</option>
            <option value="first">{form.firstName || "First Name"}</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Profile"}
        </Button>
        {saved && <span className="text-sm text-green-600">Profile updated.</span>}
      </div>
    </form>
  );
}
