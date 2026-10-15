const config = {
  // In dev, /api goes through the Vite proxy to the production API
  API_URL:
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? "/api" : "https://api.marcuscoelho.com"),
};

export default config;
