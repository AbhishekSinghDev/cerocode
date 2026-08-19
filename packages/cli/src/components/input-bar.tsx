import {
  ScrollBoxRenderable,
  TextareaRenderable,
  TextAttributes,
  type KeyBinding,
} from "@opentui/core";
import { CommandMenu } from "./command-menu";
import { GLYPH } from "./ui/glyphs";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useKeyboard, useRenderer } from "@opentui/react";
import { useCommandMenu } from "./command-menu/use-command-menu";
import type { Command } from "./command-menu/types";
import { useToast } from "../providers/toast";
import { useKeyboardLayer } from "../providers/kebboard";
import { useDialog } from "../providers/dialog";
import { useTheme } from "../providers/theme";
import { usePromptConfig } from "../providers/prompt-config";
import { MAX_VISIBLE_MENTIONS } from "./ui/list-constants";
import { useListNavigation } from "../hooks/use-list-navigation";
import {
  findActiveMention,
  getMentionCandidates,
  type MentionCandidate,
  type MentionMatch,
} from "../lib/mentions";

type InputBarProps = {
  onSubmit: (value: string) => void;
  onNewSession: () => void;
  onOpenSession: (id: string) => void;
  disabled?: boolean;
};

export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "enter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" },
];

const CURRENT_DIRECTORY = process.cwd();

