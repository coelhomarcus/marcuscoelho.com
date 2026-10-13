import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app.tsx";
import { BrowserRouter } from "react-router";
import { ToastProvider } from "./components/toast/toast.tsx";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ToastProvider>
      <App />
    </ToastProvider>
  </BrowserRouter>
);
