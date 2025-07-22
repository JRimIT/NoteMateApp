import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { themes } from "../../NoteMate/themes/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedTheme: string;
  onSelectTheme: (theme: keyof typeof themes) => void;
};

const ThemePicker: React.FC<Props> = ({
  visible,
  onClose,
  selectedTheme,
  onSelectTheme,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modal}>
          <Text style={styles.title}>Choose Theme</Text>
          {Object.keys(themes).map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, selectedTheme === item && styles.selected]}
              onPress={() => onSelectTheme(item as keyof typeof themes)}
            >
              <Text style={styles.optionText}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

export default ThemePicker;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selected: {
    backgroundColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
});
