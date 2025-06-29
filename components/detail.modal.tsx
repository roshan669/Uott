import React from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface DetailModalProps {
  visible: boolean;
  id: number; // You can use this ID to fetch details about the item
  onClose: () => void; // Callback to close the modal from the parent
  // You can add more props here for content customization if needed
  // e.g., title: string; content: React.ReactNode;
}

const DetailModal: React.FC<DetailModalProps> = ({ visible, id, onClose }) => {
  return (
    // SafeAreaProvider should typically wrap your entire app, not just a modal.
    // If your app already uses it at the root, you can remove it here.
    // However, for a self-contained example, it's kept.
    <SafeAreaProvider>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          // This is for Android's hardware back button.
          // You should also call onClose here to let the parent know.
          Alert.alert("Modal has been closed by system back button.");
          onClose();
        }}
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Details for ID: {id}</Text>
            {/* Add more dynamic content here based on the 'id' prop */}
            <Text>This is where content for item {id} would go.</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onClose} // Call the onClose prop passed from parent
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Add a dimming effect
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%", // Make modal width responsive
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15, // Add some space above the button
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DetailModal;
