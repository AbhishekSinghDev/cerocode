import type { ModeType, SupportedChatModelId } from "@cerocode/shared";
import type { DialogContextValue } from "../../providers/dialog";
import type { ToastContextValue } from "../../providers/toast";

export type CommandContext = {
  exit: () => void;
  toast: ToastContextValue;
  dialog: DialogContextValue;
  startNewSession: () => void;
  openSession: (id: string) => void;
  mode: ModeType;
  setMode: (mode: ModeType) => void;
  setModel: (model: SupportedChatModelId) => void;
};

export type Command = {
  name: string;
  description: string;
  value: string;
  action?: (ctx: CommandContext) => void;
};
