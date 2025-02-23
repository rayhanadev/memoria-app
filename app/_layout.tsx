import { Stack } from "expo-router";
import { Auth0Provider } from "react-native-auth0";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "../global.css";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <Auth0Provider
      domain={"memoria.us.auth0.com"}
      clientId={"LoLGicLg2kDBhEZ5mUantQVQIw5LGV8u"}
    >
      <GestureHandlerRootView style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </GestureHandlerRootView>
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
