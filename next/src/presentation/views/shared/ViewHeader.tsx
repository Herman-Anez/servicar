"use client";

import { Column, Row, Heading, Text, Icon } from "@once-ui-system/core";

export interface ViewHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  badge?: React.ReactNode;
  rightElement?: React.ReactNode;
  borderBottom?: boolean;
  marginBottom?: string;
}

export function ViewHeader({
  title,
  subtitle,
  onBack,
  badge,
  rightElement,
  borderBottom = false,
  marginBottom,
}: ViewHeaderProps) {
  return (
    <Row
      fillWidth
      gap="8"
      vertical="center"
      horizontal="between"
      paddingBottom={borderBottom ? "16" : undefined}
      borderBottom={borderBottom ? "neutral-alpha-weak" : undefined}
      marginBottom={marginBottom as any}
      style={{ flexWrap: "wrap", gap: "16px" }}
    >
      <Row gap="8" vertical="center" style={{ flex: 1, minWidth: 0 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "inherit",
              padding: 0,
              flexShrink: 0,
            }}
          >
            <Icon name="arrowLeft" size="s" onBackground="neutral-medium" />
          </button>
        )}
        <Column gap="2" style={{ flex: 1, minWidth: 0 }}>
          <Heading variant="heading-strong-m" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </Heading>
          
          {subtitle && (
            <Text variant="label-default-xs" onBackground="neutral-weak">
              {subtitle}
            </Text>
          )}

          {badge && (
            <Row gap="8" vertical="center" style={{ flexWrap: "wrap", marginTop: "2px" }}>
              {badge}
            </Row>
          )}
        </Column>
      </Row>

      {rightElement && (
        <Row vertical="center" style={{ flexShrink: 0 }}>
          {rightElement}
        </Row>
      )}
    </Row>
  );
}
