import PageTitle from "@/components/PageTitle/PageTitle";
import { MailIcon, CheckIcon } from "@/lib/icons";
import { motion } from "motion/react";
import { useContact } from "@/hooks/useContact";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const Contact = () => {
  const { form, status, isValid, setField, handleSubmit } = useContact();

  return (
    <div className="text-foreground">
      <PageTitle title="Contato" suffix />

      <motion.div {...fadeUp}>
        <h1 className="text-xl font-semibold mb-2">Contato</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Tem alguma pergunta ou quer conversar? Me envie uma mensagem.
        </p>
      </motion.div>

      <motion.form
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Nome
          </label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className="w-full rounded border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            required
            minLength={2}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            className="w-full rounded border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="message" className="text-sm font-medium">
            Mensagem
          </label>
          <textarea
            id="message"
            placeholder="Sua mensagem (mínimo 10 caracteres)"
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            rows={5}
            className="w-full rounded border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            required
            minLength={10}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || status === "sending"}
          className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {status === "sending" ? (
            "Enviando..."
          ) : status === "success" ? (
            <>
              <CheckIcon className="size-4" />
              Enviado!
            </>
          ) : (
            <>
              <MailIcon className="size-4" />
              Enviar mensagem
            </>
          )}
        </button>

        {status === "error" && (
          <p className="text-sm text-destructive">
            Erro ao enviar mensagem. Tente novamente.
          </p>
        )}

        {status === "success" && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Mensagem enviada com sucesso! Retornarei em breve.
          </p>
        )}
      </motion.form>
    </div>
  );
};

export default Contact;
