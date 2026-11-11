const basePath = process.env.NODE_ENV === "production" ? "/quiz-corner" : "";

export default function PublicFontStylesheet() {
  return (
    <link
      rel="stylesheet"
      href={`${basePath}/fonts/cleared/font-faces.css`}
    />
  );
}
