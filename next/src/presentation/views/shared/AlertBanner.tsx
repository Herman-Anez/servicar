"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";

export type AlertType = "danger" | "warning" | "success" | "info";

export interface AlertBannerProps {
  message: React.ReactNode;
  title?: string;
  type?: AlertType;
  iconName?: string;
  padding?: string;
  marginBottom?: string;
}

const TYPE_CFG: Record<AlertType, { bg: string; border: string; onBg: string; iconOnBg: string; defaultIcon: string }> = {
  danger: {
    bg: "danger-alpha-weak",
    border: "danger-alpha-medium",
    onBg: "danger-strong",
    iconOnBg: "danger-medium",
    defaultIcon: "warning",
  },
  warning: {
    bg: "warning-alpha-weak",
    border: "warning-alpha-medium",
    onBg: "warning-strong",
    iconOnBg: "warning-medium",
    defaultIcon: "warning",
  },
  success: {
    bg: "success-alpha-weak",
    border: "success-alpha-medium",
    onBg: "success-strong",
    iconOnBg: "success-medium",
    defaultIcon: "checkCircle",
  },
  info: {
    bg: "brand-alpha-weak",
    border: "brand-alpha-medium",
    onBg: "brand-on-background-strong",
    iconOnBg: "brand-medium",
    defaultIcon: "info",
  },
};

export function AlertBanner({
  message,
  title,
  type = "info",
  iconName,
  padding = "10px",
  marginBottom,
}: AlertBannerProps) {
  const cfg = TYPE_CFG[type] ?? TYPE_CFG.info;
  const activeIcon = iconName ?? cfg.defaultIcon;

  if (title) {
    return (
      <Column
        fillWidth
        gap="8"
        padding={padding as any}
        radius="m"
        background={cfg.bg as any}
        border={cfg.border as any}
        marginBottom={marginBottom as any}
      >
        <Row gap="8" vertical="center">
          <Icon name={activeIcon} size="xs" onBackground={cfg.iconOnBg as any} style={{ flexShrink: 0 }} />
          <Text variant="label-strong-xs" onBackground={cfg.onBg as any}>
            {title}
          </Text>
        </Row>
        <Text variant="body-default-xs" onBackground={cfg.onBg as any}>
          {message}
        </Text>
      </Column>
    );
  }

  return (
    <Row
      fillWidth
      gap="8"
      padding={padding as any}
      radius="m"
      background={cfg.bg as any}
      border={cfg.border as any}
      vertical="center"
      marginBottom={marginBottom as any}
    >
      <Icon name={activeIcon} size="xs" onBackground={cfg.iconOnBg as any} style={{ flexShrink: 0 }} />
      <Text variant="label-default-xs" onBackground={cfg.onBg as any}>
        {message}
      </Text>
    </Row>
  );
}
