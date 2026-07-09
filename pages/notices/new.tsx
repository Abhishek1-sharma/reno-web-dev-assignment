import Link from "next/link";
import { Layout } from "@/components/Layout";
import { NoticeForm } from "@/components/NoticeForm";
import { toFormValues } from "@/lib/notices";

export default function NewNoticePage() {
  return (
    <Layout>
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex text-sm font-semibold text-accent transition hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Back to notices
        </Link>
        <p className="text-sm font-semibold uppercase tracking-normal text-accent">Create</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">Add notice</h1>
      </div>
      <NoticeForm mode="create" initialValues={toFormValues()} />
    </Layout>
  );
}
