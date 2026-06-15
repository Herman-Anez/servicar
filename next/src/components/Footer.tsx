import { Row, Text } from "@once-ui-system/core";
import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <Row as="footer" fillWidth padding="8" horizontal="center" s={{ direction: "column" }}>
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        horizontal="center"
        vertical="center"
      >
        <Text variant="body-default-xs" onBackground="neutral-weak">
          Servicar © {new Date().getFullYear()} — Sistema de Gestión de Taller
        </Text>
      </Row>
      <Row height="80" hide s={{ hide: false }} />
    </Row>
  );
};
