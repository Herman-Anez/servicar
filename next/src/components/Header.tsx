"use client";

import { Row, Text } from "@once-ui-system/core";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <>
      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
        s={{ position: "fixed" }}
      >
        <Row fillWidth vertical="center" paddingX="12" gap="8">
          <Text variant="label-strong-s" onBackground="neutral-strong">
            SERVICAR
          </Text>
        </Row>
        <Row fillWidth horizontal="end" paddingX="12">
          <ThemeToggle />
        </Row>
      </Row>
    </>
  );
};
