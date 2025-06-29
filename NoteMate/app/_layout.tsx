
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { use, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { useAuthStore } from "../store/authStore";
import SafeScreen from "../components/SafeScreen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const {checkAuth, user, token, isLoading} = useAuthStore()

  const [fontsLoad] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  })

  // Wait for fonts to load before rendering
  useEffect(() => {
    if (fontsLoad) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoad]);

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, []);

  // useEffect(() => {
  //   if (isLoading) return;
  //   // Redirect to login if not authenticated
  //   if (!user && !token && segments[0] !== "(auth)") {
  //     router.replace("/(auth)");
  //   } else if (user && token && segments[0] === "(auth)") {
  //     // Redirect to home if authenticated and trying to access auth routes
  //     router.replace("/(tabs)");
  //   }
  // }, [user, token, segments, router, isLoading]);

  useEffect(() => {
    if (isLoading || !segments?.[0]) return;
  
    const inAuthGroup = segments[0] === "(auth)";
  
    if (!user && !token && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (user && token && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments, isLoading]);
  
  

  return (
    <SafeAreaProvider>
      <SafeScreen>

        <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)"  />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  )
}
