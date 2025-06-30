import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  badge?: string;
  isActive?: boolean;
  subItems?: {
    title: string;
    url: string;
    isActive?: boolean;
  }[];
}
