export const cleanMarkdownText = (text) => {
  if (!text) return "";

  return (
    text
      // Remove headers (###, ##, #)
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold (**text** or __text__)
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      // Remove italic (*text* or _text_)
      .replace(/(\*|_)(.*?)\1/g, "$2")
      // Remove strikethrough (~~text~~)
      .replace(/~~(.*?)~~/g, "$1")
      // Remove code blocks (```text```)
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code (`text`)
      .replace(/`([^`]+)`/g, "$1")
      // Remove bullet points (*, -, +)
      .replace(/^[\*\-\+]\s+/gm, "• ")
      // Remove numbered lists (1. 2. 3.)
      .replace(/^\d+\.\s+/gm, "• ")
      // Clean up extra whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
};
