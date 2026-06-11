import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AppSidebar, { EXPANDED_WIDTH, COLLAPSED_WIDTH } from "./AppSidebar";
import BottomNav from "./mobile/BottomNav";
import FloatingActionButton from "./mobile/FloatingActionButton";
import MoreSheet from "./mobile/MoreSheet";
import MobileHeader from "./mobile/MobileHeader";
import { useEnhancedNotifications } from "../context/EnhancedNotificationsContext";
import { useFavorites } from "../context/FavoritesContext";
import { shouldHideMobileChrome } from "../config/navigation";

const STORAGE_KEY = "medilink-sidebar-collapsed";

const AppLayout = ({ user, onLogout }) => {
  const location = useLocation();
  const { unreadCount } = useEnhancedNotifications();
  const { getFavoriteCount } = useFavorites();
  const favoritesCount = getFavoriteCount();

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );
  const [moreOpen, setMoreOpen] = useState(false);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
  const hideChrome = shouldHideMobileChrome(location.pathname);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <div
      className="min-h-screen flex"
      style={{ "--sidebar-width": `${sidebarWidth}px` }}
    >
      <AppSidebar
        user={user}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-[var(--sidebar-width)] transition-[padding] duration-300">
        {!hideChrome && <MobileHeader unreadCount={unreadCount} />}

        <main
          className={`flex-1 min-w-0 desktop-main ${
            hideChrome ? "" : "mobile-main-content"
          }`}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>

        {!hideChrome && (
          <>
            <FloatingActionButton />
            <BottomNav
              onMorePress={() => setMoreOpen(true)}
              favoritesCount={favoritesCount}
              unreadCount={unreadCount}
            />
            <MoreSheet
              open={moreOpen}
              onClose={() => setMoreOpen(false)}
              user={user}
              onLogout={onLogout}
              favoritesCount={favoritesCount}
              unreadCount={unreadCount}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AppLayout;
