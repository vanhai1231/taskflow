import React from "react";

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Find earliest match
    const patterns = [
      { regex: /\*\*(.+?)\*\*/, type: "bold" },
      { regex: /`(.+?)`/, type: "code" },
      { regex: /~~(.+?)~~/, type: "strike" },
      { regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/, type: "italic" },
    ];

    let earliest: { match: RegExpMatchArray; type: string } | null = null;
    for (const p of patterns) {
      const m = remaining.match(p.regex);
      if (m && (!earliest || (m.index || 0) < (earliest.match.index || 0))) {
        earliest = { match: m, type: p.type };
      }
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    const idx = earliest.match.index || 0;
    if (idx > 0) parts.push(remaining.substring(0, idx));

    const content = earliest.match[1];
    switch (earliest.type) {
      case "bold":
        parts.push(<strong key={key++} className="font-semibold text-foreground">{content}</strong>);
        break;
      case "italic":
        parts.push(<em key={key++}>{content}</em>);
        break;
      case "code":
        parts.push(<code key={key++} className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">{content}</code>);
        break;
      case "strike":
        parts.push(<s key={key++} className="text-muted-foreground/60">{content}</s>);
        break;
    }

    remaining = remaining.substring(idx + earliest.match[0].length);
  }

  return <>{parts}</>;
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="max-w-none space-y-1">
      {content.split("\n").map((line, i) => {
        // Headers
        if (line.startsWith("### ")) return <h4 key={i} className="text-sm font-semibold mt-5 mb-1 text-foreground">{renderInline(line.slice(4))}</h4>;
        if (line.startsWith("## ")) return <h3 key={i} className="text-base font-semibold mt-6 mb-1 text-foreground">{renderInline(line.slice(3))}</h3>;
        if (line.startsWith("# ")) return <h2 key={i} className="text-lg font-bold mt-6 mb-2 text-foreground">{renderInline(line.slice(2))}</h2>;
        // HR
        if (line.trim() === "---") return <hr key={i} className="border-border my-4" />;
        // Quote
        if (line.startsWith("> ")) return <blockquote key={i} className="border-l-2 border-foreground/20 pl-4 text-sm text-muted-foreground italic my-1">{renderInline(line.slice(2))}</blockquote>;
        // Numbered list
        if (/^\d+\.\s/.test(line)) return <li key={i} className="text-sm text-muted-foreground leading-relaxed ml-5 list-decimal">{renderInline(line.replace(/^\d+\.\s/, ""))}</li>;
        // Bullet list
        if (/^[-•·]\s/.test(line)) return <li key={i} className="text-sm text-muted-foreground leading-relaxed ml-5 list-disc">{renderInline(line.replace(/^[-•·]\s/, ""))}</li>;
        // Empty line
        if (!line.trim()) return <div key={i} className="h-2" />;
        // Paragraph
        return <p key={i} className="text-sm text-muted-foreground leading-[1.75]">{renderInline(line)}</p>;
      })}
    </div>
  );
}
