export type GeoJsonPolygon = {
  type: "Polygon";
  coordinates: number[][][];
};

export type GeoJsonMultiPolygon = {
  type: "MultiPolygon";
  coordinates: number[][][][];
};

export type GeoJsonGeometry = GeoJsonPolygon | GeoJsonMultiPolygon;

export type DistrictFeature = {
  type: "Feature";
  properties: {
    district: string;
    economicRegion: string;
    shapeID: string;
  };
  geometry: GeoJsonGeometry;
};

export type DistrictFeatureCollection = {
  type: "FeatureCollection";
  features: DistrictFeature[];
};
