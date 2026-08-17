import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_TOAST_DURATION,
  type ToastOptions,
  type ToastVariant,
} from "./types";
import { TextAttributes } from "@opentui/core";
import { useTerminalDimensions } from "@opentui/react";
import { useTheme } from "../theme";
import { GLYPH } from "../../components/ui/glyphs";

export type ToastContextValue = {
  show: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);

  if (!value) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return value;
}

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [currentToast, setCurrentToast] = useState<ToastOptions | null>(null);
  const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentTimeout = useCallback(() => {
    if (timeoutHandleRef.current) {
      clearTimeout(timeoutHandleRef.current);
      timeoutHandleRef.current = null;
    }
  }, []);

  const show = useCallback(
    (options: ToastOptions) => {
      const duration = options.duration ?? DEFAULT_TOAST_DURATION;
      clearCurrentTimeout();

      setCurrentToast({
        variant: options.variant ?? "info",
        ...options,
        duration,
      });

      timeoutHandleRef.current = setTimeout(() => {
        setCurrentToast(null);
        timeoutHandleRef.current = null;
      }, duration).unref();
    },
    [clearCurrentTimeout],
  );

  const value: ToastContextValue = {
    show,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast currentToast={currentToast} />
    </ToastContext.Provider>
  );
}

type ToastProps = {
  currentToast: ToastOptions | null;
};

const VARIANT_GLYPH: Record<ToastVariant, string> = {
  info: GLYPH.info,
  success: GLYPH.success,
  error: GLYPH.error,
};

function Toast({ currentToast }: ToastProps) {
  const { width } = useTerminalDimensions();
  const { theme } = useTheme();

  if (!currentToast) {
    return null;
  }

  const variantColors: Record<ToastVariant, string> = {
    info: theme.colors.info,
    success: theme.colors.success,
    error: theme.colors.error,
  };

  const variant = currentToast.variant ?? "info";
  const accentColor = variantColors[variant];

  return (
    <box
      position="absolute"
      justifyContent="center"
      alignItems="center"
      bottom={2}
      left={0}
      width="100%"
      zIndex={200}
    >
      <box
        border
        borderStyle="rounded"
        borderColor={accentColor}
        backgroundColor={theme.colors.surface}
        width={Math.max(1, Math.min(60, width - 6))}
        paddingX={2}
        paddingY={0}
        flexDirection="row"
        gap={1}
        alignItems="flex-start"
      >
        <text attributes={TextAttributes.BOLD} fg={accentColor}>
          {VARIANT_GLYPH[variant]}
        </text>
        <box flexGrow={1}>
          <text fg={theme.colors.text} wrapMode="word" width="100%">
            {currentToast.message}
          </text>
        </box>
      </box>
    </box>
  );
}
