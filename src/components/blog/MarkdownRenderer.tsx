import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return String(children ?? "");
}

const components: Components = {
  h2({ children }) {
    const text = extractText(children);
    const id = slugify(text);
    return (
      <h2
        id={id}
        className="scroll-mt-24 text-xl font-bold text-brand-indigo mt-10 mb-4"
      >
        {children}
      </h2>
    );
  },

  h3({ children }) {
    const text = extractText(children);
    const id = slugify(text);
    return (
      <h3
        id={id}
        className="scroll-mt-24 text-lg font-semibold text-brand-indigo mt-8 mb-3"
      >
        {children}
      </h3>
    );
  },

  p({ children }) {
    return <p className="text-gray-700 leading-relaxed mb-4">{children}</p>;
  },

  ul({ children }) {
    return (
      <ul className="mb-4 ml-6 list-disc space-y-1 text-gray-700 leading-relaxed">
        {children}
      </ul>
    );
  },

  ol({ children }) {
    return (
      <ol className="mb-4 ml-6 list-decimal space-y-1 text-gray-700 leading-relaxed">
        {children}
      </ol>
    );
  },

  li({ children }) {
    return <li className="pl-1">{children}</li>;
  },

  a({ href, children }) {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        className="text-brand-coral underline hover:no-underline"
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  },

  strong({ children }) {
    return (
      <strong className="font-semibold text-brand-indigo">{children}</strong>
    );
  },

  blockquote({ children }) {
    return (
      <blockquote className="my-6 border-l-4 border-brand-coral bg-brand-cream py-3 pl-4 pr-3 italic text-gray-700">
        {children}
      </blockquote>
    );
  },

  hr() {
    return <hr className="my-8 border-gray-200" />;
  },

  table({ children }) {
    return (
      <div className="my-6 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    );
  },

  thead({ children }) {
    return (
      <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
        {children}
      </thead>
    );
  },

  tbody({ children }) {
    return <tbody className="divide-y divide-gray-100">{children}</tbody>;
  },

  tr({ children }) {
    return (
      <tr className="even:bg-gray-50 transition-colors hover:bg-gray-100">
        {children}
      </tr>
    );
  },

  th({ children }) {
    return <th className="px-4 py-3 font-semibold">{children}</th>;
  },

  td({ children }) {
    return <td className="px-4 py-3 text-gray-700">{children}</td>;
  },

  code({ className, children }) {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-brand-coral">
          {children}
        </code>
      );
    }
    return (
      <code className={`${className ?? ""}`}>
        {children}
      </code>
    );
  },

  pre({ children }) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-100">
        {children}
      </pre>
    );
  },

  img({ src, alt }) {
    return (
      <span className="my-6 block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          className="w-full rounded-lg"
          loading="lazy"
        />
        {alt && (
          <span className="mt-2 block text-center text-xs text-gray-400">
            {alt}
          </span>
        )}
      </span>
    );
  },
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
