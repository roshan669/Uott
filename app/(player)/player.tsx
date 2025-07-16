import { useKeepAwake } from "expo-keep-awake";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const MOVIE_URL = "https://player.videasy.net/movie/";
const TV_URL = "https://player.videasy.net/tv/";

export const Player: React.FC = () => {
  useKeepAwake();
  const { id, type, season, ep } = useGlobalSearchParams();
  // const webviewRef = useRef(null);
  const navigation = useNavigation();

  // const [isFullscreen, setIsFullscreen] = useState(false);
  // const [brightness, setBrightness] = useState(1);
  // const lastTouchY = useRef(0);

  useEffect(() => {
    navigation.setOptions({ headerShown: false, animation: "fade" });
  }, [navigation]);

  // useEffect(() => {
  //   // Get initial brightness
  //   Brightness.getBrightnessAsync().then(setBrightness);
  //   Brightness.requestPermissionsAsync(); // Request permission for brightness control
  // }, []);

  interface ShouldStartLoadEvent {
    url: string;
    [key: string]: any;
  }

  const handleShouldStartLoadWithRequest = (
    event: ShouldStartLoadEvent
  ): boolean => {
    const { url } = event;
    const allowedDomain = "https://player.videasy.net";

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
  // Listen for fullscreen events from the WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data && data.type === "fullscreenchange" && data.isFullscreen) {
        // setIsFullscreen(true);
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } else if (
        data &&
        data.type === "fullscreenchange" &&
        !data.isFullscreen
      ) {
        // setIsFullscreen(false);
        ScreenOrientation.unlockAsync();
      }
    } catch {}
  };

  // PanResponder for brightness control inside Modal
  // const panResponder = useMemo(
  //   () =>
  //     PanResponder.create({
  //       onStartShouldSetPanResponder: () => true,
  //       onMoveShouldSetPanResponder: () => true,
  //       onPanResponderGrant: (evt, gestureState) => {
  //         // When the gesture starts, initialize lastTouchY with the current dy.
  //         // For the first move, deltaY will be gestureState.dy - 0, so it will be just gestureState.dy.
  //         lastTouchY.current = 0; // Reset dy tracking for a new gesture
  //       },
  //       onPanResponderMove: async (evt, gestureState) => {
  //         if (!isFullscreen) return; // Only allow brightness control in fullscreen

  //         const x = gestureState.moveX;
  //         const width = Dimensions.get("window").width;
  //         if (x > width * 0.25) return; // Only apply if gesture is on the left 25% of the screen

  //         // Calculate the change in Y displacement since the *last* move event
  //         // gestureState.dy is the accumulated displacement from the start of the gesture.
  //         const deltaY = gestureState.dy - lastTouchY.current;

  //         // Update lastTouchY for the *next* move event
  //         lastTouchY.current = gestureState.dy;

  //         // Negate deltaY so that dragging UP (negative deltaY) increases brightness
  //         // and dragging DOWN (positive deltaY) decreases brightness.
  //         const sensitivity = 0.02; // Adjust as needed, try 0.01 or 0.02 for more responsiveness
  //         let brightnessChange = -deltaY * sensitivity;

  //         // Calculate the new brightness, ensuring it stays between 0 and 1
  //         let newBrightness = brightness + brightnessChange;
  //         newBrightness = Math.max(0, Math.min(1, newBrightness));

  //         // Update the state and set the device brightness
  //         setBrightness(newBrightness);
  //         await Brightness.setBrightnessAsync(newBrightness);

  //         console.log(
  //           "PanResponderMove: " + "Current Acc. DY:",
  //           gestureState.dy.toFixed(2),
  //           " | " + "Delta Y (since last move):",
  //           deltaY.toFixed(2),
  //           " | " + "Brightness Change:",
  //           brightnessChange.toFixed(3),
  //           " | " + "New Brightness:",
  //           newBrightness.toFixed(2)
  //         );
  //       },
  //       onPanResponderRelease: () => {
  //         // No specific action needed here.
  //       },
  //     }),
  //   [isFullscreen, brightness] // Re-create memoized value if these dependencies change
  // );

  return (
    <>
      <StatusBar style={"light"} translucent />
      <SafeAreaView style={[styles.container, { backgroundColor: "#000" }]}>
        <WebView
          style={[
            styles.webview,
            {
              backgroundColor: "#000",
            },
          ]}
          javaScriptEnabled={true}
          allowsFullscreenVideo={true}
          injectedJavaScriptBeforeContentLoaded=""
          overScrollMode="never"
          startInLoadingState={true}
          renderLoading={() => (
            <View style={{ flex: 1, backgroundColor: "#000" }} />
          )}
          source={{
            uri:
              type === "tv"
                ? `${TV_URL}${id}/${season}/${ep}?nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true`
                : `${MOVIE_URL}${id}`,
          }}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          setSupportMultipleWindows={false}
          onOpenWindow={handleOnOpenWindow}
          onMessage={handleMessage}
          injectedJavaScript={`
            document.documentElement.style.backgroundColor = '#000000';
            document.body.style.backgroundColor = '#000000';
            document.addEventListener('fullscreenchange', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'fullscreenchange', isFullscreen: !!document.fullscreenElement }));
            });
            true;
          `}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  webview: {
    flex: 1,
  },
});

export default Player;
