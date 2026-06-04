"use client";

import { useEffect } from "react";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { usePersistence } from "@/hooks/useBlockStore";

export default function Home() {
  const { loadBlocks } = usePersistence();

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  return <WorkspaceShell />;
}
