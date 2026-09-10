"use client";

import { useState } from "react";
import { AppScreen } from "./types";

export function useNavigation(initialScreen: AppScreen = "home") {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(initialScreen);

  function navigateTo(screen: AppScreen) {
    setCurrentScreen(screen);
  }

  return { currentScreen, navigateTo, setCurrentScreen };
}
