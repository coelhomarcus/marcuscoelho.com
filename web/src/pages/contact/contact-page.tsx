import PageTitle from "@/components/page-title";
import { SectionRule } from "@/components/layout/stitch";
import { CheckIcon } from "@/components/icons/check";
import { SendIcon } from "@/components/icons/send";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";
import { XIcon as AlertIcon } from "@/components/icons/x";
import { motion } from "motion/react";
import { useContact } from "./hooks/use-contact";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ContactPage = () => {
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
    <main className="text-zinc-100 space-y-4">
      <PageTitle title="Contato" suffix />

      <motion.div {...fadeUp}>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Contato
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Tem alguma pergunta ou quer conversar? Me envie uma mensagem.
          </p>
        </div>
      </motion.div>

      <SectionRule />

      <motion.form
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <div className="grid grid-cols-1 @xl:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              aria-invalid={getFieldState("name") === "invalid"}
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
              aria-invalid={getFieldState("email") === "invalid"}
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
            aria-invalid={getFieldState("message") === "invalid"}
            className="min-h-28 resize-none"
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

export default ContactPage;
