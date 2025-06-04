import { ReactNode } from "react";

export type AppTabProps = {
  data: { key: string; label: string; content: ReactNode }[];
  activeId?: string;
  onChange?: (e: string) => void;
};
