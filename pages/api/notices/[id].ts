import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { allowMethods, parseNoticePayload, serializeNotice, type ApiError } from "@/lib/notices";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiError | unknown>
) {
  if (!allowMethods(req, res, ["GET", "PUT", "PATCH", "DELETE"])) return;

  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!id) {
    res.status(400).json({ error: "A valid notice id is required." });
    return;
  }

  if (req.method === "GET") {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) {
      res.status(404).json({ error: "Notice not found." });
      return;
    }
    res.status(200).json({ notice: serializeNotice(notice) });
    return;
  }

  if (req.method === "DELETE") {
    try {
      await prisma.notice.delete({ where: { id } });
      res.status(204).end();
    } catch (error) {
      if (isNotFound(error)) {
        res.status(404).json({ error: "Notice not found." });
        return;
      }
      throw error;
    }
    return;
  }

  const parsed = parseNoticePayload(req.body);
  if (parsed.errors) {
    res.status(400).json(parsed.errors);
    return;
  }

  try {
    const notice = await prisma.notice.update({
      where: { id },
      data: parsed.data
    });
    res.status(200).json({ notice: serializeNotice(notice) });
  } catch (error) {
    if (isNotFound(error)) {
      res.status(404).json({ error: "Notice not found." });
      return;
    }
    throw error;
  }
}

function isNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}
