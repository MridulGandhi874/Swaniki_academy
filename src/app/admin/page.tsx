"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import MetricBanner from "@/components/dashboard/MetricBanner";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

interface PlatformStats {
  totalTraineesEnrolled: number;
  activeCourses: number;
  completedCourses: number;
}

interface Order {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  price: number;
  status: "Enrolled" | "In Progress" | "Completed" | "Certified";
  enrolledAt: number;
}

const statusStyles: Record<Order["status"], string> = {
  Enrolled: "bg-gray-100 text-gray-600",
  "In Progress": "bg-amber-50 text-amber-700",
  Completed: "bg-blue-50 text-blue-700",
  Certified: "bg-green-50 text-green-700",
};

export default function AdminDashboardPage() {
  const { firebaseUser } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchData = useCallback(async () => {
    if (!firebaseUser) return;
    const idToken = await firebaseUser.getIdToken();

    const [statsRes, ordersRes] = await Promise.all([
      fetch("/api/stats/platform"),
      fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${idToken}` } }),
    ]);

    if (statsRes.ok) setStats(await statsRes.json());
    if (ordersRes.ok) {
      const data = await ordersRes.json();
      setOrders(data.orders ?? []);
      setTotalRevenue(data.totalRevenue ?? 0);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Platform-wide metrics across every trainee and track.
          </p>
        </div>
        <Button href="/admin/courses">Manage Courses</Button>
      </div>

      {!stats ? (
        <Skeleton className="h-32 w-full rounded-2xl" />
      ) : (
        <MetricBanner
          totalTraineesEnrolled={stats.totalTraineesEnrolled}
          activeCourses={stats.activeCourses}
          completedCourses={stats.completedCourses}
        />
      )}

      <div className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <h2 className="text-sm font-semibold text-gray-900">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/courses/new"
            className="rounded-full border border-[var(--color-soft-slate)] px-4 py-2 text-sm font-medium text-[var(--color-soft-slate)] transition hover:bg-gray-50"
          >
            + New Course
          </Link>
          <Link
            href="/admin/courses"
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            View All Courses
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--color-soft-slate)] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
          Total Revenue Earned
        </p>
        <p className="mt-2 text-4xl font-bold text-white">
          ₹{totalRevenue.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-xs text-white/60">
          Computed from course price × total enrollments — no external payment processor is wired up.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <h2 className="text-sm font-semibold text-gray-900">Enrollments</h2>
        <p className="mt-1 text-xs text-gray-500">Every purchase, most recent first.</p>

        <div className="mt-4">
          {!orders ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : orders.length === 0 ? (
            <EmptyState title="No enrollments yet" description="Purchases will show up here as trainees enroll." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                    <th className="py-2 pr-4 font-medium">Student</th>
                    <th className="py-2 pr-4 font-medium">Course</th>
                    <th className="py-2 pr-4 font-medium">Price</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-gray-900">{order.studentName}</p>
                        <p className="text-xs text-gray-400">{order.studentEmail}</p>
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{order.courseTitle}</td>
                      <td className="py-3 pr-4 text-gray-700">₹{order.price.toLocaleString("en-IN")}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-500">
                        {new Date(order.enrolledAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
