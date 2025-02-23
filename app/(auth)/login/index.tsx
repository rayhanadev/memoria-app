import { Button, StyleSheet } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import Svg, { Path } from "react-native-svg";
import { router } from "expo-router";

export default function Index() {
  const { authorize } = useAuth0();

  const onPress = async () => {
    try {
      await authorize().then(async (res) => {
        if (res?.idToken) {
          await SecureStore.setItemAsync("accessToken", res.accessToken);
          await SecureStore.setItemAsync("idToken", res.idToken);

          router.replace("/home");
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <LinearGradient
      colors={["#171A22", "#353A47", "#171A22"]}
      style={styles.gradient}
    >
      <Svg width={301} height={130} fill="none">
        <Path
          stroke="#FF5016"
          strokeLinecap="round"
          strokeWidth={7}
          d="M4 72.35s24.514 4.409 29.895 0C39.275 67.94 38.08 4 46.45 4c8.371 0 9.567 122 19.133 122 9.567 0 5.381-122 14.35-122 8.968 0 6.576 72.759 19.73 72.759M297.5 84.843s-46.569 1.47-53.744 0c-7.175-1.47-2.392-74.963-14.948-73.494-12.555 1.47-8.968 63.94-14.947 65.41"
        />
        <Path
          fill="#FF5016"
          d="M104 79.298V44.702h5.262v34.596H104Zm2.309 0v-7.27h15.345v7.27h-15.345Zm0-14.14V58.29h13.749v6.869h-13.749Zm0-13.186v-7.27h15.209v7.27h-15.209ZM134.221 79.298l-5.262-34.596h5.228l4.855 34.596h-4.821Zm-9.235 0V44.702h4.991v34.596h-4.991Zm12.087 0 4.786-34.596h5.025l-5.16 34.596h-4.651Zm8.792 0V44.702h5.263v34.596h-5.263ZM165.541 80c-2.195 0-4.13-.702-5.805-2.106-1.652-1.437-2.954-3.493-3.904-6.167-.928-2.708-1.392-5.95-1.392-9.727s.464-7.003 1.392-9.677c.95-2.707 2.252-4.763 3.904-6.167 1.675-1.437 3.61-2.156 5.805-2.156 2.196 0 4.119.719 5.772 2.156 1.674 1.404 2.976 3.46 3.904 6.167.95 2.674 1.426 5.9 1.426 9.677 0 3.777-.476 7.02-1.426 9.727-.928 2.674-2.23 4.73-3.904 6.167-1.653 1.404-3.576 2.106-5.772 2.106Zm0-7.32c1.743 0 3.135-.886 4.176-2.658 1.041-1.805 1.562-4.479 1.562-8.022s-.521-6.2-1.562-7.972c-1.041-1.805-2.433-2.708-4.176-2.708-1.743 0-3.135.903-4.176 2.708-1.041 1.771-1.561 4.429-1.561 7.972s.52 6.217 1.561 8.022c1.041 1.772 2.433 2.658 4.176 2.658ZM182.264 67.616v-7.27h6.994c1.29 0 2.218-.352 2.784-1.053.588-.736.882-1.789.882-3.16 0-1.37-.294-2.406-.882-3.108-.566-.702-1.494-1.053-2.784-1.053h-6.994v-7.27h7.299c2.83 0 4.991 1.036 6.485 3.109 1.494 2.072 2.24 4.846 2.24 8.323 0 3.476-.746 6.267-2.24 8.373-1.494 2.072-3.655 3.109-6.485 3.109h-7.299Zm-2.308 11.682V44.702h5.262v34.596h-5.262Zm13.07 0-6.145-14.992h5.432l6.621 14.992h-5.908ZM201.738 79.298V44.702H207v34.596h-5.262Z"
        />
      </Svg>
      <Button title="Login" onPress={onPress} color="#FF5016" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
