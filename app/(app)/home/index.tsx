import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { Audio } from "expo-av";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import NotificationButton from "@/components/NotificationButton";
import { useEffect, useState } from "react";
import Svg, { G, Path } from "react-native-svg";
import type { Recording } from "expo-av/build/Audio";
import EchoPlayer from "@/components/EchoPlayer";

export default function Index() {
  const { user, error } = useAuth0();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = useState<Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [echos, setEchos] = useState([]);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserEchos();
    }
  }, [user]);

  const checkLoginStatus = async () => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (!token) {
      router.replace("/login");
    }
  };

  const fetchUserEchos = async () => {
    const response = await fetch(
      "https://api.getmemoria.tech/user/list-echos",
      {
        headers: {
          Authorization: `Bearer ${user!.sub}`,
        },
      },
    );

    const result = await response.json();
    console.log("Echos:", result);
    setEchos(result.echos ?? []);
  };

  if (!user) {
    return (
      <View className="bg-[#171A22] flex-1 justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="bg-[#171A22] flex-1 justify-start items-start w-full">
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          overflowY: "scroll",
        }}
      >
        <View className="flex flex-row items-start justify-start gap-4 pt-8 pb-6 w-[350px]">
          <View className="flex flex-col items-start justify-start gap-4">
            <Text className="text-[40px] font-semibold text-white">
              Welcome, {user.name === user.email ? "friend" : user.name}!
            </Text>
            <Text className="text-white font-bold text-[17px]">
              Today's Echoes
            </Text>
          </View>
          {/* <View className="mt-2">
            <NotificationButton onPress={() => router.push("/notifications")} />
          </View> */}
        </View>
        <View className="mt-auto mb-auto overflow-scroll flex items-start justify-start w-[350px] mx-auto">
          {isRecording && (
            <Text className="text-[#F9F1F9] font-semibold text-[20px] w-[350px] mx-auto">
              smile, you're being recorded :)
            </Text>
          )}
          {!isRecording && echos.length === 0 && (
            <View className="w-[350px] mx-auto">
              <Svg
                width={218}
                height={79}
                fill="none"
                style={{ marginLeft: 15 }}
              >
                <G stroke="#F9F1F9" strokeLinecap="round" opacity={0.75}>
                  <Path
                    strokeWidth={2}
                    d="M29.592 47.119c-1.222-1.916-2.026-1.54-3.221.393-2.121 3.427-2.755 8.527-2.063 12.384.845 4.706 2.741 9.043 6.368 12.293 4.42 3.962 9.304 5.353 15.234 4.773 10.36-1.015 16.526-8.816 19.584-18.018.104-.312 1.057-3.571 1.28-3.126.876 1.76-1.004 4.964-2.018 6.253-4.838 6.148-13.499 12.05-21.616 11.145-7.999-.891-12.781-9.655-13.608-16.794-.46-3.958-.056-7.807.451-11.734.165-1.275.385-2.69.422-3.973.036-1.278 0 .508 0 .846 0 7.948 4.106 15.373 9.784 20.751 3.695 3.5 8.82 4.648 13.744 3.474 4.398-1.05 7.754-4.26 10.01-8.065 1.542-2.6 2.33-5.684 1.566-8.7-.599-2.36-1.99-4.701-3.131-6.825-.677-1.26-1.407-2.321-2.484-3.247-2.264-1.948-4.82-2.433-7.391-3.655-.385-.183-1.98-.714-1.325.302 1.07 1.658 2.486 3.075 3.553 4.727 2.746 4.252 5.354 9.148 4.877 14.408-.644 7.111-8.11 16.525-15.79 11.387-2.333-1.56-4.075-4.72-5.435-7.128-.318-.564-.775-1.303-.918-1.949-.174-.782 1.081.04 1.34.136 3.327 1.244 6.491 3.504 10.22 3.504 4.676 0 8.626-2.678 10.447-6.977 1.212-2.861.722-6.477-.075-9.364-.317-1.15-.804-5.05-2.92-4.5-.853.222-.956 1.249-1.16 1.963-.035.124-2.416-1.593-2.709-1.752-2.19-1.184-4.803-1.947-7.3-1.903-.369.007-6.112.549-6.112 1.299 0 .213.404-.133.602-.212.47-.186.96-.344 1.445-.483 1.733-.497 3.361-1.306 5.103-1.812 2.73-.793 5.075-1.238 7.903-1.238 1.157 0 1.94 0 2.71.815 1.487 1.575 2.237 3.656 2.649 5.77.247 1.267.48 2.526.662 3.805.103.718-.01 2.004.362 2.643.582 1.002 1.201-1.523 1.264-1.737.678-2.312.635-4.848-.331-7.098-3.09-7.201-9.293-12.502-17.371-12.022-5.554.33-10.294 3.018-14.963 5.8-3.048 1.815 1.079 1.539 2.333 1.329 6.64-1.11 13.788-2.704 20.532-1.873 7.746.954 10.824 11.043 10.824 17.73 0 1.639-2.377-2.193-2.56-2.491-2.285-3.742-5.27-7.296-8.971-9.666-5.25-3.362-11.89-2.347-17.22.136-3.526 1.642-.29 2.014 1.775 2.235 8.262.884 26.078.08 24.13 13.366-.293 2.003-2.888 7.557-2.032 5.724 1.788-3.827-.583-9.457-2.589-12.687-5.989-9.642-18.521-8.94-27.878-5.527-.881.321.549.85.813.966 2.406 1.063 4.993 1.689 7.496 2.508 3.79 1.24 7.524 2.287 11.155 3.987 2.136 1 4.136 1.98 5.313 4.138 1.997 3.66.478 7.364-2.032 10.27-.287.331-1.4 1.359-.767.241a21.064 21.064 0 0 0 1.971-4.863c1.582-5.853-1.848-11.022-6.006-14.8-5.088-4.624-11.822-8.281-18.576-9.787-3.034-.676-6.506-.868-9.257.83-1.79 1.105-1.117 3.501.12 4.743.712.714 1.37 1.562 2.303 1.978.485.216 1.335.06 1.837.06 2.935 0 5.56.328 8.43 1.028 6.513 1.588 12.656 5.785 17.13 10.722 2.852 3.148 4.59 7.683 3.899 11.977-.163 1.015-.208 2.024-.391 3.035-.064.35-.165 1.174.045.363.637-2.467-.67-5.67-1.867-7.733-1.643-2.83-4.41-7.13-7.572-8.502-4.243-1.841-9.114-2.055-13.472-3.64-3.14-1.142-6.046-2.899-9.122-4.199-.61-.257.615 1.214.677 1.3 2.227 3.094 5.12 5.984 7.813 8.668 4.481 4.467 9.739 8.35 15.67 10.617 3.701 1.415 7.371.357 10.808-1.223.753-.346 1.42-.937 2.273-.937.956 0 .28.245-.331.272a36.466 36.466 0 0 1-14.421-2.295c-8.446-3.191-15.927-8.762-20.02-16.975-.623-1.25-.68-2.584-1.054-3.897-.068-.237-.102-1.55-.467-.89-1.636 2.954-.795 9.028-.075 12.006 2.144 8.873 9.218 15.538 17.552 18.515 5.798 2.072 12.593 1.056 18.26-1.012.176-.064 2.084-.665 1.4-.498-1.254.305-2.518.462-3.794.634-8.541 1.154-17.854 1.317-26.163-1.238-8.94-2.75-17.668-9.434-20.261-18.727-.68-2.433.481-4.594.481-6.932 0-.836.157 1.664.271 2.492.653 4.74 1.451 9.343 2.98 13.91 2.97 8.859 10.664 16.85 20.112 18.44 7.798 1.311 16.321-.446 22.46-5.528.625-.518 5.314-5.055 2.378-4.727-1.741.194-3.555 1.47-5.209 2.069-3.335 1.206-6.616 2.084-10.13 2.643-9.319 1.482-19.197-1.454-25.756-8.382-3.617-3.82-6.155-8.316-7.813-13.306-1.296-3.898-.584-7.407 1.129-11.1 1.513-3.261 3.396-6.27 5.48-9.182.144-.202.872-1.64.872-.68 0 1.018.338 1.919.482 2.915.356 2.466.325 4.955.768 7.415 1.385 7.695 4.95 15.539 11.395 20.222 5.217 3.792 11.648 4.924 17.943 4.924.86 0 1.63-.222 2.47-.272.474-.028-.932-.193-1.4-.272-4.388-.733-9.107-3.436-12.736-5.814-7.093-4.65-13.81-11.278-17.206-19.195-1.707-3.982-2.54-7.42-1.505-11.69.153-.63.208-1.509.873-1.842.14-.07 1.054-.172 1.054.075 0 .168-.281.124-.377.166-.342.153-.49.7-.677.997-.427.68-.613 1.495-.662 2.296-.447 7.313 1.71 15.314 4.726 21.898 2.377 5.187 5.793 10.296 10.748 13.2.982.575 1.943.928 2.95 1.42.197.095 1.222.632.498.241-3.803-2.054-7.436-3.887-10.643-6.887-2.857-2.672-5.527-5.398-7.843-8.563-1.474-2.014-3.434-4.443-4.26-6.841-.3-.875-.918-4.15.693-4.199 2-.06 4.545 1.023 6.111 2.19 3.826 2.851 7.277 5.74 11.968 7.023 1.744.477 6.21.71 6.307 3.353.043 1.165-.53.52-1.174 0-2.314-1.87-4.465-3.907-6.503-6.072-2.253-2.392-4.484-4.804-6.353-7.52-1.286-1.871-1.348-3.713.648-5.15 2.25-1.621 5.676-1.34 8.204-.952 4.355.667 8.745 2.47 12.614 4.56 5.738 3.1 9.646 7.529 12.133 13.563.673 1.632 1.118 3.316 1.942 4.878.41.778.04 1.23-.587.438-4.032-5.094-7.67-10.433-11.952-15.344-5.874-6.735-12.581-13.626-21.617-15.48-1.09-.224-3.198.301-4.08-.317-.512-.36 2.081-1.317 2.244-1.36 3.531-.934 7.48.642 10.597 2.13 5.556 2.65 10.766 6.245 15.505 10.164 4.517 3.735 7.275 7.641 8.565 13.396.04.178.814 2.884.617 2.884-.79 0-1.491-2.474-1.7-2.975C52.603 43.36 49.21 38 45.758 33.104c-2.916-4.136-6.05-8.232-10.04-11.372-1.005-.79-2.197-1.494-3.101-2.402-2.075-2.081 1.133-1.375 2.242-.875 4.72 2.124 8.664 5.994 12.163 9.695 3.463 3.663 6.43 7.469 8.731 11.946 1.904 3.705 3.482 7.716 3.9 11.901.044.455.222 1.366-.136.544-.67-1.536-1.057-3.253-1.596-4.848-1.444-4.271-3.069-8.414-5.193-12.4-1.809-3.391-3.664-7.392-6.88-9.65"
                  />
                  <Path
                    strokeWidth={2}
                    d="M46 18.651c0-2.07 4.15.892 4.66 1.32 3.183 2.68 6.266 7.612 6.792 11.905.315 2.568 1.102 5.028 1.239 7.617.026.502.309.642.309 0 0-1.039-.012-1.754-.619-2.605M61 30.923c3.345 3.612 4.679 7.106 3.671 12M10 60.312c0-1.058.33.345.421.664.51 1.764 1.648 3.436 2.472 5.068 1.543 3.056 3.91 4.726 7.107 5.88"
                  />
                  <Path
                    strokeWidth={2}
                    d="M8.468 57.923c-1.507 1.68 1.041 5.609 1.814 6.966 2.533 4.45 5.934 7.343 10.718 9.034M1 53.923c0 2.881 1.068 5.96 2.037 8.661 1.256 3.5 3.417 6.612 5.963 9.34M10 71.923c1.075.143 2.653 1.643 3.841 2 2.3.692 4.812.585 7.159 1M3 48.923c.71 1.659 1.424 3.257 2 5"
                  />
                  <Path
                    strokeWidth={3}
                    d="M87.087 39.753c.588 4.704 24.109-1.19 27.44-2.215 9.74-2.997 14.907-5.16 21.78-12.797 17.199-19.11-32.776-7.774-13.782 1.723M76.013 26.464c5.894-.655 24.363-22.624 18.703-24.241-9.84-2.812-23.136 22.027-3.2 15.381M87.087 70.761c9.848 0 18.633-2.477 24.364-11.074M153.534 37.538c0 .001 5.515-9 8.367-11.566 5.026-4.524 10.004-3.938 16.489-3.938 17.662 0 28.202-6.496 37.161-19.934"
                  />
                </G>
              </Svg>
              <Text className="text-[#F9F1F9] font-semibold text-[20px] w-[256px] text-center mt-8 pb-32">
                nothing here....
              </Text>
            </View>
          )}
          {!isRecording && echos.length > 0 && (
            <ScrollView style={{ width: "100%", marginBottom: 260 }}>
              {echos.map((echo) => (
                <EchoPlayer
                  key={echo._id}
                  title={"Echo"}
                  audioUri={echo.url}
                  transcription={echo.transcription}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
      <View className="absolute h-[116px] bg-[#3C4150] w-full bottom-0">
        <View className="flex flex-col items-center justify-center gap-4 -mt-16">
          {!isRecording && (
            <>
              {echos.length < 2 && (
                <Text className="font-semibold text-white opacity-50 text-[17px]">
                  new echo
                </Text>
              )}
              <TouchableOpacity
                onPress={async () => {
                  if (
                    permissionResponse &&
                    permissionResponse.status !== "granted"
                  ) {
                    console.log("Requesting permission..");
                    await requestPermission();
                  }

                  await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                  });

                  console.log("Starting recording..");
                  const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY,
                  );

                  setRecording(recording);
                  setIsRecording(true);
                }}
              >
                <View className="rounded-full border-8 border-white bg-[#DF5325] w-[100px] h-[100px]"></View>
              </TouchableOpacity>
            </>
          )}
          {isRecording && (
            <>
              <Text className="font-semibold text-white opacity-50 text-[17px]">
                {""}
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  if (!recording) {
                    return;
                  }

                  await recording.stopAndUnloadAsync();
                  await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                  });

                  const uri = recording.getURI();

                  if (!uri) {
                    return;
                  }

                  console.log("Recording stopped. URI:", uri);
                  setRecording(null);
                  setIsRecording(false);

                  const formData = new FormData();
                  formData.append("audio", {
                    uri,
                    name: "recording.m4a",
                    type: "audio/m4a",
                  });

                  const response = await fetch(
                    "https://api.getmemoria.tech/upload",
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${user.sub}`,
                        "Content-Type": "multipart/form-data",
                      },
                      body: formData,
                    },
                  );

                  const result = await response.json();
                  console.log("Upload result:", result);

                  fetchUserEchos();
                }}
              >
                <View className="rounded-full border-8 border-[#DF5325] bg-white w-[100px] h-[100px] flex items-center justify-center">
                  <Svg width={30} height={30} fill="none">
                    <Path
                      fill="#FF5016"
                      stroke="#FF5016"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="m1.676 2.342 26.007 13.003L1.676 28.35V2.342Z"
                    />
                  </Svg>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
