import { StyleSheet } from "react-native";

export const padding = (a, b, c, d) => ({
  paddingTop: a,
  paddingRight: b !== undefined ? b : a,
  paddingBottom: c !== undefined ? c : a,
  paddingLeft: d !== undefined ? d : b !== undefined ? b : a,
});

export const margin = (a, b, c, d) => ({
  marginTop: a,
  marginRight: b !== undefined ? b : a,
  marginBottom: c !== undefined ? c : a,
  marginLeft: d !== undefined ? d : b !== undefined ? b : a,
});

export const borderRadius = (a, b, c, d) => ({
  borderTopLeftRadius: a,
  borderTopRightRadius: b !== undefined ? b : a,
  borderBottomRightRadius: c !== undefined ? c : a,
  borderBottomLeftRadius: d !== undefined ? d : b !== undefined ? b : a,
});

export const boxShadow = (a, b, c, d) => ({
  shadowOffset: {
    width: a,
    height: b,
  },
  shadowColor: d !== undefined ? d : c,
  shadowRadius: d !== undefined ? c : 0,
  elevation: b * 2,
});

export const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "black",
    opacity: 0.9,
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
  fullSize: {
    flex: 1,
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  gridSpaceBetween: {
    justifyContent: "space-between",
  },
  gridSpaceEvenly: {
    justifyContent: "space-evenly",
  },
  gridSpaceAround: {
    justifyContent: "space-around",
  },
  gridCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  textJustify: {
    textAlign: "justify",
  },
  textCenter: {
    textAlign: "center",
  },
  formContainer: {
    ...padding(0, "10%"),
  },
  inputNotFirst: {
    marginTop: 20,
  },
  shortActionButton: {
    position: "absolute",
    backgroundColor: "white",
    width: 36,
    height: 36,
    ...borderRadius(18),
  },
});
