import type { ReactNode } from "react";
import { DesktopHeader } from "@/components/organisms/desktop-header";
import { DesktopSidebar } from "@/components/organisms/desktop-sidebar";
import { MobileTopBar } from "@/components/organisms/mobile-top-bar";
import { AppFrame, ContentGrid, PageBody } from "@/components/ui/chrome";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppFrame>
      <DesktopHeader />
      <MobileTopBar />
      <ContentGrid>
        <DesktopSidebar />
        <PageBody>{children}</PageBody>
      </ContentGrid>
    </AppFrame>
  );
}
