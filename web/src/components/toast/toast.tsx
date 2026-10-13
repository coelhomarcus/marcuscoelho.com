import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RxCheck as CheckIcon } from "react-icons/rx";
import { ToastContext } from "./toast-context";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const toast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center gap-2 rounded-lg bg-popover px-3 py-2 text-sm text-popover-foreground ring-1 ring-foreground/10 shadow-lg"
            >
              <CheckIcon className="size-3.5 text-lime-300 shrink-0" />
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
