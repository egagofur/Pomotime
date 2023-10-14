import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Slot
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </ThemeProvider>
  );
}
