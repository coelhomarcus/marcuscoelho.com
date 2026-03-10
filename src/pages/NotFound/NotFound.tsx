import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center mt-10 items-center gap-2">
      <h1 className="text-center text-xl font-medium text-zinc-100">
        Pagina não encontrada!
      </h1>
      <p className="text-center text-sm text-zinc-500 mb-2">
        A página que você está procurando não existe.
      </p>
      <div className="relative w-50 h-50 self-center mb-3">
        <div className="absolute inset-0 w-full h-full bg-zinc-800 animate-pulse rounded-xl" />
        <img
          loading="lazy"
          src="https://i.pinimg.com/736x/7c/17/e3/7c17e383af28fa6f1526f059911eb2c1.jpg"
          alt="Imagem de personagem confuso"
          className="absolute inset-0 w-full h-full object-cover select-none rounded-xl"
        />
      </div>{" "}
      <Link
        to="/"
        className="text-xs px-4 py-2 border border-zinc-700 text-zinc-500 hover:text-zinc-100 transition-all duration-100 rounded-full"
      >
        Voltar para o Início
      </Link>
    </div>
  );
};

export default NotFound;
