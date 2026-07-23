const CHUNK_RELOAD_STORAGE_KEY = "orderly:chunk-reload-at";
const CHUNK_RELOAD_COOLDOWN_MS = 60_000;

let reloadPending = false;
let listenerRegistered = false;

interface VitePreloadErrorEvent extends Event {
  payload?: unknown;
}

function getErrorDetails(error: unknown): { name: string; message: string } {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  if (typeof error === "string") {
    return { name: "", message: error };
  }

  if (error && typeof error === "object") {
    const value = error as { name?: unknown; message?: unknown };
    return {
      name: typeof value.name === "string" ? value.name : "",
      message: typeof value.message === "string" ? value.message : "",
    };
  }

  return { name: "", message: "" };
}

export function isChunkLoadError(error: unknown): boolean {
  const { name, message } = getErrorDetails(error);

  return (
    name === "ChunkLoadError" ||
    /Loading chunk .+ failed/i.test(message) ||
    /Loading CSS chunk .+ failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Failed to load module script/i.test(message) ||
    /Unable to preload CSS/i.test(message) ||
    /Expected a JavaScript.*module script/i.test(message)
  );
}

function getLastReloadTime(): number | null {
  try {
    const value = window.sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY);

    if (value === null) {
      return 0;
    }

    const timestamp = Number(value);
    return Number.isFinite(timestamp) ? timestamp : 0;
  } catch {
    return null;
  }
}

function setLastReloadTime(timestamp: number): boolean {
  try {
    const value = String(timestamp);
    window.sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, value);
    return window.sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY) === value;
  } catch {
    return false;
  }
}

function clearLastReloadTime(): void {
  try {
    window.sessionStorage.removeItem(CHUNK_RELOAD_STORAGE_KEY);
  } catch {
    // Ignore storage failures because there is no recovery action left to take.
  }
}

export function tryReloadForChunkError(error: unknown): boolean {
  if (!isChunkLoadError(error)) {
    return false;
  }

  if (reloadPending) {
    return true;
  }

  const now = Date.now();
  const lastReloadTime = getLastReloadTime();
  if (lastReloadTime === null) {
    return false;
  }

  if (lastReloadTime > 0 && now - lastReloadTime < CHUNK_RELOAD_COOLDOWN_MS) {
    return false;
  }

  if (!setLastReloadTime(now)) {
    return false;
  }

  reloadPending = true;
  try {
    window.location.reload();
    return true;
  } catch {
    reloadPending = false;
    clearLastReloadTime();
    return false;
  }
}

export function registerChunkLoadRecovery(): void {
  if (listenerRegistered) {
    return;
  }

  listenerRegistered = true;
  window.addEventListener("vite:preloadError", (event) => {
    const preloadErrorEvent = event as VitePreloadErrorEvent;
    if (tryReloadForChunkError(preloadErrorEvent.payload)) {
      event.preventDefault();
    }
  });
}
