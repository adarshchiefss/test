import type { ComponentType } from "react";

export type Theme = {
  brand_name: string;
  primary_color: string;
};

export type AppMeta = {
  app_id: string;
  name: string;
  theme: Theme;
  start_screen_id?: string;
};

export type ScreenDef = {
  screen_id: string;
  title: string;
  props?: Record<string, any>;
  agent_id: string | null;
  schema_id: string | null;
  codegen_id?: string | null;
  navigation?: Record<string, string>;
};

export type Manifest = {
  app: AppMeta;
  screens: ScreenDef[];
  codegen_prompts?: any[];
  agents?: any[];
  schemas?: any[];
};

export type Nav = {
  currentScreenId: string;
  params?: any;
  go: (screenId: string, params?: any) => void;
  back: () => void;
  resolve: (eventName: string, params?: any) => void;
};

export type Api = {
  call: (route: string, payload?: any) => Promise<any>;
};

export type Device = {
  pickImageBase64: () => Promise<string | null>;
};

export type EmitFn = (eventName: string, payload?: any) => void;

export type ScreenComponentProps = {
  manifest: Manifest;
  screen: ScreenDef;
  nav: Nav;
  api: Api;
  device: Device;
  emit: EmitFn;
};

export type ScreenComponent = ComponentType<ScreenComponentProps>;
