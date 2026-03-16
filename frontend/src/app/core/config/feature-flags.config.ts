export interface FeatureFlags {
  reforestacion: boolean;
  campanasReciclaje: boolean;
  reciclaje: boolean;
  estadisticas: boolean;
}

export const FEATURE_FLAGS: FeatureFlags = {
  reforestacion: false,
  campanasReciclaje: false,
  reciclaje: false,
  estadisticas: false,
};
