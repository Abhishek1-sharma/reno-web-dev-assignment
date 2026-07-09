import type { Category, Notice, Priority } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export const categoryLabels: Record<Category, string> = {
  EXAM: "Exam",
  EVENT: "Event",
  GENERAL: "General"
};

export const priorityLabels: Record<Priority, string> = {
  NORMAL: "Normal",
  URGENT: "Urgent"
};

export type NoticeFormValues = {
  title: string;
  body: string;
  category: Category;
  priority: Priority;
  publishDate: string;
  imageUrl: string;
};

export type NoticePayload = {
  title: string;
  body: string;
  category: Category;
  priority: Priority;
  publishDate: Date;
  imageUrl: string | null;
};

type NoticeFormSource = Pick<
  Notice,
  "title" | "body" | "category" | "priority" | "publishDate" | "imageUrl"
> & {
  publishDate: Date | string;
};

export type ApiError = {
  error: string;
  fieldErrors?: Partial<Record<keyof NoticeFormValues, string>>;
};

export function toFormValues(notice?: NoticeFormSource): NoticeFormValues {
  return {
    title: notice?.title ?? "",
    body: notice?.body ?? "",
    category: notice?.category ?? "GENERAL",
    priority: notice?.priority ?? "NORMAL",
    publishDate: notice ? formatDateInput(notice.publishDate) : formatDateInput(new Date()),
    imageUrl: notice?.imageUrl ?? ""
  };
}

export function formatDateInput(date: Date | string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

export function serializeNotice(notice: Notice) {
  return {
    ...notice,
    publishDate: notice.publishDate.toISOString(),
    createdAt: notice.createdAt.toISOString(),
    updatedAt: notice.updatedAt.toISOString()
  };
}

export function parseNoticePayload(input: unknown): { data?: NoticePayload; errors?: ApiError } {
  const body = isRecord(input) ? input : {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const text = typeof body.body === "string" ? body.body.trim() : "";
  const category = typeof body.category === "string" ? body.category : "";
  const priority = typeof body.priority === "string" ? body.priority : "";
  const publishDateRaw = typeof body.publishDate === "string" ? body.publishDate : "";
  const imageUrlRaw = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";

  const fieldErrors: ApiError["fieldErrors"] = {};

  if (!title) fieldErrors.title = "Title is required.";
  if (title.length > 160) fieldErrors.title = "Title must be 160 characters or less.";
  if (!text) fieldErrors.body = "Body is required.";
  if (!["EXAM", "EVENT", "GENERAL"].includes(category)) {
    fieldErrors.category = "Choose Exam, Event, or General.";
  }
  if (!["NORMAL", "URGENT"].includes(priority)) {
    fieldErrors.priority = "Choose Normal or Urgent.";
  }

  const publishDate = parseDateOnly(publishDateRaw);
  if (!publishDate) {
    fieldErrors.publishDate = "Enter a valid publish date.";
  }

  if (imageUrlRaw && !isValidHttpUrl(imageUrlRaw)) {
    fieldErrors.imageUrl = "Enter a valid image URL, or leave it blank.";
  }

  if (Object.keys(fieldErrors).length > 0 || !publishDate) {
    return {
      errors: {
        error: "Please fix the highlighted fields.",
        fieldErrors
      }
    };
  }

  return {
    data: {
      title,
      body: text,
      category: category as Category,
      priority: priority as Priority,
      publishDate,
      imageUrl: imageUrlRaw || null
    }
  };
}

export function allowMethods(
  req: NextApiRequest,
  res: NextApiResponse,
  methods: string[]
): boolean {
  if (methods.includes(req.method ?? "")) return true;
  res.setHeader("Allow", methods);
  res.status(405).json({ error: `Method ${req.method} not allowed.` });
  return false;
}

function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10) === value ? date : null;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
