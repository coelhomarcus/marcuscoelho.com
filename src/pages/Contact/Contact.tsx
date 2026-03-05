import PageTitle from "@/components/PageTitle/PageTitle";
import { LuMail as MailIcon } from "react-icons/lu";
import { RxCheck as CheckIcon } from "react-icons/rx";
import { RxCross2 as AlertIcon } from "react-icons/rx";
import { motion } from "motion/react";
import { useContact, type FieldState } from "@/hooks/useContact";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const baseInput =
  "w-full rounded-[8px] border px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500/60 transition-colors outline-none";

const inputStateClasses: Record<FieldState, string> = {
  default:
    "border-zinc-700/50 bg-zinc-800/30 focus:border-zinc-500 focus:bg-zinc-800/60",
  valid:
    "border-green-500/40 bg-green-900/10 focus:border-green-500/60 focus:bg-green-900/20",
  invalid:
    "border-red-500/40 bg-red-900/10 focus:border-red-500/60 focus:bg-red-900/20",
};

const getInputClasses = (state: FieldState) =>
  `${baseInput} ${inputStateClasses[state]}`;

const Contact = () => {
  const {
    form,
    status,
    isValid,
    setField,
    handleSubmit,
    getButtonLabel,
    getFieldState,
  } = useContact();

  const validationMessage =
    status === "idle" || status === "error" ? getButtonLabel() : null;

  return (
    <main className="text-zinc-100 space-y-6">
      <PageTitle title="Contato" suffix />

      <motion.div {...fadeUp}>
        <div className="flex flex-col gap-1 pt-4">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Contato
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Tem alguma pergunta ou quer conversar? Me envie uma mensagem.
          </p>
        </div>
      </motion.div>

      <motion.form
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-zinc-300">
              Nome
            </label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={getInputClasses(getFieldState("name"))}
              required
              minLength={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={getInputClasses(getFieldState("email"))}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="message"
            className="text-sm font-medium text-zinc-300"
          >
            Mensagem
          </label>
          <textarea
            id="message"
            placeholder="Sua mensagem (mínimo 10 caracteres)"
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            rows={5}
            className={`${getInputClasses(getFieldState("message"))} resize-none`}
            required
            minLength={10}
          />
        </div>

        <div className="flex items-center gap-3 mt-1">
          <button
            type="submit"
            disabled={!isValid || status === "sending"}
            className={`inline-flex items-center gap-2 rounded-[8px] border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              status === "success"
                ? "border-green-500/40 bg-green-900/10 text-green-400"
                : validationMessage
                  ? "border-amber-500/30 bg-amber-900/10 text-amber-400 opacity-100 cursor-not-allowed"
                  : "border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/60 text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            {status === "sending" ? (
              "Enviando..."
            ) : status === "success" ? (
              <>
                <CheckIcon className="size-4" />
                Enviado!
              </>
            ) : validationMessage ? (
              <>
                <AlertIcon className="size-4 shrink-0" />
                {validationMessage}
              </>
            ) : (
              <>
                <MailIcon className="size-4" />
                Enviar mensagem
              </>
            )}
          </button>

          {status === "error" && (
            <p className="text-sm text-red-400">
              Erro ao enviar. Tente novamente.
            </p>
          )}

          {status === "success" && (
            <p className="text-sm text-green-400">
              Mensagem enviada! Retornarei em breve.
            </p>
          )}
        </div>
      </motion.form>
    </main>
  );
};

export default Contact;
