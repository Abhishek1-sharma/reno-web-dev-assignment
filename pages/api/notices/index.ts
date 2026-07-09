import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { allowMethods, parseNoticePayload, serializeNotice, type ApiError } from "@/lib/notices";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiError | unknown>
) {
  if (!allowMethods(req, res, ["GET", "POST"])) return;

  if (req.method === "GET") {
    const notices = await prisma.notice.findMany({
      orderBy: [{ priority: "desc" }, { publishDate: "desc" }, { createdAt: "desc" }]
    });
    res.status(200).json({ notices: notices.map(serializeNotice) });
    return;
  }

  const parsed = parseNoticePayload(req.body);
  if (parsed.errors) {
    res.status(400).json(parsed.errors);
    return;
  }

  try {
    const notice = await prisma.notice.create({ data: parsed.data });
    res.status(201).json({ notice: serializeNotice(notice) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: "The notice could not be saved." });
      return;
    }
    throw error;
  }
}
