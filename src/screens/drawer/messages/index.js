import React, { Component } from "react";
import { View, Text, SafeAreaView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";

//Styles
import {
  globalStyles,
  colorsGradient,
  startGradient,
  endGradient
} from "../../globalStyles";
import styles from "./styles";

//Components
import Header from "../../../assets/components/header";

//MessagesList
import MessagesList from "./messagesList";

//TextContent
import { textBr, textUsa } from "../../../assets/content/mainRoute/messages";
import System from "../../../services/api";

export default class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textContent: {},
      conversas: [],
      loading: true
    };
  }

  async componentDidMount() {
    let s = this.state;
    let language = await AsyncStorage.getItem("language");
    const uid = await AsyncStorage.getItem("userUID");

    let textContent = textUsa;

    if (s.language === "br") {
      textContent = textBr;
    }

    System.getListaConversas(uid, async conversationList => {
      let conversas = [];
      conversationList.forEach(conversationObj => {
        if (conversationObj.val().messages) {
          conversas.push({
            key: conversationObj.key,
            unreadMessages: conversationObj.val().unreadMessages,
            messages: conversationObj.val().messages
          });
        }
      });
      let loading = false;
      this.setState({
        language,
        uid,
        textContent,
        loading,
        conversas
      });
    }, 'Message List');

    this.setState({
      language,
      uid,
      textContent
    });
  }

  render() {
    let s = this.state;

    return (
      <LinearGradient
        colors={colorsGradient}
        start={startGradient}
        end={endGradient}
        style={globalStyles.screen}
      >
        <SafeAreaView style={styles.container}>
          <Header back={true} />
          <Text style={[globalStyles.textRegular, styles.mainText]}>
            {s.textContent.title}
          </Text>
          <View>
            <MessagesList
              conversas={this.state.conversas}
              loading={this.state.loading}
              uid={this.state.uid}
              textContent={this.state.textContent}
              language={this.state.language}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}
