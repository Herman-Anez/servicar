"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/resources";
import { Flex, Spinner, Column } from "@once-ui-system/core";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

const DYNAMIC_ROUTE_PREFIXES = ["/ticket", "/admin"] as const;

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = () => {
      setLoading(true);

      if (!pathname) {
        setIsRouteEnabled(false);
        setLoading(false);
        return;
      }

      // Exact match
      if (pathname in routes) {
        setIsRouteEnabled(routes[pathname as keyof typeof routes]);
        setLoading(false);
        return;
      }

      // Dynamic prefix match
      for (const prefix of DYNAMIC_ROUTE_PREFIXES) {
        if (pathname.startsWith(prefix) && routes[prefix as keyof typeof routes]) {
          setIsRouteEnabled(true);
          setLoading(false);
          return;
        }
      }

      setIsRouteEnabled(false);
      setLoading(false);
    };

    check();
  }, [pathname]);

  if (loading) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  if (!isRouteEnabled) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export { RouteGuard };
