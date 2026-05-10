"use client";

import React, { useRef, useState } from "react";
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarkdownEditorProps {
  name: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}

export function MarkdownEditor({ name, defaultValue = "", rows = 8, required, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const insertMarkdown = (before: string, after: string = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const newText = value.substring(0, start) + before + selected + after + value.substring(end);
    setValue(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const insertLine = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    setValue(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const tools = [
    { icon: Heading1, action: () => insertLine("# "), title: "Heading 1" },
    { icon: Heading2, action: () => insertLine("## "), title: "Heading 2" },
    { icon: Heading3, action: () => insertLine("### "), title: "Heading 3" },
    { type: "sep" },
    { icon: Bold, action: () => insertMarkdown("**", "**"), title: "Bold" },
    { icon: Italic, action: () => insertMarkdown("*", "*"), title: "Italic" },
    { icon: Strikethrough, action: () => insertMarkdown("~~", "~~"), title: "Strikethrough" },
    { icon: Code, action: () => insertMarkdown("`", "`"), title: "Code" },
    { type: "sep" },
    { icon: List, action: () => insertLine("- "), title: "Bullet list" },
    { icon: ListOrdered, action: () => insertLine("1. "), title: "Numbered list" },
    { icon: Quote, action: () => insertLine("> "), title: "Quote" },
    { icon: Minus, action: () => insertMarkdown("\n---\n"), title: "Divider" },
  ];

  const renderPreview = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Headers
      if (line.startsWith("### ")) return <h4 key={i} className="text-sm font-semibold mt-4 mb-1">{renderInline(line.slice(4))}</h4>;
      if (line.startsWith("## ")) return <h3 key={i} className="text-base font-semibold mt-5 mb-1">{renderInline(line.slice(3))}</h3>;
      if (line.startsWith("# ")) return <h2 key={i} className="text-lg font-bold mt-6 mb-2">{renderInline(line.slice(2))}</h2>;
      // HR
      if (line.trim() === "---") return <hr key={i} className="border-border my-4" />;
      // Quote
      if (line.startsWith("> ")) return <blockquote key={i} className="border-l-2 border-foreground/20 pl-4 text-sm text-muted-foreground italic">{renderInline(line.slice(2))}</blockquote>;
      // List
      if (/^[-•]\s/.test(line)) return <li key={i} className="text-sm text-muted-foreground leading-relaxed ml-4 list-disc">{renderInline(line.replace(/^[-•]\s/, ""))}</li>;
      if (/^\d+\.\s/.test(line)) return <li key={i} className="text-sm text-muted-foreground leading-relaxed ml-4 list-decimal">{renderInline(line.replace(/^\d+\.\s/, ""))}</li>;
      // Empty line
      if (!line.trim()) return <div key={i} className="h-3" />;
      // Paragraph
      return <p key={i} className="text-sm text-muted-foreground leading-[1.75]">{renderInline(line)}</p>;
    });
  };

  const renderInline = (text: string) => {
    // Simple inline markdown rendering
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Italic
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
      // Code
      const codeMatch = remaining.match(/`(.+?)`/);
      // Strikethrough
      const strikeMatch = remaining.match(/~~(.+?)~~/);

      const matches = [
        boldMatch && { match: boldMatch, type: "bold" },
        italicMatch && { match: italicMatch, type: "italic" },
        codeMatch && { match: codeMatch, type: "code" },
        strikeMatch && { match: strikeMatch, type: "strike" },
      ].filter(Boolean).sort((a, b) => (a!.match!.index || 0) - (b!.match!.index || 0));

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const first = matches[0]!;
      const idx = first.match!.index || 0;
      if (idx > 0) parts.push(remaining.substring(0, idx));

      switch (first.type) {
        case "bold":
          parts.push(<strong key={key++} className="font-semibold text-foreground">{first.match![1]}</strong>);
          break;
        case "italic":
          parts.push(<em key={key++}>{first.match![1]}</em>);
          break;
        case "code":
          parts.push(<code key={key++} className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">{first.match![1]}</code>);
          break;
        case "strike":
          parts.push(<s key={key++} className="text-muted-foreground/60">{first.match![1]}</s>);
          break;
      }

      remaining = remaining.substring(idx + first.match![0].length);
    }

    return <>{parts}</>;
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b bg-muted/30 flex-wrap">
        {tools.map((tool, i) => {
          if ((tool as any).type === "sep") return <div key={i} className="w-px h-5 bg-border mx-1" />;
          const Icon = tool.icon!;
          return (
            <Button
              key={i}
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              title={tool.title}
              onClick={tool.action}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          );
        })}
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 gap-1 text-xs"
          onClick={() => setPreview(!preview)}
        >
          {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {preview ? "Edit" : "Preview"}
        </Button>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div className="p-4 min-h-[200px] space-y-1">
          {renderPreview(value)}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={rows}
          required={required}
          placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3 text-sm resize-y focus:outline-none min-h-[200px] font-mono leading-relaxed"
        />
      )}
    </div>
  );
}
