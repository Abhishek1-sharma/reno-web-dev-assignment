import type { Category, Priority } from "@prisma/client";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import type { ApiError, NoticeFormValues } from "@/lib/notices";
import { categoryLabels, priorityLabels } from "@/lib/notices";

type NoticeFormProps = {
  mode: "create" | "edit";
  initialValues: NoticeFormValues;
  noticeId?: string;
};

const categories: Category[] = ["EXAM", "EVENT", "GENERAL"];
const priorities: Priority[] = ["NORMAL", "URGENT"];

export function NoticeForm({ mode, initialValues, noticeId }: NoticeFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<NoticeFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<ApiError["fieldErrors"]>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof NoticeFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const endpoint =
      mode === "create" ? "/api/notices" : `/api/notices/${noticeId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json().catch(() => null);
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data?.error ?? "Something went wrong.");
      setFieldErrors(data?.fieldErrors ?? {});
      return;
    }

    router.push("/");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl rounded-lg border border-line bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="space-y-5">
        {error ? (
          <div className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        ) : null}

        <Field label="Title" error={fieldErrors?.title} required>
          <input
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
            maxLength={160}
            className="w-full rounded-md border border-line px-3 py-2 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-teal-100"
            required
          />
        </Field>

        <Field label="Body" error={fieldErrors?.body} required>
          <textarea
            value={values.body}
            onChange={(event) => updateField("body", event.target.value)}
            rows={7}
            className="w-full resize-y rounded-md border border-line px-3 py-2 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-teal-100"
            required
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" error={fieldErrors?.category} required>
            <select
              value={values.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-teal-100"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Priority" error={fieldErrors?.priority} required>
            <select
              value={values.priority}
              onChange={(event) => updateField("priority", event.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-teal-100"
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priorityLabels[priority]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Publish date" error={fieldErrors?.publishDate} required>
            <input
              type="date"
              value={values.publishDate}
              onChange={(event) =>
                updateField("publishDate", event.target.value)
              }
              className="w-full rounded-md border border-line px-3 py-2 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-teal-100"
              required
            />
          </Field>

          <Field label="Image URL" error={fieldErrors?.imageUrl}>
            <input
              type="url"
              value={values.imageUrl}
              onChange={(event) => updateField("imageUrl", event.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-md border border-line px-3 py-2 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-teal-100"
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create notice"
                : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

function Field({ label, error, required = false, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="ml-1 text-danger">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="block text-sm font-medium text-danger">{error}</span>
      ) : null}
    </label>
  );
}
