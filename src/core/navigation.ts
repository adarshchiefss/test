import { useMemo, useState } from "react";
import { getScreenById } from "./manifest";
import type { Manifest, Nav } from "./types";

type StackEntry = {
  screenId: string;
  params?: any;
};

export function useNav(manifest: Manifest, startScreenId: string): Nav {
  const [stack, setStack] = useState<StackEntry[]>([{ screenId: startScreenId }]);

  return useMemo(() => {
    const currentEntry = stack[stack.length - 1] ?? { screenId: startScreenId };
    const currentScreenId = currentEntry.screenId;
    const params = currentEntry.params;

    const go = (screenId: string, nextParams?: any) => 
      setStack((prev) => [...prev, { screenId, params: nextParams }]);
    
    const back = () =>
      setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

    const resolve = (eventName: string, nextParams?: any) => {
      const screen = getScreenById(manifest, currentScreenId);
      const target = screen?.navigation?.[eventName];
      if (target) go(target, nextParams);
    };

    return { currentScreenId, params, go, back, resolve };
  }, [stack, startScreenId, manifest]);
}
