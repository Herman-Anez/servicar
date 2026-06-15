import {
  DataStyleConfig,
  DisplayConfig,
  EffectsConfig,
  FontsConfig,
  ProtectedRoutesConfig,
  RoutesConfig,
  SchemaConfig,
  StyleConfig,
} from "@/types";
const baseURL: string = "https://servicar.app";

const routes: RoutesConfig = {
  "/": true,
  "/login": true,
  "/dashboard": true,
  "/fichas": true,
  "/taller": true,
  "/ticket": true,
  "/admin": true,
};

const display: DisplayConfig = {
  location: false,
  time: false,
  themeSwitcher: true,
};

const protectedRoutes: ProtectedRoutesConfig = {};

import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";

const heading = Inter({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const label = Inter({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const fonts: FontsConfig = {
  heading,
  body,
  label,
  code,
};

const style: StyleConfig = {
  theme: "light",
  neutral: "sand",
  brand: "red",
  accent: "orange",
  solid: "contrast",
  solidStyle: "flat",
  border: "rounded",
  surface: "filled",
  transition: "micro",
  scaling: "100",
};

const dataStyle: DataStyleConfig = {
  variant: "flat",
  mode: "categorical",
  height: 24,
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false,
  },
};

const effects: EffectsConfig = {
  mask: {
    cursor: false,
    x: 50,
    y: 0,
    radius: 100,
  },
  gradient: {
    display: false,
    opacity: 100,
    x: 50,
    y: 60,
    width: 100,
    height: 50,
    tilt: 0,
    colorStart: "accent-background-strong",
    colorEnd: "page-background",
  },
  dots: {
    display: true,
    opacity: 20,
    size: "2",
    color: "brand-background-strong",
  },
  grid: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-medium",
    width: "0.25rem",
    height: "0.25rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-weak",
    size: "16",
    thickness: 1,
    angle: 45,
  },
};

const schema: SchemaConfig = {
  logo: "",
  type: "Organization",
  name: "Servicar",
  description: "Sistema de control de operaciones y tickets para talleres de autobuses",
  email: "",
};

export {
  display,
  routes,
  protectedRoutes,
  baseURL,
  fonts,
  style,
  schema,
  effects,
  dataStyle,
};
