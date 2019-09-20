import React, { Component } from "react";
import { WebView, ActivityIndicator, SafeAreaView} from "react-native";

export default class Site extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let s = this.state;
    return (
      <WebView
        renderLoading={() => {
          <ActivityIndicator size="large" color="#0008" />;
        }}
        startInLoadingState={true}
        source={{ uri: "https://theundergradstore.com" }}
        style={{}}
      />
    );
  }
}
