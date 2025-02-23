import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { PanGestureHandler } from "react-native-gesture-handler";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function EchoPlayer({
  title,
  audioUri,
  transcription,
}: {
  title: string;
  audioUri: string;
  transcription: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(192000); // Default to 3:12 (3 min 12 sec)
  const [sound, setSound] = useState(null);
  const playbackInstance = useRef(null);

  // Load and play audio
  const handlePlayPause = async () => {
    try {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true },
        );
        setSound(newSound);
        playbackInstance.current = newSound;
        newSound.setOnPlaybackStatusUpdate(updateStatus);
        setIsPlaying(true);
      } else {
        const status = await playbackInstance.current.getStatusAsync();
        if (status.isPlaying) {
          await playbackInstance.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await playbackInstance.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  };

  // Update UI when audio progresses
  const updateStatus = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 192000);
    }
  };

  // Handle seek bar movement
  const handleSeek = (event) => {
    const newPos = Math.max(0, Math.min(event.nativeEvent.x / width, 1));
    const newMillis = newPos * duration;
    setPosition(newMillis);
    playbackInstance.current?.setPositionAsync(newMillis);
  };

  // Format time in mm:ss
  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Play Button & Seekbar */}
      <View style={styles.seekContainer}>
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          <FontAwesome5
            name={isPlaying ? "pause" : "play"}
            size={18}
            color="#FFF"
          />
        </TouchableOpacity>

        {/* Seekbar */}
        <PanGestureHandler onGestureEvent={handleSeek}>
          <View style={styles.seekBarContainer}>
            <View style={styles.seekBar}>
              <View
                style={[
                  styles.seekProgress,
                  { width: `${(position / duration) * 100}%` },
                ]}
              />
            </View>
          </View>
        </PanGestureHandler>

        {/* Time Display */}
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      {/* Transcription */}
      <Text style={styles.transcription}>
        <Text style={{ fontStyle: "italic", color: "#aaa" }}>
          {transcription
            ? transcription.slice(0, 100)
            : "Lorem ipsum dolor sit amet fhwe dfw liEJw fjoiwejfio"}
          ...
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C2E3B",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF5016",
  },
  seekContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  playButton: {
    width: 35,
    height: 35,
    backgroundColor: "#6A6C75",
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  seekBarContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#555",
  },
  seekBar: {
    height: "100%",
    backgroundColor: "#888",
  },
  seekProgress: {
    height: "100%",
    backgroundColor: "#FF5016",
  },
  timeText: {
    color: "#AAA",
    marginLeft: 10,
    fontSize: 14,
  },
  transcription: {
    marginTop: 10,
    fontSize: 14,
    color: "#ddd",
  },
  uploadButton: {
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
