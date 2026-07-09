import type { Category, Priority } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { categoryLabels, formatDateInput, priorityLabels } from "@/lib/notices";

export type NoticeCardData = {
  id: string;
  title: string;
  body: string;
  category: Category;
  priority: Priority;
  publishDate: string;
  imageUrl: string | null;
};

type NoticeCardProps = {
  notice: NoticeCardData;
};

export function NoticeCard({ notice }: NoticeCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const isUrgent = notice.priority === "URGENT";

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${notice.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setIsDeleting(true);
    const response = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
    setIsDeleting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      alert(data?.error ?? "Unable to delete this notice.");
      return;
    }

    router.replace(router.asPath);
  }

  return (
    <article className="flex min-h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      {notice.imageUrl ? (
        <img
          src={notice.imageUrl}
          alt=""
          className="h-44 w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : null}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-slate-700">
            {categoryLabels[notice.category]}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-slate-700">
            {priorityLabels[notice.priority]}
          </span>
          {isUrgent ? (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
              Urgent
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold leading-tight text-ink">{notice.title}</h2>
          <p className="text-sm font-medium text-slate-500">
            Published {formatDateInput(notice.publishDate)}
          </p>
          <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{notice.body}</p>
        </div>

        <div className="mt-auto flex items-center gap-3 pt-2">
          <Link
            href={`/notices/${notice.id}/edit`}
            className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-md border border-orange-200 px-3 py-2 text-sm font-semibold text-danger transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
