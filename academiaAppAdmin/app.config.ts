// app.config.ts
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): any => ({
  ...config,
  name: "Academia App Admin",
  slug: "academiaappadmin",
  version: "1.0.0",
  sdkVersion: "53.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  entryPoint: "./index.js",
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      unstable_src: "./app",
    },
    API_BASE_URL: "http://192.168.1.76:8080", // seu backend local
  },
  plugins: ["expo-router"],
});
