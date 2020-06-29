import React from "react";
import { View, SafeAreaView, StatusBar } from "react-native";
// Theme provisioning
import { Provider as PaperProvider } from "react-native-paper";
import theme from "./react/theme";
// Router
import { NativeRouter, Route } from "react-router-native";
// Custom Provider
import { RootProvider } from "./react/context/RootContext";
// Custom Root Component
import ErrorBoundary from "./react/components/ErrorBoundary";
import RootRouter from "./react/components/RootRouter";

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.black }}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <PaperProvider theme={theme}>
            <NativeRouter>
              <ErrorBoundary>
                <RootProvider>
                  <Route component={RootRouter} />
                </RootProvider>
              </ErrorBoundary>
            </NativeRouter>
          </PaperProvider>
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
