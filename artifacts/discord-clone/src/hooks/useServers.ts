import { useAppStore } from "@/store/useAppStore";

export function useServers() {
  return useAppStore((s) => s.servers);
}

export function useActiveServer() {
  const serverId = useAppStore((s) => s.activeServerId);
  const servers = useAppStore((s) => s.servers);
  return serverId ? servers.find((s) => s.id === serverId) ?? null : null;
}

export function useServerChannels(serverId: string | null) {
  const getChannelsByServer = useAppStore((s) => s.getChannelsByServer);
  const getCategoriesByServer = useAppStore((s) => s.getCategoriesByServer);
  if (!serverId) return { channels: [], categories: [] };
  return {
    channels: getChannelsByServer(serverId),
    categories: getCategoriesByServer(serverId),
  };
}
