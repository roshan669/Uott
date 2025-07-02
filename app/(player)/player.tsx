import { useGlobalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const MOVIE_URL = "https://player.videasy.net/movie/";
const TV_URL = "https://player.videasy.net/tv/";

export const Player: React.FC = () => {
  const { id, type, season, ep } = useGlobalSearchParams();
  const webviewRef = useRef(null);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  interface ShouldStartLoadEvent {
    url: string;
    [key: string]: any;
  }

  const handleShouldStartLoadWithRequest = (
    event: ShouldStartLoadEvent
  ): boolean => {
    const { url } = event;
    const allowedDomain = "https://player.videasy.net/";

    if (url.startsWith(allowedDomain)) {
      return true; // Allow navigation within videasy.net
    } else {
      return false; // Prevent WebView from loading the external URL
    }
  };

  // New prop for handling window.open()
  const handleOnOpenWindow = ({
    nativeEvent,
  }: {
    nativeEvent: { targetUrl: string };
  }) => {
    return false;
  };

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <WebView
          ref={webviewRef}
          style={styles.webview}
          javaScriptEnabled={true}
          source={{
            uri:
              type === "tv"
                ? `${TV_URL}${id}/${season}/${ep}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true`
                : `${MOVIE_URL}${id}`,
          }}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          // Crucial for pop-ups:
          setSupportMultipleWindows={false} // Prevents WebView from handling new windows internally
          onOpenWindow={handleOnOpenWindow} // Intercepts window.open()
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default Player;
