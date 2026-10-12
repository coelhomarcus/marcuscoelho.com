import { createContext, useContext } from "react";

interface ToastContextType {
  toast: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);
