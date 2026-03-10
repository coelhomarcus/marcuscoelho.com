import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import { nightOwl as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { RxClipboardCopy as CopyIcon } from "react-icons/rx";
import { useToast } from "@/components/Toast/Toast";

import type { HeadingProps, PreComponentProps } from "@/types";

import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const createHeadingClickHandler =
  (id: string, onCopy?: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", `#${id}`);
    }

    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);

    if (onCopy) {
      onCopy();
    }
  };

const components = {
  h1: function H1Component(props: HeadingProps) {
    const { toast } = useToast();
    const id = slugify(String(props.children));

    return (
      <h1
        id={id}
        className="scroll-mt-20 font-[Times_New_Roman] italic text-3xl md:text-4xl mt-10 mb-5 first:mt-0 pb-3 border-b border-zinc-800"
      >
        <a
          href={`#${id}`}
          className="heading-link text-zinc-100 no-underline hover:text-zinc-300 active:text-zinc-500 cursor-pointer select-none transition-colors duration-200"
          onClick={createHeadingClickHandler(id, () =>
            toast("Link da seção copiado!"),
          )}
        >
          {props.children}
        </a>
      </h1>
    );
  },
  h2: function H2Component(props: HeadingProps) {
    const { toast } = useToast();
    const id = slugify(String(props.children));

    return (
      <h2
        id={id}
        className="scroll-mt-20 font-[Times_New_Roman] italic text-2xl md:text-3xl mt-8 mb-4 pb-2 border-b border-zinc-800/60"
      >
        <a
          href={`#${id}`}
          className="heading-link text-zinc-100 no-underline hover:text-zinc-300 active:text-zinc-500 cursor-pointer select-none transition-colors duration-200"
          onClick={createHeadingClickHandler(id, () =>
            toast("Link da seção copiado!"),
          )}
        >
          {props.children}
        </a>
      </h2>
    );
  },
  h3: function H3Component(props: HeadingProps) {
    const { toast } = useToast();
    const id = slugify(String(props.children));

    return (
      <h3
        id={id}
        className="scroll-mt-20 font-[Times_New_Roman] italic text-xl md:text-2xl mt-6 mb-3"
      >
        <a
          href={`#${id}`}
          className="heading-link text-zinc-200 no-underline hover:text-zinc-300 active:text-zinc-500 cursor-pointer select-none transition-colors duration-200"
          onClick={createHeadingClickHandler(id, () =>
            toast("Link da seção copiado!"),
          )}
        >
          {props.children}
        </a>
      </h3>
    );
  },
  h4: function H4Component(props: HeadingProps) {
    const { toast } = useToast();
    const id = slugify(String(props.children));

    return (
      <h4
        id={id}
        className="scroll-mt-20 text-lg md:text-xl font-semibold mt-5 mb-2 text-zinc-200"
      >
        <a
          href={`#${id}`}
          className="heading-link text-zinc-200 no-underline hover:text-zinc-300 active:text-zinc-500 cursor-pointer select-none transition-colors duration-200"
          onClick={createHeadingClickHandler(id, () =>
            toast("Link da seção copiado!"),
          )}
        >
          {props.children}
        </a>
      </h4>
    );
  },
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p
      className="text-zinc-400 mb-5 leading-[1.8] text-[15px]"
      {...props}
    />
  ),
  a: (props: React.HTMLProps<HTMLAnchorElement>) => (
    <a
      className="text-zinc-200 underline decoration-zinc-600 underline-offset-3 hover:decoration-zinc-300 transition-colors duration-200"
      target="_blank"
      {...props}
    >
      {props.children}
    </a>
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul
      className="text-zinc-400 mb-5 pl-6 space-y-2 list-disc marker:text-zinc-600"
      {...props}
    />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="text-zinc-400 leading-[1.7] text-[15px]" {...props} />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => (
    <span
      className="text-sm text-zinc-300 px-1.5 py-0.5 bg-zinc-800/80 border border-zinc-700/50 rounded-md font-mono"
      {...props}
    />
  ),

  pre: function PreComponent({ children, ...rest }: PreComponentProps) {
    const { toast } = useToast();
    const child = children.props;
    const language = child.className?.replace("language-", "") || "text";
    const code = child.children.trim?.() || "";

    const handleCopyCode = () => {
      navigator.clipboard.writeText(code);
      toast("Código copiado!");
    };

    return (
      <div className="relative group my-8 rounded-xl overflow-hidden border border-zinc-800">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800">
          <span className="text-xs text-zinc-500 font-mono">{language}</span>
          <button
            onClick={handleCopyCode}
            className="p-1 text-zinc-500 hover:text-zinc-200 active:scale-90 transition-colors cursor-pointer rounded-md"
            aria-label="Copiar código"
          >
            <CopyIcon className="w-3.5 h-3.5" />
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={theme}
          customStyle={{
            background: "",
            padding: "1.25rem",
            fontSize: "0.875rem",
            lineHeight: "1.6",
            margin: 0,
          }}
          className="!bg-black/60 scrollbar scrollbar-content !rounded-none !border-0"
          {...rest}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  },
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="text-zinc-100 font-semibold" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-2 border-zinc-600 pl-5 py-3 my-8 text-zinc-400 italic text-[15px] leading-[1.7]"
      {...props}
    />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol
      className="text-zinc-400 mb-5 pl-6 space-y-2 list-decimal marker:text-zinc-600"
      {...props}
    />
  ),
  hr: () => (
    <hr className="border-none my-10 flex justify-center before:content-['···'] before:text-zinc-600 before:tracking-[0.5em] before:text-lg" />
  ),
};

export default components;
