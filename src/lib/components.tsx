import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import { nightOwl as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import {
  RxClipboardCopy as CopyIcon,
  RxCheck as CheckIcon,
} from "react-icons/rx";

import type { CopyHookReturn, HeadingProps, PreComponentProps } from "@/types";

const useCopyWithFeedback = (duration = 1300): CopyHookReturn => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, duration);
  };

  return { isCopied, handleCopy };
};

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
    const { isCopied: isLinkCopied, handleCopy } = useCopyWithFeedback();
    const id = slugify(String(props.children));

    return (
      <h1
        id={id}
        className="scroll-mt-20 text-2xl md:text-3xl font-bold mt-6 mb-4 first:mt-0 border-b"
      >
        <a
          href={`#${id}`}
          className="heading-link text-zinc-100 no-underline font-bold hover:text-blue-500 active:text-zinc-500 cursor-pointer select-none transition-colors"
          onClick={createHeadingClickHandler(id, handleCopy)}
        >
          {isLinkCopied ? "Link copiado!" : props.children}
        </a>
      </h1>
    );
  },
  h2: function H2Component(props: HeadingProps) {
    const { isCopied: isLinkCopied, handleCopy } = useCopyWithFeedback();
    const id = slugify(String(props.children));

    return (
      <h2
        id={id}
        className="scroll-mt-20 text-xl md:text-2xl font-semibold mt-6 mb-3 border-b"
      >
        <a
          href={`#${id}`}
          className="heading-link text-zinc-100 no-underline font-semibold hover:text-blue-500 active:text-zinc-500 cursor-pointer select-none transition-colors"
          onClick={createHeadingClickHandler(id, handleCopy)}
        >
          {isLinkCopied ? "Link copiado!" : props.children}
        </a>
      </h2>
    );
  },
  h3: function H3Component(props: HeadingProps) {
    const { isCopied: isLinkCopied, handleCopy } = useCopyWithFeedback();
    const id = slugify(String(props.children));

    return (
      <h3
        id={id}
        className="scroll-mt-20 text-lg md:text-xl font-medium mt-5 mb-2"
      >
        <a
          href={`#${id}`}
          className="heading-link text-zinc-100 no-underline font-medium hover:text-blue-500 active:text-zinc-500 cursor-pointer select-none transition-colors"
          onClick={createHeadingClickHandler(id, handleCopy)}
        >
          {isLinkCopied ? "Link copiado!" : props.children}
        </a>
      </h3>
    );
  },
  h4: function H4Component(props: HeadingProps) {
    const { isCopied: isLinkCopied, handleCopy } = useCopyWithFeedback();
    const id = slugify(String(props.children));

    return (
      <h4
        id={id}
        className="scroll-mt-20 text-base md:text-lg font-medium mt-4 mb-2"
      >
        <a
          href={`#${id}`}
          className="heading-link text-zinc-100 no-underline font-medium hover:text-blue-500 active:text-zinc-500 cursor-pointer select-none transition-colors"
          onClick={createHeadingClickHandler(id, handleCopy)}
        >
          {isLinkCopied ? "Link copiado!" : props.children}
        </a>
      </h4>
    );
  },
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p
      className="text-zinc-500 mb-4 leading-relaxed font-medium"
      {...props}
    />
  ),
  a: (props: React.HTMLProps<HTMLAnchorElement>) => (
    <span>
      [
      <a
        className="group prose-base font-medium text-blue-500 underline hover:text-blue-500/80"
        target="_blank"
        {...props}
      >
        {props.children}
      </a>
      ]
    </span>
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="text-zinc-500 mb-4 pl-6 space-y-1" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="text-zinc-500 leading-relaxed" {...props} />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => (
    <span
      className="text-sm text-zinc-500 px-1.5 py-0.5 bg-zinc-800 border border-zinc-900 rounded-md font-mono"
      {...props}
    />
  ),

  pre: function PreComponent({ children, ...rest }: PreComponentProps) {
    const { isCopied, handleCopy } = useCopyWithFeedback();
    const child = children.props;
    const language = child.className?.replace("language-", "") || "text";
    const code = child.children.trim?.() || "";

    const handleCopyCode = () => {
      navigator.clipboard.writeText(code);
      handleCopy();
    };

    return (
      <div className="relative group my-6">
        <button
          onClick={handleCopyCode}
          className="absolute top-2 right-2 p-1 m-1 bg-transparent text-[#909090] hover:text-white active:scale-90 transition-colors focus:opacity-100 cursor-pointer rounded-md"
          aria-label="Copiar código"
        >
          {isCopied ? (
            <CheckIcon className="w-4 h-4 text-lime-300" />
          ) : (
            <CopyIcon className="w-4 h-4" />
          )}
        </button>
        <SyntaxHighlighter
          language={language}
          style={theme}
          customStyle={{
            background: "",
            padding: "1.25rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          className="rounded-md !bg-black !border !border-zinc-700 scrollbar scrollbar-content"
          {...rest}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  },
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="text-zinc-100 font-medium" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-zinc-700 pl-4 py-2 my-6 bg-zinc-800/50 text-zinc-500 italic"
      {...props}
    />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol
      className="text-zinc-500 mb-4 pl-6 space-y-1 list-decimal"
      {...props}
    />
  ),
};

export default components;
