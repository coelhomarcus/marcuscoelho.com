import { useState } from "react";
import config from "@/data/config";

type FormStatus = "idle" | "sending" | "success" | "error";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export const useContact = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  const isValid =
    form.name.length >= 2 &&
    form.email.includes("@") &&
    form.message.length >= 10;

  const setField = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    } catch {
      setStatus("error");
    }
  };

  return { form, status, isValid, setField, handleSubmit };
};
