import { language as bashLanguage } from "@twinkleplop/bash";
import { language as jsonLanguage } from "@twinkleplop/json";
import "@twinkleplop/theme-night-owl";
import { CopyIcon } from "@/components/icons/copy";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";
import { useToast } from "@/components/toast/toast-context";
import { slugify } from "@/lib/slug.mjs";

const highlighters = new Map<string, (code: string) => string>([
  ["bash", bashLanguage()],
  ["json", jsonLanguage()],
]);

const codeClassName =
  "bg-background/60 text-zinc-300 [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:bg-transparent [&_pre]:text-inherit [&_pre]:p-5 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-[1.6]";

type HeadingProps = React.HTMLProps<HTMLHeadingElement>;

interface PreComponentProps {
  children: React.ReactElement<{ className?: string; children: string }>;
  [key: string]: unknown;
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
    <p className="text-zinc-400 mb-5 leading-[1.8] text-[15px]" {...props} />
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

  pre: function PreComponent({ children }: PreComponentProps) {
    const { toast } = useToast();
    const copy = useAnimatedIcon();
    const child = children.props;
    const language = child.className?.replace("language-", "") || "text";
    const code = child.children.trim?.() || "";
    const html = highlighters.get(language)?.(code);

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
            {...copy.hoverProps}
          >
            <CopyIcon ref={copy.ref} size={14} />
          </button>
        </div>
        {html ? (
          <div className={codeClassName} dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className={codeClassName}>
            <pre className="twinkleplop">
              <code>{code}</code>
            </pre>
          </div>
        )}
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
