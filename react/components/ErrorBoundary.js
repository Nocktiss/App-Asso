import React from "react";
import { View, Image } from "react-native";
import logo from "../images/logo.png";
import { Link } from "react-router-native";
import { RT_ANIMAL_HOME } from "../config/_constants";
import { withTranslation as translate } from "react-i18next";
import { StyleMixins } from "./lib";
// import { AuthContext } from "../context/AuthContext";
import { Paragraph, Button } from "react-native-paper";
import { addRequestFailedHandler } from "../context/actions/utils";

class ErrorBoundary extends React.Component {
  // static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidMount() {
    addRequestFailedHandler(event => {
      if (event.error.name === "TokenExpiredError") {
        this.context.actions.logout();
        this.setState({ hasError: false });
        event.stopPropagation = true;
      }
    });
  }

  static getDerivedStateFromError(error) {
    // Mettez à jour l'état, de façon à montrer l'UI de repli au prochain rendu.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View
          style={[
            StyleMixins.styles.fullSize,
            StyleMixins.styles.gridCenter,
            StyleMixins.styles.gridSpaceBetween,
          ]}>
          <Image style={{ width: "50%" }} source={logo} />

          <View
            style={[
              StyleMixins.styles.fullSize,
              StyleMixins.styles.gridCenter,
            ]}>
            <Paragraph
              variant={"body1"}
              align={"center"}
              style={{
                marginBottom: 15,
                ...StyleMixins.padding(0, 15),
              }}>
              {this.props.t("error_catch")}
            </Paragraph>
            <Button
              size="large"
              color={"primary"}
              variant={"contained"}
              component={Link}
              to={RT_ANIMAL_HOME}
              onPress={() => this.setState({ hasError: false })}>
              {this.props.t("home")}
            </Button>
          </View>
        </View>
      );
    }
    return this.props.children;
  }
}

export default translate()(ErrorBoundary);
