#!/usr/bin/env python3
"""Generate local font metadata for the development-only Font Archive."""

from collections import defaultdict
import hashlib
import json
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
FONT_EXTENSIONS = {".ttf", ".otf", ".ttc", ".otc", ".dfont"}
SOURCES = {
    "not_cleared": ROOT / "fonts-local" / "not_cleared",
    "important_fonts_not_cleared": ROOT
    / "fonts-local"
    / "important_fonts_not_cleared",
    "mac_font_inventory": ROOT / "fonts-local" / "mac_font_inventory",
}
OUTPUT = ROOT / "src" / "data" / "fontArchive.json"

COLLECTIONS = [
    {
        "id": "historically-important",
        "name": "Historically Important",
        "description": "A curated selection of influential typefaces and traditions; this does not authenticate the included files.",
    },
    {
        "id": "blackletter-gothic",
        "name": "Blackletter & Gothic",
        "description": "Blackletter, Gothic, and related historical display styles.",
    },
    {
        "id": "serif-book",
        "name": "Serif & Book Typography",
        "description": "Serif families and book-oriented text typography.",
    },
    {
        "id": "sans-geometric",
        "name": "Sans Serif & Geometric",
        "description": "Sans-serif families and geometric or modernist styles.",
    },
    {
        "id": "display-decorative",
        "name": "Display & Decorative",
        "description": "Expressive styles primarily suited to display use.",
    },
    {
        "id": "handwriting-script",
        "name": "Handwriting & Script",
        "description": "Handwriting, lettering, calligraphic, and script styles.",
    },
    {
        "id": "experimental-novelty",
        "name": "Experimental & Novelty",
        "description": "Playful, unusual, or experimental display styles.",
    },
    {
        "id": "symbols-writing-systems",
        "name": "Symbols & Writing Systems",
        "description": "Fonts primarily associated with symbols or particular writing systems.",
    },
]

HISTORICAL_CLASSIFICATIONS = {
    "american typewriter": "20th-century typewriter-inspired slab-serif design",
    "baskerville": "18th-century transitional serif tradition",
    "big caslon": "Caslon old-style serif tradition",
    "bodoni 72": "late-18th-century Didone serif tradition",
    "bodoni 72 oldstyle": "Bodoni-derived old-style serif design",
    "bodoni 72 smallcaps": "Bodoni-derived small-cap design",
    "caslon os": "early-18th-century English old-style serif tradition",
    "copperplate": "engraved inscription and all-cap display tradition",
    "didot": "late-18th-century Didone serif tradition",
    "fette classic unz fraktur": "German Fraktur blackletter tradition",
    "fette unz fraktur": "German Fraktur blackletter tradition",
    "futura": "20th-century geometric sans-serif tradition",
    "garamond": "Renaissance old-style serif tradition",
    "gill sans": "20th-century humanist sans-serif tradition",
    "hoefler text": "late-20th-century book serif design",
    "old english five": "Blackletter display tradition",
    "palatino": "20th-century humanist old-style serif tradition",
    "times new roman": "20th-century newspaper serif design",
    "helvetica": "20th-century neo-grotesque sans-serif tradition",
    "helvetica neue": "20th-century neo-grotesque sans-serif tradition",
}

HISTORICAL_IMPORTANT = set(HISTORICAL_CLASSIFICATIONS)

BLACKLETTER_NAMES = {
    "anglicantext",
    "canterbury",
    "duerersminuskeln",
    "english towne",
    "old english five",
}

SERIF_NAMES = {
    "american typewriter",
    "baskerville",
    "big caslon",
    "bodoni 72",
    "bodoni 72 oldstyle",
    "bodoni 72 smallcaps",
    "caslon os",
    "didot",
    "garamond",
    "georgia",
    "hoefler text",
    "palatino",
    "rockwell",
    "times new roman",
}

SANS_NAMES = {
    "arial",
    "avenir",
    "avenir next",
    "futura",
    "geneva",
    "gill sans",
    "helvetica",
    "helvetica neue",
    "optima",
    "tahoma",
    "trebuchet ms",
    "verdana",
}

SCRIPT_NAMES = {
    "comic sans ms",
    "noteworthy",
    "zapfino",
}

SYMBOL_SCRIPT_TERMS = (
    "arabic",
    "armenian",
    "bengali",
    "braille",
    "cjk",
    "devanagari",
    "egyptian",
    "emoji",
    "ethiopic",
    "georgian",
    "gujarati",
    "gurmukhi",
    "hangul",
    "han",
    "hieroglyph",
    "hebrew",
    "hiragana",
    "hiragino",
    "japanese",
    "kana",
    "kannada",
    "khmer",
    "korean",
    "lao",
    "latin",
    "marathi",
    "myanmar",
    "odia",
    "oriya",
    "punjabi",
    "sanskrit",
    "symbol",
    "syloti",
    "syriac",
    "tamil",
    "telugu",
    "thai",
    "tibetan",
    "unicode",
    "urdu",
)

