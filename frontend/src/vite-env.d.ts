/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_DATA_MODE?: "mock" | "api";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.json" {
  import type { DistrictFeatureCollection } from "./app/data/geoJsonTypes";
  const value: DistrictFeatureCollection;
  export default value;
}
