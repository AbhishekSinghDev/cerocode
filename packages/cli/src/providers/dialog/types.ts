import type { ReactNode } from "react";

export type DialogConfig = {
  title: string;
  children: ReactNode;
};

export type ConfirmConfig = {
  title: string;
  message: string;
};

export type ConfirmResult = "approved" | "approved-all" | "denied";
