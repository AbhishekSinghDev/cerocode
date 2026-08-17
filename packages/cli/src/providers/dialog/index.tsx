import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { ConfirmConfig, ConfirmResult, DialogConfig } from "./types";
import { useKeyboardLayer } from "../kebboard";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { RGBA, TextAttributes } from "@opentui/core";
import { useTheme } from "../theme";
import { GLYPH } from "../../components/ui/glyphs";

export type DialogContextValue = {
  open: (config: DialogConfig) => void;
  close: () => void;
  confirm: (config: ConfirmConfig) => Promise<ConfirmResult>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog(): DialogContextValue {
  const value = useContext(DialogContext);
  if (!value) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return value;
}

type DialogProviderProps = {
  children: ReactNode;
};

type PendingConfirm = ConfirmConfig & {
  resolve: (result: ConfirmResult) => void;
};

export function DialogProvider({ children }: DialogProviderProps) {
  const [currentDialog, setCurrentDialog] = useState<DialogConfig | null>(null);
  const [pendingConfirm, setPendingConfirm] =
    useState<PendingConfirm | null>(null);
  const { push, pop } = useKeyboardLayer();

  const close = useCallback(() => {
    setCurrentDialog(null);
    pop("dialog");
  }, [pop]);

  const resolveConfirm = useCallback(
    (result: ConfirmResult) => {
      setPendingConfirm((current) => {
        current?.resolve(result);
        return null;
      });
      pop("confirm");
    },
    [pop],
  );

  const open = useCallback(
    (config: DialogConfig) => {
      setCurrentDialog(config);
      push("dialog", () => {
        close();
        return true;
      });
    },
    [push, close],
  );

  const confirm = useCallback(
    (config: ConfirmConfig) => {
      return new Promise<ConfirmResult>((resolve) => {
        setPendingConfirm({ ...config, resolve });
        push("confirm", () => {
          resolveConfirm("denied");
          return true;
        });
      });
    },
    [push, resolveConfirm],
  );

  return (
    <DialogContext.Provider value={{ open, close, confirm }}>
      {children}
      <Dialog currentDialog={currentDialog} close={close} />
      <ConfirmDialog
        pendingConfirm={pendingConfirm}
        onResolve={resolveConfirm}
      />
    </DialogContext.Provider>
  );
}

type DialogProps = {
  currentDialog: DialogConfig | null;
  close: () => void;
};

function Dialog({ currentDialog, close }: DialogProps) {
  const { isTop } = useKeyboardLayer();
  const dimensions = useTerminalDimensions();
  const { theme } = useTheme();

  useKeyboard((key) => {
    if (!currentDialog || !isTop("dialog")) return false;

    if (key.name === "escape") {
      close();
    }
  });

  if (!currentDialog) return null;

  const { title, children } = currentDialog;

  const scrim = RGBA.fromHex(theme.colors.background);
  scrim.a = 0.6;

  return (
    <box
      position="absolute"
      left={0}
      top={0}
      width={dimensions.width}
      height={dimensions.height}
      justifyContent="center"
      alignItems="center"
      backgroundColor={scrim}
      zIndex={100}
      onMouseDown={() => close()}
    >
      <box
        border
        borderStyle="rounded"
        borderColor={theme.colors.border}
        width={Math.min(60, dimensions.width - 4)}
        height="auto"
        backgroundColor={theme.colors.surface}
        title={`${GLYPH.brand} ${title}`}
        titleColor={theme.colors.primary}
        bottomTitle="[esc] close"
        bottomTitleAlignment="right"
        paddingX={3}
        paddingY={1}
        flexDirection="column"
        gap={1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <box flexGrow={1}>{children}</box>
      </box>
    </box>
  );
}

type ConfirmDialogProps = {
  pendingConfirm: PendingConfirm | null;
  onResolve: (result: ConfirmResult) => void;
};

function ConfirmDialog({ pendingConfirm, onResolve }: ConfirmDialogProps) {
  const { isTop } = useKeyboardLayer();
  const dimensions = useTerminalDimensions();
  const { theme } = useTheme();

  useKeyboard((key) => {
    if (!pendingConfirm || !isTop("confirm")) return false;

    if (key.name === "return" || key.name === "enter") {
      onResolve("approved");
      return true;
    }

    if (key.name === "a" || key.name === "A") {
      onResolve("approved-all");
      return true;
    }

    if (key.name === "escape") {
      onResolve("denied");
      return true;
    }

    return false;
  });

  if (!pendingConfirm) return null;

  const scrim = RGBA.fromHex(theme.colors.background);
  scrim.a = 0.6;

  return (
    <box
      position="absolute"
      left={0}
      top={0}
      width={dimensions.width}
      height={dimensions.height}
      justifyContent="center"
      alignItems="center"
      backgroundColor={scrim}
      zIndex={101}
    >
      <box
        border
        borderStyle="rounded"
        borderColor={theme.colors.error}
        width={Math.min(80, dimensions.width - 4)}
        height="auto"
        backgroundColor={theme.colors.surface}
        title={`${GLYPH.warn} ${pendingConfirm.title}`}
        titleColor={theme.colors.error}
        paddingX={3}
        paddingY={1}
        flexDirection="column"
        gap={1}
      >
        <text wrapMode="word" width="100%" fg={theme.colors.text}>
          {pendingConfirm.message}
        </text>
        <box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingTop={1}
        >
          <text attributes={TextAttributes.BOLD} fg={theme.colors.success}>
            [enter] approve
          </text>
          <text attributes={TextAttributes.BOLD} fg={theme.colors.info}>
            [a] approve all
          </text>
          <text attributes={TextAttributes.BOLD} fg={theme.colors.error}>
            [esc] deny
          </text>
        </box>
      </box>
    </box>
  );
}
