import PageTitle from "@/components/PageTitle/PageTitle";
import { ExternalLinkIcon } from "@/lib/icons";

import WorksExperience from "@/components/WorksExperience/WorksExperience";
import Skills from "@/components/Skills/Skills";

const About = () => {
  return (
    <main className="text-foreground">
      <PageTitle title="Marcus Coelho" />
      <h1 className="text-xl font-semibold mb-2">Marcus Coelho</h1>
      <p className="text-muted-foreground text-base mb-4 font-medium">
        Olá! Sou estudante de Sistemas de Informação [7/8] na UNIFESSPA,
        desenvolvedor no projeto PET-Saúde: Inovação e Saúde Digital no SUS, do
        Ministério da Saúde, e também participo de pesquisas com LLMs voltadas à
        análise de desempenho de discentes. No meu tempo livre, gosto de
        explorar novas tecnologias, desenvolver projetos pessoais e brincar com
        meu gato. Se quiser saber mais sobre minha trajetória,{" "}
        <span>
          <a
            className="text-foreground hover:underline hover:text-accent-foreground"
            href="https://docs.google.com/document/d/1wgOhwh-1YT-LRog9j1tvxzBVKfraoSzps1AiBGuSx9A/export?format=pdf"
            download
          >
            veja meu currículo{<ExternalLinkIcon className="inline" />}
          </a>
        </span>
      </p>
      <Skills />
      <WorksExperience />
    </main>
  );
};

export default About;
