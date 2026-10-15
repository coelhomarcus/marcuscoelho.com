import { certificates } from "@/data/certificates";
import { SectionRule } from "@/components/layout/stitch";
import CertificateCard from "./components/certificate-card";
import PageTitle from "@/components/page-title";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion";

const CertificatesPage = () => {
  return (
    <main className="text-zinc-100 space-y-4">
      <PageTitle title="Certificados" suffix />

      <motion.div {...fadeUp}>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Certificados
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Cursos e certificações ao longo da minha jornada.
          </p>
        </div>
      </motion.div>

      <SectionRule />

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="grid grid-cols-1 @xl:grid-cols-2 gap-2"
      >
        {certificates.map((certificate, index) => (
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
            <CertificateCard
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

export default CertificatesPage;
