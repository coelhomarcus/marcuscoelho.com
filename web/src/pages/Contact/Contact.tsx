import PageTitle from "@/components/PageTitle/PageTitle";
import { CheckIcon } from "@/components/icons/check";
import { SendIcon } from "@/components/icons/send";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";
import { XIcon as AlertIcon } from "@/components/icons/x";
import { motion } from "motion/react";
import { useContact, type FieldState } from "@/hooks/useContact";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const inputStateClasses: Record<FieldState, string> = {
  default: "",
  valid:
    "border-green-500/40 bg-green-900/10 focus-visible:border-green-500/60 focus-visible:ring-green-500/20 dark:bg-green-900/10",
  invalid:
    "border-red-500/40 bg-red-900/10 focus-visible:border-red-500/60 focus-visible:ring-red-500/20 dark:bg-red-900/10",
};

const Contact = () => {
  const submitIcon = useAnimatedIcon();
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputStateClasses[getFieldState("name")]}
              required
              minLength={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={inputStateClasses[getFieldState("email")]}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea
            id="message"
            placeholder="Sua mensagem (mínimo 10 caracteres)"
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            className={cn(
              inputStateClasses[getFieldState("message")],
              "min-h-28 resize-none",
            )}
            required
            minLength={10}
          />
        </div>

        <div className="flex items-center gap-3 mt-1">
          <Button
            type="submit"
            variant="outline"
            disabled={!isValid || status === "sending"}
            {...submitIcon.hoverProps}
            className={cn(
              "disabled:pointer-events-auto disabled:cursor-not-allowed",
              status === "success" &&
                "border-green-500/40 bg-green-900/10 text-green-400 hover:bg-green-900/10 hover:text-green-400 disabled:opacity-100",
              status !== "success" &&
                validationMessage &&
                "border-amber-500/30 bg-amber-900/10 text-amber-400 hover:bg-amber-900/10 hover:text-amber-400 disabled:opacity-100",
            )}
          >
            {status === "sending" ? (
              "Enviando..."
            ) : status === "success" ? (
              <>
                <CheckIcon ref={submitIcon.ref} size={16} />
                Enviado!
              </>
            ) : validationMessage ? (
              <>
                <AlertIcon ref={submitIcon.ref} size={16} />
                {validationMessage}
              </>
            ) : (
              <>
                <SendIcon ref={submitIcon.ref} size={16} />
                Enviar mensagem
              </>
            )}
          </Button>

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
