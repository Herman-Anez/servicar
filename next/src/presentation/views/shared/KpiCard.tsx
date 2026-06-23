"use client";

import { Column, Row, Heading, Text } from "@once-ui-system/core";

export interface KpiCardProps {
  label: string;
  value: string | number;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
}

export function KpiCard({
  label,
  value,
  badge,
  badgeBg = "var(--neutral-background-weak)",
  badgeColor = "var(--neutral-on-background-weak)",
}: KpiCardProps) {
  return (
    <Column
      border="neutral-alpha-weak"
      radius="m"
      padding="16"
      gap="8"
      background="page"
    >
      <Text
        variant="label-default-xs"
        onBackground="neutral-weak"
        style={{ textTransform: "uppercase", letterSpacing: "0.07em" }}
      >
        {label}
      </Text>
      <Row fillWidth horizontal="between" vertical="center">
        <Heading variant="display-strong-s">{value}</Heading>
        {badge && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: 4,
              background: badgeBg,
              color: badgeColor,
            }}
          >
            {badge}
          </span>
        )}
      </Row>
    </Column>
  );
}
