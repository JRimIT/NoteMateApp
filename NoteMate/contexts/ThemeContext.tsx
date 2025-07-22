// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themes } from "../themes/theme";

type ThemeName = keyof typeof themes;
type ThemeContextType = {
  theme: ThemeName;
  colors: (typeof themes)[ThemeName];
  setTheme: (themeName: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "retro",
  colors: themes["retro"],
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>("retro");

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("app_theme");
      if (savedTheme && savedTheme in themes) {
        setThemeState(savedTheme as ThemeName);
      }
    };
    loadTheme();
  }, []);

  const setTheme = (themeName: ThemeName) => {
    setThemeState(themeName);
    AsyncStorage.setItem("app_theme", themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: themes[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
