."use client";

import { Column, Row, Text, Icon, IconButton, Avatar } from "@once-ui-system/core";
import type { AdminLayoutVM } from "@/presentation/view-models/admin/useAdminLayoutViewModel";

const NAV = [
  { href: "/admin/cola",    label: "Triage",  icon: <TriageIcon /> },
  { href: "/admin/tickets", label: "Tickets", icon: <TicketsIcon /> },
] as const;

interface AdminLayoutViewProps extends AdminLayoutVM {
  pathname: string;
  children: React.ReactNode;
}

export function AdminLayoutView({
  empleado, pendientes, sidebarOpen, setSidebarOpen,
  onLogout, onNavTo, onNuevoTicket, pathname, children,
}: AdminLayoutViewProps) {
  if (!empleado) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <style>{`
        .admin-sidebar  { width:256px; flex-shrink:0; position:fixed; left:0; top:0; height:100vh; background:var(--page-background); border-right:1px solid var(--neutral-alpha-weak); display:flex; flex-direction:column; z-index:50; transition:transform .25s cubic-bezier(.4,0,.2,1); }
        .admin-overlay  { display:none; position:fixed; inset:0; z-index:49; background:rgba(0,0,0,.4); }
        .admin-content  { margin-left:256px; flex:1; display:flex; flex-direction:column; min-height:100vh; }
        .admin-hamburger{ display:none !important; }
        .admin-search   { display:flex !important; }
        .admin-username { display:flex !important; }
        .admin-main     { padding:40px; flex:1; }
        @media(max-width:768px){
          .admin-sidebar  { transform:translateX(-100%); }
          .admin-sidebar.open{ transform:translateX(0); }
          .admin-overlay.open{ display:block; }
          .admin-content  { margin-left:0; }
          .admin-hamburger{ display:flex !important; }
          .admin-search   { display:none !important; }
          .admin-username { display:none !important; }
          .admin-main     { padding:20px 16px; }
        }
      `}</style>

      <div className={`admin-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <Column as="aside" className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        <Column padding="20" paddingBottom="0">
          <Column gap="4" paddingBottom="32">
            <img src="/servicar-logo.svg" alt="SERVICAR" style={{ width: 180, height: 71 }} />
            <Text variant="label-default-xs" onBackground="neutral-weak">Admin Panel</Text>
          </Column>
        </Column>

        <Column flex={1} gap="2" as="nav">
          {NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const isTriage = item.href === "/admin/cola";
            return (
              <button
                key={item.href}
                onClick={() => onNavTo(item.href)}
                className={`sp-nav-item${isActive ? " active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isTriage && pendientes > 0 && (
                  <span style={{ marginLeft: "auto", background: "var(--brand-background-strong)", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 4, padding: "1px 6px", minWidth: 18, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    {pendientes}
                  </span>
                )}
              </button>
            );
          })}
        </Column>

        <Column padding="16">
          <button className="sp-btn-primary" onClick={onNuevoTicket} style={{ borderRadius: 12 }}>
            <Icon name="plus" size="s" /> Nuevo Ticket
          </button>
        </Column>
      </Column>

      <div className="admin-content">
        <Row
          as="header"
          fillWidth
          position="sticky"
          zIndex={9}
          background="page"
          borderBottom="neutral-alpha-weak"
          paddingX="16"
          gap="12"
          vertical="center"
          style={{ height: 64, backdropFilter: "blur(8px)" }}
        >
          <button
            className="admin-hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--neutral-on-background-strong)", padding: 6, borderRadius: 8, display: "flex", alignItems: "center" }}
            aria-label="Menú"
          >
            <HamburgerIcon />
          </button>

          <Row
            gap="8"
            vertical="center"
            background="surface"
            border="neutral-alpha-weak"
            radius="xl"
            paddingX="12"
            paddingY="8"
            className="admin-search"
            style={{ flex: 1, maxWidth: 400 }}
          >
            <Icon name="search" size="xs" onBackground="neutral-weak" />
            <input
              type="text"
              placeholder="Buscar tickets, matrículas…"
              style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--neutral-on-background-strong)", fontFamily: "inherit", flex: 1, minWidth: 0 }}
            />
          </Row>

          <div style={{ flex: 1 }} />

          <Row gap="4" vertical="center">
            <IconButton icon="bell"     size="s" variant="ghost" aria-label="Notificaciones" />
            <IconButton icon="settings" size="s" variant="ghost" aria-label="Configuración" />
            <IconButton icon="help"     size="s" variant="ghost" aria-label="Ayuda" />
          </Row>

          <div style={{ width: 1, height: 28, background: "var(--neutral-alpha-weak)" }} />

          <Row gap="8" vertical="center">
            <Column gap="2" horizontal="end" className="admin-username">
              <Text variant="label-strong-xs">{empleado.nombre}</Text>
              <Text variant="label-default-xs" onBackground="neutral-weak">Administrador</Text>
            </Column>
            <Avatar
              value={empleado.nombre}
              size="s"
              onClick={onLogout}
              title="Cerrar sesión"
              style={{ cursor: "pointer" }}
            />
          </Row>
        </Row>

        <Column as="main" flex={1} className="admin-main">
          {children}
        </Column>
      </div>
    </div>
  );
}

function HamburgerIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
}
function TriageIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12l2 2 4-4" /></svg>;
}
function TicketsIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></svg>;
}
