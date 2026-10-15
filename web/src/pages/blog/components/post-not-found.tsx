import { Link } from "react-router";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

const PostNotFound = () => {
  return (
    <main className="text-zinc-100 space-y-4">
      <motion.div {...fadeUp}>
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="text-center text-2xl sm:text-3xl font-bold text-zinc-100">
            Esse post não existe!
          </h1>
          <p className="text-center text-sm text-zinc-400 mb-2 leading-relaxed">
            Talvez ele tenha sido removido ou nunca existiu.
          </p>

          <div className="relative w-50 h-50 self-center mb-3">
            <div className="absolute inset-0 w-full h-full bg-zinc-800 animate-pulse rounded-xl" />
            <img
              loading="lazy"
              src="https://i.pinimg.com/736x/07/24/a3/0724a3febab29fbb247abde72d51d184.jpg"
              alt="Imagem de personagem confuso"
              className="absolute inset-0 w-full h-full object-cover select-none rounded-xl"
            />
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/60 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors"
          >
            Voltar pro Blog
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default PostNotFound;
