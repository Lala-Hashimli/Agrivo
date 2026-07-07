import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../../auth/AuthContext";
import { cn } from "../ui/utils";
import {
  DashboardMobileMenuButton,
  DashboardSidebarOverlay,
  DashboardSidebarPanel,
} from "./DashboardSidebar";
import {
  parseDashboardSection,
  resolveDashboardNavId,
  type DashboardRoleConfig,
} from "./dashboardConfig";
import { DashboardSectionContent } from "./DashboardSectionContent";

interface DashboardLayoutProps {
  config: DashboardRoleConfig;
  children?: ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
  activeNavId?: string;
  hideIntro?: boolean;
}

export function DashboardLayout({
  config,
  children,
  activeNavId: activeNavIdProp,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(
    () => window.location.hash.replace("#", "") || config.baseHash,
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace("#", "") || config.baseHash);
      setIsSidebarOpen(false);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [config.baseHash]);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isSidebarOpen) {
      document.body.style.removeProperty("overflow");
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  const activeNavId = activeNavIdProp ?? resolveDashboardNavId(config, currentHash);

  const handleNavigate = (hash: string) => {
    window.location.hash = hash;
  };

  const handleBackHome = () => {
    setIsSidebarOpen(false);
    window.location.hash = "home";
  };

  const handleLogout = () => {
    setIsSidebarOpen(false);
    logout();
    window.location.hash = "login";
  };

  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  const mainContent = children ?? (
    <DashboardSectionContent config={config} sectionId={parseDashboardSection(config.baseHash, currentHash)} />
  );

  return (
    <div className="agrivo-dashboard min-h-screen bg-[#f8faf4]">
      <DashboardSidebarOverlay visible={isSidebarOpen} onClose={closeSidebar} />

      <aside
        className={cn(
          "agrivo-dashboard-sidebar",
          isSidebarOpen && "agrivo-dashboard-sidebar--open",
        )}
        aria-hidden={!isSidebarOpen}
        inert={!isSidebarOpen ? true : undefined}
      >
        <DashboardSidebarPanel
          config={config}
          activeNavId={activeNavId}
          user={user}
          onNavigate={handleNavigate}
          onBackHome={handleBackHome}
          onLogout={handleLogout}
          onClose={closeSidebar}
        />
      </aside>

      <div className="agrivo-dashboard-main">
        <div className="agrivo-dashboard-menu-bar">
          <DashboardMobileMenuButton onOpen={openSidebar} isOpen={isSidebarOpen} />
        </div>

        <main className="agrivo-dashboard-content">{mainContent}</main>
      </div>
    </div>
  );
}
