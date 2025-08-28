import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    backgroundColor: "#DC0A2D",
    height: 100,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pokeball: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: "FiraSans_700Bold",
    color: "white",
    fontSize: 26,
    marginRight: 16,
  },
});
