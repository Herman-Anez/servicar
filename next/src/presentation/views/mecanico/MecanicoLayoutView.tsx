"use client";

import { Column, Row, Text, IconButton, Icon, Flex, SmartLink } from "@once-ui-system/core";
import type { MecanicoLayoutVM } from "@/presentation/view-models/mecanico/useMecanicoLayout.view-model";

const NAV_TABS = [
  { href: "/dashboard", label: "Panel",  icon: "home"      },
  { href: "/fichas",    label: "Fichas", icon: "clipboard" },
  { href: "/taller",    label: "Taller", icon: "wrench"    },
] as const;

interface MecanicoLayoutViewProps extends MecanicoLayoutVM {
  pathname: string;
  children: React.ReactNode;
}

export function MecanicoLayoutView({ empleado, showProfile, setShowProfile, onLogout, pathname, children }: MecanicoLayoutViewProps) {
  if (!empleado) return null;

  return (
    <Column fillWidth style={{ minHeight: "100vh" }}>
      <Row
        as="header"
        fillWidth
        position="sticky"
        zIndex={10}
        background="page"
        borderBottom="neutral-alpha-weak"
        paddingX="12"
        paddingY="8"
        vertical="center"
        horizontal="between"
        style={{ height: "48px" }}
      >
        <img src="/servicar-logo.svg" alt="SERVICAR" style={{ width: 100, height: 39, flexShrink: 0 }} />

        <Row gap="8" vertical="center">
          <div style={{ position: "relative" }}>
            <IconButton
              icon="user"
              size="s"
              variant="ghost"
              onClick={() => setShowProfile(!showProfile)}
              aria-label="Perfil"
            />
            {showProfile && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 5 }} onClick={() => setShowProfile(false)} />
                <Column
                  position="absolute"
                  zIndex={10}
                  background="page"
                  border="neutral-alpha-weak"
                  radius="m"
                  padding="12"
                  gap="8"
                  shadow="l"
                  style={{ top: "calc(100% + 8px)", right: 0, width: "220px" }}
                >
                  <Column gap="4" paddingBottom="8" borderBottom="neutral-alpha-weak">
                    <Text variant="label-strong-s">{empleado.nombre}</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">{empleado.email}</Text>
                    <Text variant="label-default-xs" onBackground="brand-weak">
                      {empleado.rol === "admin" ? "Administrador" : "Mecánico"}
                    </Text>
                  </Column>
                  <button
                    onClick={onLogout}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 6, border: "none", background: "transparent", color: "var(--danger-on-background-strong)", cursor: "pointer", fontSize: 12, fontWeight: 600, width: "100%" }}
                  >
                    <Icon name="logOut" size="xs" />
                    Cerrar Sesión
                  </button>
                </Column>
              </>
            )}
          </div>
        </Row>
      </Row>

      <Column fillWidth flex={1} paddingBottom="64" paddingX="16" paddingTop="16">
        {children}
      </Column>

      <Row
        as="nav"
        fillWidth
        position="fixed"
        bottom="0"
        zIndex={10}
        background="page"
        borderTop="neutral-alpha-weak"
        style={{ height: "56px" }}
      >
        {NAV_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <SmartLink
              key={tab.href}
              href={tab.href}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", position: "relative", borderTop: `2px solid ${isActive ? "var(--sp-primary)" : "transparent"}`, color: isActive ? "var(--sp-primary)" : "var(--sp-on-surface-variant)", textDecoration: "none", padding: "6px 0", transition: "all 0.1s" }}
            >
              <Icon name={tab.icon} size="s" />
              <Text variant="label-default-xs" style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {tab.label}
              </Text>
            </SmartLink>
          );
        })}
      </Row>
    </Column>
  );
}
