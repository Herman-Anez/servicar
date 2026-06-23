"use client";

import { Icon } from "@once-ui-system/core";

export interface FabButtonProps {
  onClick: () => void;
  label: string;
  iconName?: string;
  bottom?: string;
  right?: string;
}

export function FabButton({
  onClick,
  label,
  iconName = "plus",
  bottom = "72px",
  right = "16px",
}: FabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: bottom,
        right: right,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "10px 16px",
        borderRadius: "8px",
        background: "var(--sp-primary)",
        color: "var(--sp-on-primary)",
        border: "none",
        fontWeight: 700,
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        boxShadow: "0 4px 12px rgba(188,1,0,0.3)",
        zIndex: 9,
        cursor: "pointer",
      }}
    >
      <Icon name={iconName as any} size="s" />
      {label}
    </button>
  );
}
