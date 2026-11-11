
#!/usr/bin/env python3
"""
Copy the Mac font inventory into a local-only repository directory.

No fonts are moved or deleted from their original locations.
No dependencies beyond the Python standard library.
Nothing is copied into public/.
"""

from pathlib import Path
import shutil
import sys

HOME = Path.home()
REPO = Path(__file__).resolve().parent.parent

DEST = REPO / "fonts-local"
INVENTORY = DEST / "mac_font_inventory"
IMPORTANT = DEST / "important_fonts_not_cleared"

FONT_EXTENSIONS = {
    ".ttf", ".otf", ".ttc", ".otc", ".dfont"
}

SOURCES = {
    "user": HOME / "Library" / "Fonts",
    "library": Path("/Library/Fonts"),
    "system": Path("/System/Library/Fonts"),
}

# Historically significant typefaces and historically important
# typographic traditions. Matching is by original filename.
IMPORTANT_NAMES = {
    "Futura.ttc",
    "Futura Black.ttf",
    "futura_black.ttf",
    "Helvetica.ttc",
    "HelveticaNeue.ttc",
    "Papyrus.ttc",
    "Comic Sans MS.ttf",
    "Comic Sans MS Bold.ttf",
    "Didot.ttc",
    "Bodoni 72.ttc",
    "Bodoni 72 OS.ttc",
    "Bodoni 72 Smallcaps Book.ttf",
    "Baskerville.ttc",
    "BigCaslon.ttf",
    "Palatino.ttc",
    "Rockwell.ttc",
    "GillSans.ttc",
    "Optima.ttc",
    "Copperplate.ttc",
    "AmericanTypewriter.ttc",
    "Times New Roman.ttf",
    "Georgia.ttf",
    "Hoefler Text.ttc",
    "Zapfino.ttf",
    "Avenir.ttc",
    "Avenir Next.ttc",
    "DIN Condensed Bold.ttf",
    "DIN Alternate Bold.ttf",
    "Garamond Bold font.ttf",
    "Garamond Regular.ttf",
    "Garamond.ttf",
    "garmndmi.ttf",
    "CaslonOS-Regular.otf",
    "FetteClassicUnzFraktur-KMne.ttf",
    "FetteUnzFraktur-2jRX.ttf",
    "OldEnglishFive.ttf",
    "EnglishTowne.ttf",
    "Canterbury.ttf",
    "AnglicanText.ttf",
    "Duerersminuskeln-VELV.ttf",
}


def font_files(root):
    if not root.is_dir():
        return []

    return sorted(
        path for path in root.rglob("*")
        if path.is_file()
        and path.suffix.lower() in FONT_EXTENSIONS
    )


def copy_preserving_path(source, source_root, destination_root):
    relative = source.relative_to(source_root)
    destination = destination_root / relative
    destination.parent.mkdir(parents=True, exist_ok=True)

    if destination.exists():
        return "already exists"


    shutil.copyfile(source, destination)
    shutil.copystat(source, destination, follow_symlinks=True)
    return "copied"


def main():
    if not (REPO / "package.json").exists():
        print(f"ERROR: Repository root not found: {REPO}")
        sys.exit(1)

    INVENTORY.mkdir(parents=True, exist_ok=True)
    IMPORTANT.mkdir(parents=True, exist_ok=True)

    total = 0
    important_total = 0

    print(f"Repository: {REPO}")
    print(f"Destination: {DEST}\n")

    for label, source_root in SOURCES.items():
        files = font_files(source_root)
        print(f"{label}: {source_root}")
        print(f"  Found {len(files)} font files")

        inventory_destination = INVENTORY / label

        for source in files:
            copy_preserving_path(
                source, source_root, inventory_destination
            )
            total += 1

            if source.name in IMPORTANT_NAMES:
                copy_preserving_path(
                    source, source_root, IMPORTANT / label
                )
                important_total += 1
                print(f"  [IMPORTANT] {source.name}")

    print("\nFinished.")
    print(f"Font files found: {total}")
    print(f"Historically important matches: {important_total}")
    print(f"\nInventory: {INVENTORY}")
    print(f"Important: {IMPORTANT}")
    print("\nOriginal font files were not modified.")


if __name__ == "__main__":
    main()
