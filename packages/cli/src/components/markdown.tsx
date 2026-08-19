import { syntaxStyle } from "../lib/syntax-theme";

type Props = {
  content: string;
  streaming?: boolean; // true while tokens are still arriving
};

export function MessageMarkdown({ content, streaming = false }: Props) {
  return (
    <markdown
      content={content}
      syntaxStyle={syntaxStyle}
      streaming={streaming}
      conceal={true}
      tableOptions={{ style: "grid", borders: true }}
    />
  );
}