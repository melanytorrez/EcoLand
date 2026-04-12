export interface FeatureFlags {
  reforestacion: boolean;
  campanasReciclaje: boolean;
  reciclaje: boolean;
  estadisticas: boolean;
}

export const FEATURE_FLAGS: FeatureFlags = {
  reforestacion: true,
  campanasReciclaje: false,
  reciclaje: true,
  estadisticas: false,
};
