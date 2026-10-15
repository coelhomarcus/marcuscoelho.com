const config = {
  API_URL: import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_URL || "https://api.marcuscoelho.com",
  GITHUB_USERNAME: "coelhomarcus",
};

export default config;
