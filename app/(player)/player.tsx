import { useGlobalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

export const Player: React.FC = () => {
  const { id, type } = useGlobalSearchParams();

  useEffect(() => {
    // Lock to landscape on mount
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      // Unlock on unmount
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        // mediaPlaybackRequiresUserAction={false}
        // originWhitelist={["*"]}
        style={styles.webview}
        injectedJavaScript={`
  window.open = function() { return null; };
  document.addEventListener('click', function(e) {
    if (e.target && e.target.target === '_blank') {
      e.preventDefault();
    }
  }, true);
`}
        javaScriptEnabled={true}
        source={{
          uri: `https://player.autoembed.cc/embed/movie//${id}`,
        }}
        onShouldStartLoadWithRequest={(event) => {
          const adDomains = [
            "ads.com",
            "doubleclick.net",
            "googlesyndication.com",
          ];
          if (adDomains.some((domain) => event.url.includes(domain))) {
            return false;
          }
          // ...your existing logic
          return true;
        }}
      />
    </View>
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
