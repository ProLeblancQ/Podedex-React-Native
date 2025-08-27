import { StyleSheet, Dimensions } from "react-native";

const CARD_GAP = 12;
const COLS = 2;
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - (COLS + 1) * CARD_GAP) / COLS;

export const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    margin: CARD_GAP / 2,
    borderRadius: 24,
    padding: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    overflow: "hidden",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 10,
  },
  imageWrapper: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  image: { width: 100, height: 100 },
  meta: { alignItems: "center" },
  id: { fontSize: 12, color: "#fff", opacity: 0.8, marginBottom: 4 },
  name: { fontSize: 16, fontWeight: "700", color: "#fff", textTransform: "capitalize" },
});
