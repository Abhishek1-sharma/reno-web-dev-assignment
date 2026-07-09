import type { GetServerSideProps } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { NoticeForm } from "@/components/NoticeForm";
import { prisma } from "@/lib/prisma";
import { toFormValues, type NoticeFormValues } from "@/lib/notices";

type EditNoticeProps = {
  noticeId: string;
  initialValues: NoticeFormValues;
};

export default function EditNoticePage({ noticeId, initialValues }: EditNoticeProps) {
  return (
    <Layout>
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex text-sm font-semibold text-accent transition hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Back to notices
        </Link>
        <p className="text-sm font-semibold uppercase tracking-normal text-accent">Edit</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink">Edit notice</h1>
      </div>
      <NoticeForm mode="edit" noticeId={noticeId} initialValues={initialValues} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<EditNoticeProps> = async ({ params }) => {
  const id = typeof params?.id === "string" ? params.id : "";
  const notice = await prisma.notice.findUnique({ where: { id } });

  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      noticeId: notice.id,
      initialValues: toFormValues(notice)
    }
  };
};
