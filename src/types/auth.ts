import type { ComponentType } from "react";

export interface AccountType {
  title: string;
  badge: string;
  description: string;
  cta: string;
  dark: boolean;
  Icon: ComponentType;
}

export interface SocialProvider {
  name: string;
  mark: string;
  accent: string;
}
