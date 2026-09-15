import React from "react";

function renderSegmentWithLinks(segment: string, baseKey: string | number): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = segment.split(urlRegex);
  return parts.map((part, pIdx) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={`${baseKey}-url-${pIdx}`}
          href={part}
          onClick={(e) => {
            e.preventDefault();
            alert(`Opening payment link: ${part}`);
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline font-medium break-all hover:text-blue-800 transition-colors"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

/**
 * Parses inline text for bold formatting (**bold** or *bold*) and italic (_italic_)
 * while stripping stray markdown backticks and quotes, and converting URLs to clickable links.
 */
function parseInlineFormatting(text: string): React.ReactNode[] {
  // Strip stray backticks `code` -> code, and leading > quote markers
  const cleaned = text.replace(/`([^`]+)`/g, "$1").replace(/^>\s*/, "");

  // Regex to split by **bold**, *bold*, or _italic_
  const tokens = cleaned.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g);

  return tokens.map((token, idx) => {
    // Markdown double asterisk bold: **text**
    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {renderSegmentWithLinks(token.slice(2, -2), idx)}
        </strong>
      );
    }
    // WhatsApp single asterisk bold: *text*
    if (token.startsWith("*") && token.endsWith("*") && token.length > 2 && !token.startsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {renderSegmentWithLinks(token.slice(1, -1), idx)}
        </strong>
      );
    }
    // WhatsApp underscore italic: _text_
    if (token.startsWith("_") && token.endsWith("_") && token.length > 2) {
      return (
        <em key={idx} className="italic text-slate-800">
          {renderSegmentWithLinks(token.slice(1, -1), idx)}
        </em>
      );
    }
    return renderSegmentWithLinks(token, idx);
  });
}

// A markdown table separator row ("|---|---|") or a lone "---" divider — this
// WhatsApp-style bubble has no table layout, so these would otherwise render
// as literal, broken pipe/dash characters. Drop them entirely.
function isTableSeparatorLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.length > 0 && /^[|:\s-]+$/.test(trimmed) && trimmed.includes("-");
}

// A markdown table data row ("| Product | Qty | Unit |"). There's no table
// UI here, so collapse the non-empty cells into one line — a safety net for
// when the model emits a table despite being told not to.
function tableRowCells(line: string): string[] | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return null;
  const cells = trimmed
    .slice(1, -1)
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  return cells.length > 0 ? cells : null;
}

/**
 * WhatsAppText converts raw AI message markdown into WhatsApp business chat style:
 * 1. Bold: **text** -> <strong> (no literal asterisks shown)
 * 2. Headers: strip #, ##, ### -> render as bold line
 * 3. Bullet lists: lines starting with "- " or "* " -> lines starting with "• "
 * 4. Numbered lists: keep as-is (1., 2.)
 * 5. Line breaks: preserve all \n line breaks naturally
 * 6. Extra markdown: strip stray backticks, etc.
 */
export function WhatsAppText({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <div className="whatsapp-text space-y-0.5 text-[13.5px] leading-relaxed text-slate-800">
      {lines.map((rawLine, i) => {
        const line = rawLine;

        // 0. Markdown table rows/separators have no table layout here —
        // drop separator rows, collapse data rows into one line, instead of
        // showing raw "|"/"-" characters. Safety net; the model is also
        // told not to emit tables in the first place.
        if (isTableSeparatorLine(line)) {
          return null;
        }
        const cells = tableRowCells(line);
        if (cells) {
          return (
            <div key={i} className="leading-relaxed">
              {cells.join("  •  ")}
            </div>
          );
        }

        // A malformed/one-sided table row (starts with "|" but never closes
        // with one) doesn't match tableRowCells — strip just the stray
        // leading pipe so it doesn't show up as a literal "|" in the bubble.
        const noStrayPipe = line.trim().endsWith("|") ? line : line.replace(/^(\s*)\|\s*/, "$1");

        // 1. Headers: #, ##, ### -> strip hashes and render as bold line
        const headerMatch = noStrayPipe.match(/^#{1,6}\s+(.*)/);
        if (headerMatch) {
          return (
            <div key={i} className="font-bold text-slate-900 my-0.5">
              {parseInlineFormatting(headerMatch[1])}
            </div>
          );
        }

        // 2. Bullet lists: lines starting with "- " or "* " -> "• "
        const bulletMatch = noStrayPipe.match(/^(\s*)(?:-\s+|\*\s+)(.*)/);
        if (bulletMatch) {
          return (
            <div key={i} className="flex items-start gap-1.5 my-0.5 ml-0.5">
              <span className="text-slate-600 select-none shrink-0">•</span>
              <span className="flex-1">
                {parseInlineFormatting(bulletMatch[2])}
              </span>
            </div>
          );
        }

        // 3. Numbered lists: lines starting with "1. " or "2. "
        const numMatch = noStrayPipe.match(/^(\s*)(\d+\.)\s+(.*)/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-1.5 my-0.5 ml-0.5">
              <span className="text-slate-600 select-none shrink-0 font-medium">
                {numMatch[2]}
              </span>
              <span className="flex-1">
                {parseInlineFormatting(numMatch[3])}
              </span>
            </div>
          );
        }

        // 4. Empty line -> space spacing
        if (noStrayPipe.trim() === "") {
          return <div key={i} className="h-2" />;
        }

        // 5. Standard line with bold/italic parsing
        return (
          <div key={i} className="leading-relaxed">
            {parseInlineFormatting(noStrayPipe)}
          </div>
        );
      })}
    </div>
  );
}

export default WhatsAppText;
