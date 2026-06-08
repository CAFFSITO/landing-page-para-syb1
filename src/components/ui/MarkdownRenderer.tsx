"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={`syb-markdown ${className ?? ""}`.trim()}
      style={{ fontFamily: "Merriweather, Georgia, serif" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1
              style={{
                fontFamily: "Merriweather, Georgia, serif",
                fontWeight: 700,
                fontSize: "1.75rem",
                lineHeight: 1.2,
                marginTop: "1.5em",
                marginBottom: "0.6em",
                color: "inherit",
              }}
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              style={{
                fontFamily: "Merriweather, Georgia, serif",
                fontWeight: 700,
                fontSize: "1.4rem",
                lineHeight: 1.25,
                marginTop: "1.4em",
                marginBottom: "0.5em",
                color: "inherit",
              }}
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              style={{
                fontFamily: "Merriweather, Georgia, serif",
                fontWeight: 700,
                fontSize: "1.15rem",
                lineHeight: 1.3,
                marginTop: "1.2em",
                marginBottom: "0.4em",
                color: "inherit",
              }}
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p
              style={{
                lineHeight: 1.7,
                marginBottom: "1em",
                color: "inherit",
              }}
              {...props}
            />
          ),
          ul: ({ ...props }) => (
            <ul
              style={{
                marginBottom: "1em",
                paddingLeft: "1.5em",
                listStyleType: "disc",
                listStylePosition: "outside",
              }}
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              style={{
                marginBottom: "1em",
                paddingLeft: "1.5em",
                listStyleType: "decimal",
                listStylePosition: "outside",
              }}
              {...props}
            />
          ),
          li: ({ ...props }) => (
            <li style={{ marginBottom: "0.4em", lineHeight: 1.7 }} {...props} />
          ),
          strong: ({ ...props }) => (
            <strong style={{ fontWeight: 700, color: "inherit" }} {...props} />
          ),
          em: ({ ...props }) => (
            <em style={{ fontStyle: "italic", color: "inherit" }} {...props} />
          ),
          code: ({ ...props }) => (
            <code
              style={{
                backgroundColor: "rgba(157,92,192,0.125)",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.9em",
                color: "inherit",
              }}
              {...props}
            />
          ),
          a: ({ ...props }) => (
            <a
              style={{ color: "#9D5CC0", textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              style={{
                borderLeft: "3px solid #9D5CC0",
                paddingLeft: "1em",
                marginLeft: 0,
                marginBottom: "1em",
                fontStyle: "italic",
                color: "inherit",
                opacity: 0.85,
              }}
              {...props}
            />
          ),
          hr: () => (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid rgba(157,92,192,0.25)",
                margin: "1.5em 0",
              }}
            />
          ),
          table: ({ ...props }) => (
            <div style={{ overflowX: "auto", marginBottom: "1em" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.92em",
                  lineHeight: 1.6,
                }}
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead
              style={{
                borderBottom: "2px solid rgba(157,92,192,0.4)",
              }}
              {...props}
            />
          ),
          tbody: ({ ...props }) => <tbody {...props} />,
          tr: ({ ...props }) => (
            <tr
              style={{
                borderBottom: "1px solid rgba(157,92,192,0.15)",
              }}
              {...props}
            />
          ),
          th: ({ ...props }) => (
            <th
              style={{
                padding: "0.6em 1em",
                textAlign: "left",
                fontWeight: 700,
                fontSize: "0.85em",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "rgba(157,92,192,0.9)",
                whiteSpace: "nowrap",
              }}
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td
              style={{
                padding: "0.55em 1em",
                color: "inherit",
                verticalAlign: "top",
              }}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
