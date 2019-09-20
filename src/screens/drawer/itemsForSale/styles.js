import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    backgroundColor: "#CCC",
    borderRadius: 0.5,
    height: 1,
    width: "100%",
    marginBottom: 10
  },
  itemArea: {
    height: 140,
    maxHeight: 140,
    width: "45%",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#FFF"
  }
});

export default styles;
