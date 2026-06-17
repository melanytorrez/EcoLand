export interface FeatureFlags {
  campanasReciclaje: boolean;
  reciclaje: boolean;
  estadisticas: boolean;
}

export const FEATURE_FLAGS: FeatureFlags = {
  campanasReciclaje: false,
  reciclaje: true,
  estadisticas: true,
};
