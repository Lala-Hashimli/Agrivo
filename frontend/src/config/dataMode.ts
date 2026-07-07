export type DataMode = "mock" | "api";

export const DATA_MODE: DataMode =
  import.meta.env.VITE_DATA_MODE === "api" ? "api" : "mock";

export const isApiMode = DATA_MODE === "api";
export const isMockMode = DATA_MODE === "mock";