DISPLAY_TERMS = (
    "blackwood",
    "blox",
    "copperplate",
    "display",
    "fette",
    "impact",
    "papyrus",
    "shadow",
    "showtime",
)

EXPERIMENTAL_TERMS = (
    "aged",
    "demo",
    "flasher",
    "gengar",
    "novelty",
    "personal use",
    "psycho",
    "shadow",
    "trial",
)

HANDWRITING_TERMS = (
    "calligraphy",
    "hand",
    "handwriting",
    "marker",
    "script",
    "zapfino",
)

METADATA_FORMAT = (
    "%{file}\\t%{family[0]}\\t%{style[0]}\\t%{fullname[0]}\\t"
    "%{postscriptname[0]}\\t%{index}\\n"
)


def slug(value):
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", ascii_value.casefold()).strip("-") or "font"


def normalized_family(value):
    return " ".join(unicodedata.normalize("NFKC", value).casefold().split())


def contains_term(text, term):
    return re.search(
        rf"(?<![a-z]){re.escape(term)}(?![a-z])",
        text,
        flags=re.IGNORECASE,
    ) is not None


def collection_ids(family_name, file_names):
    family = normalized_family(family_name)
    evidence = " ".join([family, *(name.casefold() for name in file_names)])
    result = []

    if family in HISTORICAL_IMPORTANT:
        result.append("historically-important")

    if (
        family in BLACKLETTER_NAMES
        or any(term in evidence for term in ("blackletter", "fraktur", "gothic"))
        or family in {"fette classic unz fraktur", "fette unz fraktur"}
    ):
        result.append("blackletter-gothic")

    if family in SERIF_NAMES or "serif" in family:
        result.append("serif-book")

    if (
        family in SANS_NAMES
        or "sans" in family
        or ("gothic" in family and "blackletter" not in evidence)
    ):
        result.append("sans-geometric")

    if any(term in evidence for term in DISPLAY_TERMS):
        result.append("display-decorative")

    if family in SCRIPT_NAMES or any(term in evidence for term in HANDWRITING_TERMS):
        result.append("handwriting-script")

    if any(term in evidence for term in EXPERIMENTAL_TERMS):
        result.append("experimental-novelty")

    if any(contains_term(family, term) for term in SYMBOL_SCRIPT_TERMS):
        result.append("symbols-writing-systems")

    return result


def metadata_for_files(paths):
    if not paths:
        return {}

    command = ["fc-scan", "--format", METADATA_FORMAT, *(str(path) for path in paths)]
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    if result.returncode:
        raise RuntimeError(
            "fc-scan failed while reading font metadata:\n"
            + (result.stderr.strip() or f"exit status {result.returncode}")
        )

    by_path = defaultdict(dict)
    raw_record_count = 0
    for line in result.stdout.splitlines():
        fields = line.split("\t")
        if len(fields) != 6:
            raise RuntimeError(f"Unexpected fc-scan metadata record: {line!r}")

        path_text, family, style, full_name, postscript_name, packed_index = fields
        path = Path(path_text).resolve()
        if not family:
            raise RuntimeError(f"Font face has no family name: {path}")
        try:
            packed_index = int(packed_index)
        except ValueError as error:
            raise RuntimeError(
                f"Invalid face index {packed_index!r} for {path}"
            ) from error

        raw_record_count += 1
        # Fontconfig packs a face index in the low word and a named-instance
        # index in the high word.
        face_index = packed_index & 0xFFFF
        instance_index = packed_index >> 16
        record = {
            "metadataFamily": family,
            "style": style,
            "fullName": full_name,
            "postScriptName": postscript_name,
            "faceIndex": face_index,
            "namedInstanceIndex": instance_index,
        }
        record_key = (normalized_family(family), face_index, instance_index)
        previous = by_path[path].get(record_key)
        if previous is None:
            by_path[path][record_key] = record
            continue

        for field in ("style", "fullName", "postScriptName"):
            if previous[field] and record[field] and previous[field] != record[field]:
                raise RuntimeError(
                    f"Conflicting {field} metadata for {path}, "
                    f"face {face_index}, instance {instance_index}"
                )
            previous[field] = previous[field] or record[field]

    missing = [str(path) for path in paths if path.resolve() not in by_path]
    if missing:
        raise RuntimeError(
            "No font metadata returned for:\n" + "\n".join(missing)
        )
    return {
        path: list(records.values()) for path, records in by_path.items()
    }, raw_record_count


