// Game Hub types

export interface GameEmbedConfig {
  url: string;
  width?: string;
  height?: string;
  allowFullscreen?: boolean;
}

export interface GameStats {
  plays?: number;
  rating?: number;
  lastUpdated?: string;
}
