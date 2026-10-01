import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Loading, { setProgress } from "../components/Loading";
import { canRenderCharacter } from "../utils/device";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

// The 3D character reports load progress. If this device can't run it
// (no WebGL / very low memory) we drive the loader ourselves.
const MIN_LOADER_MS = 2200;
// Never let a failed/slow model download trap the visitor on the loader.
const MAX_LOADER_MS = 25000;

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  // Loader now shows on every device, same as desktop.
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(0);
  const started = useRef(false);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  // Lock page scroll behind the loader (mobile CSS forces overflow:auto).
  useEffect(() => {
    const body = document.body;
    if (isLoading) {
      body.style.setProperty("overflow", "hidden", "important");
    } else {
      body.style.removeProperty("overflow");
    }
    return () => {
      body.style.removeProperty("overflow");
    };
  }, [isLoading]);

  // Safety net: force the loader to finish if the model never reports in.
  useEffect(() => {
    const id = setTimeout(() => setLoading(100), MAX_LOADER_MS);
    return () => clearTimeout(id);
  }, []);

  // No 3D character on this device -> run the same progress sequence ourselves.
  useEffect(() => {
    if (canRenderCharacter() || started.current) return;
    started.current = true;

    const progress = setProgress((value) => setLoading(value));
    const startedAt = performance.now();

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    Promise.all([fontsReady, pageReady]).then(() => {
      const wait = Math.max(0, MIN_LOADER_MS - (performance.now() - startedAt));
      setTimeout(() => {
        progress.loaded();
      }, wait);
    });
  }, []);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
