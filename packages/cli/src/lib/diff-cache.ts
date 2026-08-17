// Holds the before/after file contents produced by write/edit tool calls so
// the UI can render a real diff without ever putting the full file content
// in the tool `output` that gets sent back to the model (that would bloat
// every subsequent request with duplicated file contents). Snapshots are
// looked up by toolCallId and are purely a client-side rendering aid.

export type DiffSnapshot = {
  oldContent: string;
  newContent: string;
};

const MAX_SNAPSHOTS = 200;

const snapshots = new Map<string, DiffSnapshot>();

export function setDiffSnapshot(toolCallId: string, snapshot: DiffSnapshot) {
  snapshots.set(toolCallId, snapshot);

  if (snapshots.size > MAX_SNAPSHOTS) {
    const oldestKey = snapshots.keys().next().value;
    if (oldestKey !== undefined) snapshots.delete(oldestKey);
  }
}

export function getDiffSnapshot(toolCallId: string): DiffSnapshot | undefined {
  return snapshots.get(toolCallId);
}