export function InputBar(props: InputBarProps) {
  const textareaRef = useRef<TextareaRenderable>(null);
  const onSubmitRef = useRef<() => void>(() => {});
  const activeMentionRef = useRef<MentionMatch | null>(null);
  const mentionScrollRef = useRef<ScrollBoxRenderable | null>(null);

  const [activeMention, setActiveMention] = useState<MentionMatch | null>(null);
  const [mentionCandidates, setMentionCandidates] = useState<
    MentionCandidate[]
  >([]);
  const [mentionSelectedIndex, setMentionSelectedIndex] = useState<number>(0);

  const toast = useToast();
  const dialog = useDialog();
  const { theme } = useTheme();
  const renderer = useRenderer();
  const { isTop, setResponder, push, pop } = useKeyboardLayer();
  const { mode, model, toggleMode, setMode, setModel } = usePromptConfig();

  const {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  } = useCommandMenu();

  const showMentionMenu = activeMention !== null;

  const { moveSelection } = useListNavigation(
    mentionCandidates.length,
    mentionScrollRef,
  );

  const closeMentionMenu = useCallback(() => {
    activeMentionRef.current = null;
    setActiveMention(null);
    setMentionCandidates([]);
    pop("mention");
  }, [pop]);

  const syncMentionMenu = useCallback(
    (text: string, cursorOffset: number) => {
      const nextMention = findActiveMention(text, cursorOffset);
      const previousMention = activeMentionRef.current;
      const mentionChanged =
        previousMention?.start !== nextMention?.start ||
        previousMention?.end !== nextMention?.end ||
        previousMention?.query !== nextMention?.query;

      if (!nextMention) {
        if (previousMention) {
          closeMentionMenu();
        }
        return;
      }

      activeMentionRef.current = nextMention;
      setActiveMention(nextMention);
      push("mention", () => {
        closeMentionMenu();
        return true;
      });

      if (mentionChanged) {
        setMentionSelectedIndex(0);
        mentionScrollRef.current?.scrollTo(0);
      }
    },
    [closeMentionMenu, push],
  );

  const handleCommandExecute = useCallback((index: number) => {
    const command = resolveCommand(index);
    handleCommand(command);
  }, []);

  const handleTextareaContentChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.plainText;

    handleContentChange(text);
    syncMentionMenu(text, textarea.cursorOffset);
  }, [handleContentChange, syncMentionMenu]);

  const handleSubmit = useCallback(() => {
    if (props.disabled) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.plainText.trim();
    if (text.length === 0) return;

    props.onSubmit(text);
    textarea.setText("");
  }, [props.disabled, props.onSubmit]);

  const handleMentionExecute = useCallback(
    (index: number) => {
      const textarea = textareaRef.current;
      const mention = activeMentionRef.current;
      const candidate = mentionCandidates[index];

      if (!textarea || !mention || !candidate) return;

      const insertion =
        candidate.kind === "directory" ? candidate.path : `${candidate.path} `;

      const nextText = `${textarea.plainText.slice(0, mention.start)}@${insertion}${textarea.plainText.slice(mention.end)}`;
      textarea.replaceText(nextText);
      textarea.cursorOffset = mention.start + insertion.length + 1;
      syncMentionMenu(nextText, textarea.cursorOffset);
    },
    [mentionCandidates, syncMentionMenu],
  );

  const handleTextareaCursorChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    syncMentionMenu(textarea.plainText, textarea.cursorOffset);
  }, [syncMentionMenu]);

  const handleCommand = useCallback(
    (command: Command | undefined) => {
      const textarea = textareaRef.current;

      if (!textarea || !command) return;

      textarea.setText("");
      if (command.action) {
        command.action({
          exit: () => renderer.destroy(),
          toast,
          dialog,
          startNewSession: props.onNewSession,
          openSession: props.onOpenSession,
          mode,
          setMode,
          setModel,
        });
      } else {
        textarea.insertText(command.value + " ");
      }
    },
    [renderer, toast, dialog, props.onNewSession, props.onOpenSession, mode, setMode, setModel],
  );

  useEffect(() => {
    if (!activeMention) {
      setMentionCandidates([]);
      return;
    }

    let ignore = false;
    const loadCandidates = async () => {
      const nextCandidates = await getMentionCandidates(
        activeMention.query,
        CURRENT_DIRECTORY,
      );
      if (ignore) return;

      setMentionCandidates(nextCandidates);
      setMentionSelectedIndex((currentIndex) => {
        if (nextCandidates.length === 0) {
          return 0;
        }
        return Math.min(currentIndex, nextCandidates.length - 1);
      });
    };

    void loadCandidates();

    return () => {
      ignore = true;
    };
  }, [activeMention]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.onSubmit = () => {
      onSubmitRef.current();
    };
  }, []);

  onSubmitRef.current = () => {
    if (props.disabled) return;

    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex);
      handleCommand(command);
      return;
    }

    if (showMentionMenu) {
      const candidate = mentionCandidates[mentionSelectedIndex];
      if (candidate) {
        handleMentionExecute(mentionSelectedIndex);
        return;
      }
    }

    handleSubmit();
  };

  useKeyboard((key) => {
    if (props.disabled) return;
    if (!isTop("base")) return;
    if (key.name === "tab") {
      key.preventDefault();
      toggleMode();
    }
  });

  useEffect(() => {
    setResponder("base", () => {
      if (props.disabled) return false;

      const textarea = textareaRef.current;
      if (textarea && textarea.plainText.length > 0) {
        textarea.setText("");
        return true;
      }
      return false;
    });

    return () => {
      setResponder("base", null);
    };
  }, [props.disabled, setResponder]);

  useKeyboard((key) => {
    if (props.disabled) return;
    if (!showMentionMenu || !isTop("mention")) return;

    if (key.name === "escape") {
      key.preventDefault();
      closeMentionMenu();
    } else if (key.name === "up") {
      key.preventDefault();
      setMentionSelectedIndex((currentIndex) =>
        moveSelection("up", currentIndex),
      );
    } else if (key.name === "down") {
      key.preventDefault();
      setMentionSelectedIndex((currentIndex) =>
        moveSelection("down", currentIndex),
      );
    }
  });

  const accentColor =
    mode === "PLAN" ? theme.colors.info : theme.colors.primary;

  return (
    <box width="100%" alignItems="center">
      <box
        border
        borderStyle="rounded"
        borderColor={accentColor}
        title={mode === "PLAN" ? "plan" : "build"}
        titleColor={accentColor}
        titleAlignment="left"
        bottomTitle={`${model}  ·  shift+enter newline`}
        bottomTitleAlignment="right"
        width="100%"
      >
        <box
          position="relative"
          justifyContent="center"
          paddingX={2}
          paddingY={0}
          width="100%"
        >
          {showCommandMenu && (
            <box position="absolute" bottom="100%" left={0} width="100%" zIndex={10}>
              <box
                border
                borderStyle="rounded"
                borderColor={theme.colors.border}
                backgroundColor={theme.colors.surface}
                title="commands"
                titleColor={theme.colors.textMuted}
                marginBottom={1}
              >
                <CommandMenu
                  query={commandQuery}
                  selectedIndex={selectedIndex}
                  scrollRef={scrollRef}
                  onSelect={setSelectedIndex}
                  onExecute={handleCommandExecute}
                />
              </box>
            </box>
          )}
          {!showCommandMenu && showMentionMenu && (
            <box position="absolute" bottom="100%" left={0} width="100%" zIndex={10}>
              <box
                border
                borderStyle="rounded"
                borderColor={theme.colors.border}
                backgroundColor={theme.colors.surface}
                title="files"
                titleColor={theme.colors.textMuted}
                marginBottom={1}
              >
                <FileMentionMenu
                  candidates={mentionCandidates}
                  selectedIndex={mentionSelectedIndex}
                  scrollRef={mentionScrollRef}
                  onSelect={setMentionSelectedIndex}
                  onExecute={handleMentionExecute}
                />
              </box>
            </box>
          )}
          <textarea
            ref={textareaRef}
            focused={
              (!props.disabled && isTop("base")) ||
              isTop("command") ||
              isTop("mention")
            }
            keyBindings={TEXTAREA_KEY_BINDINGS}
            onContentChange={handleTextareaContentChange}
            placeholder={`Ask anything... "Fix a bug in the database"`}
            style={{ minWidth: "100%", maxWidth: "100%" }}
          />
        </box>
      </box>
    </box>
  );
}

