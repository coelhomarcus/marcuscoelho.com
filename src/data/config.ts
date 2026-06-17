const ENV = import.meta.env.VITE_ENV ?? "prod";

const config = {
  API_URL: import.meta.env.VITE_API_URL ?? "https://api.marcuscoelho.com",
  ENV,
  isDev: ENV === "dev",
};

export default config;
