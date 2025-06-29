import { Colors } from "@/constants/Colors";
import { useGlobalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Details: React.FC = () => {
  const colorScheme = useColorScheme();
  const { id } = useGlobalSearchParams();

  useEffect(() => {
    async function fetchDetail() {
      fetch("");
    }
  });
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "dark"].background,
      }}
    >
      <Text>details</Text>
    </SafeAreaView>
  );
};

export default Details;
