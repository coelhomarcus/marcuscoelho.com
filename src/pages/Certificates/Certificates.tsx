import { arrCertificates } from "@/data/certificates";
import SimpleCard from "@/components/SimpleCard/SimpleCard";
import PageTitle from "@/components/PageTitle/PageTitle";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const Certificates = () => {
  return (
    <main className="text-zinc-100 space-y-8">
      <PageTitle title="Certificados" suffix />

      <motion.div {...fadeUp}>
        <div className="flex flex-col gap-1 pt-4">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Certificados
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Cursos e certificações ao longo da minha jornada.
          </p>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
      >
        {arrCertificates.map((certificate, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.15 + index * 0.04,
              ease: "easeOut",
            }}
          >
            <SimpleCard
              href={certificate.href}
              name={certificate.course}
              desc={certificate.teacher}
            />
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
};

export default Certificates;
