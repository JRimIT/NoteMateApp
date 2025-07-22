import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { useAuthStore } from "../store/authStore";
import SafeScreen from "../components/SafeScreen";
import { ThemeProvider } from "../contexts/ThemeContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token, isLoading } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  const [fontsLoad] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoad) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [fontsLoad]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady || isLoading || !segments?.[0]) return;

    const inAuthGroup = segments[0] === "(auth)";
    console.log("inAuthGroup: ", segments[0]);

    if (!user && !token && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (user && token && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments, isLoading, isReady]);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeScreen>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </SafeScreen>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
