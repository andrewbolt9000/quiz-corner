import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";

import FontArchive from "../../components/FontArchive";
import type { FontArchiveData } from "../../data/fontArchive";

export default async function FontArchivePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const archivePath = join(process.cwd(), "src", "data", "fontArchive.json");
  const archive = JSON.parse(
    await readFile(archivePath, "utf8"),
  ) as FontArchiveData;

  return <FontArchive archive={archive} />;
}
