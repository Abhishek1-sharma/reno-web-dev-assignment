import type { GetServerSideProps } from "next";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { NoticeCard, type NoticeCardData } from "@/components/NoticeCard";
import { prisma } from "@/lib/prisma";
import { serializeNotice } from "@/lib/notices";

type HomeProps = {
  notices: NoticeCardData[];
};

export default function Home({ notices }: HomeProps) {
  return (
    <Layout>
      <section className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-accent">Notice Board</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink sm:text-4xl">
            Campus notices
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
            Manage exams, events, and general updates from one responsive board.
          </p>
        </div>
      </section>

      {notices.length > 0 ? (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-line bg-white px-6 py-14 text-center">
          <h2 className="text-xl font-semibold text-ink">No notices yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Create the first notice to start the board. Urgent notices will appear above normal notices automatically.
          </p>
          <Link
            href="/notices/new"
            className="mt-5 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Add Notice
          </Link>
        </section>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }, { createdAt: "desc" }]
  });

  return {
    props: {
      notices: notices.map(serializeNotice)
    }
  };
};
