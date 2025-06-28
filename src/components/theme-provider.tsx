"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      themes={["light", "dark", "matcha"]}
      defaultTheme="light"
      attribute="class"
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
