const config = {
  API_URL:
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? "/api" : "https://api.marcuscoelho.com"),
};

export default config;
