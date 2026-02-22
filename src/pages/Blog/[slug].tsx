import { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { useParams, Link, useLocation } from "react-router";
import PageTitle from "@/components/PageTitle/PageTitle";

import { BackIcon, CommitIcon } from "@/lib/icons";

import { arrBlog, loadPost } from "./posts/_posts";
import components from "../../lib/components";

const Post = () => {
  const { slug } = useParams();
  const post = arrBlog.find((p) => p.slug === slug);
  const [MDXComponent, setMDXComponent] = useState<React.ComponentType | null>(
    null,
  );
  const [titleClicked, setTitleClicked] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const importer = loadPost(slug);
    if (importer) {
      importer().then((mod) => {
        const Component = (mod as { default: React.ComponentType }).default;
        setMDXComponent(() => Component);
      });
    } else {
      setMDXComponent(() => () => (
        <p className="text-red-500">Post não encontrado</p>
      ));
    }
  }, [slug]);

  if (!MDXComponent)
    return (
      <div className="flex items-center justify-center">
        <CommitIcon className="text-muted-foreground animate-[spin_3s_linear_infinite] duration-100 size-6 mt-10" />
      </div>
    );

  if (!post) return <PostNotFound />;

  return (
    <div className="text-foreground w-full">
      {post && <PageTitle title={post.title} />}

      <div className="mt-4 flex justify-between mb-2 pb-2 border-b border-border/80">
        <Link
          to="/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-100 flex items-center gap-2"
        >
          <BackIcon className="inline" /> Voltar
        </Link>
        <button
          className="flex items-center gap-8 cursor-pointer hover:text-muted-foreground"
          onClick={() => {
            const currentUrl = window.location.href;
            navigator.clipboard.writeText(currentUrl);
            setTitleClicked(true);
            setTimeout(() => {
              setTitleClicked(false);
              console.log("teste");
            }, 1000);
          }}
        >
          {titleClicked ? "Link Copiado!" : post.title}
        </button>
        <div className="hidden sm:flex sm:gap-0 items-center text-muted-foreground text-xs font-mono">
          <span>{post.date}</span>
        </div>
      </div>

      <MDXProvider components={components}>
        <article className="prose max-w-full">
          <ScrollToHashOnLoad />
          <MDXComponent />
        </article>
      </MDXProvider>
    </div>
  );
};

function PostNotFound() {
  return (
    <div className="flex flex-col justify-center mt-10 items-center gap-2">
      <h1 className="text-center text-xl font-medium text-foreground">
        Esse post não existe!
      </h1>
      <p className="text-center text-sm text-muted-foreground mb-2">
        Talvez ele tenha sido removido ou nunca existiu.
      </p>

      <div className="relative w-50 h-50 self-center mb-3">
        <div className="absolute inset-0 w-full h-full bg-muted animate-pulse rounded-xl" />
        <img
          loading="lazy"
          src="https://i.pinimg.com/736x/07/24/a3/0724a3febab29fbb247abde72d51d184.jpg"
          alt="Imagem de personagem confuso"
          className="absolute inset-0 w-full h-full object-cover select-none rounded-xl"
        />
      </div>

      <Link
        to="/blog"
        className="text-xs px-4 py-2 border border-border text-muted-foreground hover:text-foreground transition-all duration-100"
      >
        Voltar pro Blog
      </Link>
    </div>
  );
}

function ScrollToHashOnLoad() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return null;
}

export default Post;
