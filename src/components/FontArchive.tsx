"use client";

import { useMemo, useState } from "react";

import type {
  FontArchiveData,
  FontArchiveFace,
  FontArchiveFile,
} from "../data/fontArchive";

type FontArchiveProps = {
  archive: FontArchiveData;
};

function ArchiveFile({
  file,
  faces,
}: {
  file: FontArchiveFile;
  faces: FontArchiveFace[];
}) {
  return (
    <section className="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950/60">
      <h3 className="break-all text-sm font-bold text-zinc-950 dark:text-white">
        {file.filename}
      </h3>
      <dl className="mt-3 grid min-w-0 gap-x-4 gap-y-2 text-sm sm:grid-cols-[minmax(8rem,0.3fr)_minmax(0,1fr)]">
        <dt className="font-semibold text-zinc-600 dark:text-zinc-300">
          Original relative path
        </dt>
        <dd className="break-all text-zinc-800 dark:text-zinc-200">
          {file.relativePath}
        </dd>
        <dt className="font-semibold text-zinc-600 dark:text-zinc-300">
          Source category
        </dt>
        <dd className="break-words text-zinc-800 dark:text-zinc-200">
          {file.sourceCategory}
        </dd>
        <dt className="font-semibold text-zinc-600 dark:text-zinc-300">
          Format
        </dt>
        <dd className="text-zinc-800 dark:text-zinc-200">{file.format}</dd>
        <dt className="font-semibold text-zinc-600 dark:text-zinc-300">
          SHA-256
        </dt>
        <dd className="break-all font-mono text-xs leading-5 text-zinc-800 dark:text-zinc-200">
          {file.sha256}
        </dd>
        <dt className="font-semibold text-zinc-600 dark:text-zinc-300">
          Duplicate status
        </dt>
        <dd className="break-words text-zinc-800 dark:text-zinc-200">
          {file.duplicateGroupId
            ? `Exact-byte duplicate group ${file.duplicateGroupId}`
            : "No exact-byte duplicate found"}
        </dd>
        <dt className="font-semibold text-zinc-600 dark:text-zinc-300">
          Licensing status
        </dt>
        <dd className="font-semibold text-amber-800 dark:text-amber-200">
          Not cleared for public redistribution
        </dd>
      </dl>

      <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-700">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Faces and styles ({faces.length})
        </h4>
        <ul className="mt-2 space-y-2">
          {faces.map((face) => (
            <li
              key={face.id}
              className="min-w-0 rounded-lg bg-white px-3 py-2 text-sm dark:bg-zinc-900"
            >
              <p className="break-words font-semibold text-zinc-900 dark:text-zinc-100">
                {face.fullName || face.metadataFamily}
              </p>
              <p className="mt-1 break-words leading-5 text-zinc-600 dark:text-zinc-300">
                {face.style || "Style metadata unavailable"} · face index{" "}
                {face.faceIndex}
                {file.format === "TTC" ? " (collection face)" : ""}
                {face.namedInstanceIndex > 0
                  ? ` · named instance ${face.namedInstanceIndex}`
                  : ""}
              </p>
              {face.postScriptName && (
                <p className="mt-1 break-all font-mono text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  PostScript name: {face.postScriptName}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function FontArchive({ archive }: FontArchiveProps) {
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [searchText, setSearchText] = useState("");

  const filesById = useMemo(
    () => new Map(archive.files.map((file) => [file.id, file])),
    [archive.files],
  );
  const facesById = useMemo(
    () => new Map(archive.faces.map((face) => [face.id, face])),
    [archive.faces],
  );

  const visibleFamilies = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase();

    return archive.families.filter((family) => {
      if (
        selectedCollection !== "all" &&
        !family.collections.includes(selectedCollection)
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const familyText = [
        family.displayName,
        family.historicalClassification ?? "",
        ...family.fileIds.flatMap((fileId) => {
          const file = filesById.get(fileId);
          return file
            ? [file.filename, file.relativePath, file.sourceCategory]
            : [];
        }),
        ...family.faceIds.flatMap((faceId) => {
          const face = facesById.get(faceId);
          return face
            ? [
                face.metadataFamily,
                face.style,
                face.fullName,
                face.postScriptName,
              ]
            : [];
        }),
      ]
        .join(" ")
        .toLocaleLowerCase();

      return familyText.includes(query);
    });
  }, [
    archive.families,
    facesById,
    filesById,
    searchText,
    selectedCollection,
  ]);

  return (
    <main className="flex-1 bg-gradient-to-br from-indigo-50 via-zinc-50 to-amber-50 px-4 py-8 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl shadow-indigo-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
        <header className="border-b border-zinc-100 px-5 py-6 dark:border-zinc-800 sm:px-9 sm:py-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
            Quiz Corner · Local archive
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            Font Archive
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
            A development-only, metadata-only inventory of local font files.
            No font file is rendered or served by this archive.
          </p>
          <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            All archived files are unverified and not cleared for public
            redistribution. Preview unavailable in this version.
          </p>
        </header>

        <div className="space-y-6 px-5 py-6 sm:px-9 sm:py-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="font-archive-collection"
                className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-100"
              >
                Filter by collection
              </label>
              <select
                id="font-archive-collection"
                value={selectedCollection}
                onChange={(event) => setSelectedCollection(event.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:outline-indigo-400"
              >
                <option value="all">
                  All families ({archive.families.length})
                </option>
                {archive.collections.map((collection) => {
                  const count = archive.families.filter((family) =>
                    family.collections.includes(collection.id),
                  ).length;

                  return (
                    <option key={collection.id} value={collection.id}>
                      {collection.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label
                htmlFor="font-archive-search"
                className="mb-2 block text-sm font-semibold text-zinc-800 dark:text-zinc-100"
              >
                Search families, faces, and files
              </label>
              <input
                id="font-archive-search"
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search archive metadata"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus-visible:outline-indigo-400"
              />
            </div>
          </div>

          <p
            className="text-sm text-zinc-600 dark:text-zinc-300"
            aria-live="polite"
          >
            Showing {visibleFamilies.length} of {archive.families.length}{" "}
            metadata families · {archive.files.length} file paths ·{" "}
            {archive.faces.length} faces
          </p>

          <div className="space-y-3">
            {visibleFamilies.map((family) => {
              const familyFiles = family.fileIds
                .map((fileId) => filesById.get(fileId))
                .filter((file) => file !== undefined);
              const familyFaces = family.faceIds
                .map((faceId) => facesById.get(faceId))
                .filter((face) => face !== undefined);
              const collectionNames = family.collections
                .map(
                  (collectionId) =>
                    archive.collections.find(
                      (collection) => collection.id === collectionId,
                    )?.name,
                )
                .filter((name) => name !== undefined);

              return (
                <details
                  key={family.id}
                  className="group min-w-0 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <summary className="flex min-w-0 cursor-pointer list-none flex-wrap items-center justify-between gap-3 rounded-2xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 dark:focus-visible:outline-indigo-400 sm:p-5 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">
                      <span className="block break-words text-lg font-bold text-zinc-950 dark:text-white">
                        {family.displayName}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-zinc-600 dark:text-zinc-300">
                        {familyFaces.length} faces · {familyFiles.length} file
                        {familyFiles.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-100">
                      Unverified
                    </span>
                  </summary>
                  <div className="space-y-4 border-t border-zinc-100 px-4 py-4 dark:border-zinc-800 sm:px-5">
                    {collectionNames.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {collectionNames.map((name) => (
                          <span
                            key={name}
                            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                    <dl className="grid min-w-0 gap-x-4 gap-y-2 text-sm sm:grid-cols-[minmax(10rem,0.3fr)_minmax(0,1fr)]">
                      <dt className="font-semibold text-zinc-600 dark:text-zinc-300">
                        Historical classification
                      </dt>
                      <dd className="break-words text-zinc-800 dark:text-zinc-200">
                        {family.historicalClassification ??
                          "No historical classification assigned"}
                      </dd>
                      <dt className="font-semibold text-zinc-600 dark:text-zinc-300">
                        Relationship classification
                      </dt>
                      <dd className="text-zinc-800 dark:text-zinc-200">
                        {family.relationshipClassification}
                      </dd>
                    </dl>
                    <div className="grid min-w-0 gap-3">
                      {familyFiles.map((file) => (
                        <ArchiveFile
                          key={file.id}
                          file={file}
                          faces={file.faceIds
                            .map((faceId) => facesById.get(faceId))
                            .filter((face) => face !== undefined)}
                        />
                      ))}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
