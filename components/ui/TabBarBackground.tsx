// @/components/ui/TabBarBackground.tsx
import React from "react";
import { StyleSheet, View } from "react-native";

interface TabBarBackgroundProps {
  backgroundColor: string;
}

const TabBarBackground: React.FC<TabBarBackgroundProps> = ({
  backgroundColor,
}) => {
  return <View style={[styles.container, { backgroundColor }]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TabBarBackground;