type FileMentionMenuProps = {
  candidates: MentionCandidate[];
  selectedIndex: number;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
  onSelect: (index: number) => void;
  onExecute: (index: number) => void;
};

function FileMentionMenu({
  candidates,
  selectedIndex,
  scrollRef,
  onSelect,
  onExecute,
}: FileMentionMenuProps) {
  const { theme } = useTheme();
  const visibleHeight = Math.min(candidates.length, MAX_VISIBLE_MENTIONS);

  if (candidates.length === 0) {
    return (
      <box paddingX={1}>
        <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
          No matching files or folders
        </text>
      </box>
    );
  }

  return (
    <scrollbox ref={scrollRef} height={visibleHeight}>
      {candidates.map((candidate, index) => {
        const isSelected = index === selectedIndex;

        return (
          <box
            key={candidate.path}
            flexDirection="row"
            gap={1}
            paddingX={1}
            height={1}
            overflow="hidden"
            backgroundColor={isSelected ? theme.colors.selection : undefined}
            onMouseMove={() => onSelect(index)}
            onMouseDown={() => onExecute(index)}
          >
            <box width={1} flexShrink={0}>
              <text
                selectable={false}
                fg={isSelected ? theme.colors.textOnSelection : theme.colors.textMuted}
              >
                {isSelected ? GLYPH.cursor : " "}
              </text>
            </box>
            <box flexGrow={1} flexShrink={1} overflow="hidden">
              <text
                selectable={false}
                fg={isSelected ? theme.colors.textOnSelection : theme.colors.text}
              >
                {candidate.kind === "directory" ? GLYPH.dir : GLYPH.file} {candidate.path}
              </text>
            </box>

            <box width={4} alignItems="flex-end" flexShrink={0}>
              <text
                selectable={false}
                attributes={TextAttributes.DIM}
                fg={isSelected ? theme.colors.textOnSelection : theme.colors.textMuted}
              >
                {candidate.kind === "directory" ? "dir" : "file"}
              </text>
            </box>
          </box>
        );
      })}
    </scrollbox>
  );
}