def main():
    if shutil_which("fc-scan") is None:
        raise RuntimeError(
            "fc-scan is required to regenerate the archive. "
            "Install no dependencies as part of this script."
        )

    source_files = []
    for source_category, directory in SOURCES.items():
        if not directory.is_dir():
            raise RuntimeError(f"Required font directory is missing: {directory}")
        for path in sorted(directory.rglob("*")):
            if path.is_file() and path.suffix.lower() in FONT_EXTENSIONS:
                source_files.append((source_category, path))

    if not source_files:
        raise RuntimeError("No font files were found in the local archive sources.")

    metadata, raw_record_count = metadata_for_files(
        [path for _, path in source_files]
    )
    files = []
    faces = []
    family_groups = defaultdict(lambda: {"name": "", "fileIds": [], "faceIds": []})
    payload_groups = defaultdict(list)

    for source_category, path in source_files:
        relative_path = path.relative_to(ROOT).as_posix()
        path_hash = hashlib.sha256(relative_path.encode("utf-8")).hexdigest()
        file_id = f"file-{slug(path.name)[:48]}-{path_hash[:10]}"
        payload_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        payload_groups[payload_hash].append(file_id)
        face_ids = []
        file_faces = metadata[path.resolve()]

        for face_metadata in file_faces:
            family_name = face_metadata["metadataFamily"]
            family_key = normalized_family(family_name)
            family_hash = hashlib.sha256(family_key.encode("utf-8")).hexdigest()
            family_id = f"family-{slug(family_name)[:48]}-{family_hash[:10]}"
            face_id = (
                f"{file_id}-face-{face_metadata['faceIndex']}"
                f"-instance-{face_metadata['namedInstanceIndex']}"
            )

            faces.append(
                {
                    "id": face_id,
                    "familyId": family_id,
                    **face_metadata,
                    "fileId": file_id,
                }
            )
            face_ids.append(face_id)
            group = family_groups[family_id]
            group["name"] = min(
                filter(None, [group["name"], family_name]),
                key=lambda value: (value.casefold(), value),
            )
            if file_id not in group["fileIds"]:
                group["fileIds"].append(file_id)
            group["faceIds"].append(face_id)

        files.append(
            {
                "id": file_id,
                "filename": path.name,
                "relativePath": relative_path,
                "sourceCategory": source_category,
                "format": path.suffix[1:].upper(),
                "sha256": payload_hash,
                "duplicateGroupId": None,
                "licensingStatus": "unverified",
                "faceIds": face_ids,
            }
        )

    for font_file in files:
        duplicates = payload_groups[font_file["sha256"]]
        if len(duplicates) > 1:
            font_file["duplicateGroupId"] = (
                f"duplicate-{font_file['sha256'][:16]}"
            )

    face_by_id = {face["id"]: face for face in faces}
    family_files = {
        family_id: [
            font_file
            for font_file in files
            if font_file["id"] in group["fileIds"]
        ]
        for family_id, group in family_groups.items()
    }

    families = []
    for family_id, group in family_groups.items():
        name = group["name"]
        normalized_name = normalized_family(name)
        file_names = [font_file["filename"] for font_file in family_files[family_id]]
        families.append(
            {
                "id": family_id,
                "displayName": name,
                "collections": collection_ids(name, file_names),
                "historicalClassification": HISTORICAL_CLASSIFICATIONS.get(
                    normalized_name
                ),
                "relationshipClassification": "Unknown lineage",
                "fileIds": sorted(group["fileIds"]),
                "faceIds": sorted(
                    group["faceIds"],
                    key=lambda face_id: (
                        face_by_id[face_id]["faceIndex"],
                        face_by_id[face_id]["namedInstanceIndex"],
                        face_id,
                    ),
                ),
            }
        )

    files.sort(key=lambda item: (item["relativePath"].casefold(), item["id"]))
    faces.sort(key=lambda item: (item["metadataFamily"].casefold(), item["fileId"], item["faceIndex"]))
    families.sort(key=lambda item: (item["displayName"].casefold(), item["id"]))

    archive = {
        "sourceScanRecordCount": raw_record_count,
        "collections": COLLECTIONS,
        "families": families,
        "files": files,
        "faces": faces,
    }

    expected_face_count = sum(
        len(file_metadata) for file_metadata in metadata.values()
    )
    if len(faces) != expected_face_count:
        raise RuntimeError(
            f"Face count mismatch: generated {len(faces)}, "
            f"fc-scan returned {expected_face_count}"
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(archive, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    duplicate_groups = sum(
        len(file_ids) > 1 for file_ids in payload_groups.values()
    )
    print(
        f"Generated {OUTPUT.relative_to(ROOT)}: "
        f"{len(families)} families, {len(files)} files, {len(faces)} faces, "
        f"{duplicate_groups} exact-binary duplicate groups "
        f"({raw_record_count} raw fontconfig records)."
    )


def shutil_which(command):
    return shutil.which(command)


if __name__ == "__main__":
    try:
        main()
    except (OSError, RuntimeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
