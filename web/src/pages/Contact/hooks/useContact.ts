import { useState } from "react";
import config from "@/data/config";

type FormStatus = "idle" | "sending" | "success" | "error";
export type FieldState = "default" | "valid" | "invalid";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useContact = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const nameValid = form.name.length >= 2;
  const emailValid = emailRegex.test(form.email);
  const messageValid = form.message.length >= 10;

  const isValid = nameValid && emailValid && messageValid;

  const setField = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    setStatus((prev) =>
      prev === "success" || prev === "error" ? "idle" : prev,
    );
  };

  const getButtonLabel = (): string | null => {
    if (form.name.length > 0 && !nameValid)
      return "Nome precisa ter mais de 2 caracteres";
    if (form.email.length > 0 && !emailValid) return "Email inválido";
    if (form.message.length > 0 && !messageValid)
      return "Mensagem muito curta (mín. 10 caracteres)";
    return null;
  };

  const getFieldState = (field: keyof ContactForm): FieldState => {
    if (!touched[field]) return "default";
    const valid = { name: nameValid, email: emailValid, message: messageValid };
    return valid[field] ? "valid" : "invalid";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || status === "sending") return;

    setStatus("sending");

    try {
      const res = await fetch(config.API_URL + "/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTouched({ name: false, email: false, message: false });
    } catch {
      setStatus("error");
    }
  };

  return {
    form,
    status,
    isValid,
    setField,
    handleSubmit,
    getButtonLabel,
    getFieldState,
  };
};
