const HeroSection = () => {
  return (
    <div className="min-h-[150px]">
      <div className="flex flex-col justify-center gap-8 pt-10 pb-4">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
          Desenvolvedor
          <br />
          <span className="font-[Times_New_Roman] italic text-5xl">
            Full Stack.
          </span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Estudante de Sistemas de Informação na UNIFESSPA [7/8] e desenvolvedor
          no projeto PET-Saúde: Inovação e Saúde Digital no SUS, pelo Ministério
          da Saúde.
          <br />
          <br />
          Também pesquiso o uso de LLMs na análise de desempenho acadêmico. No
          tempo livre, gosto de explorar novas tecnologias, criar projetos
          pessoais e brincar com meu gato.
          <br />
          Quer saber mais?{" "}
          <a
            href="https://docs.google.com/document/d/1wgOhwh-1YT-LRog9j1tvxzBVKfraoSzps1AiBGuSx9A/export?format=pdf"
            download
            className="text-zinc-300 underline underline-offset-4 hover:text-zinc-100 transition-colors"
          >
            Veja meu currículo
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
