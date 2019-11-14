import React, { Component } from "react";
import Text from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";

//API
import System from "../../../../services/api";

//Icons
import Icon from "react-native-vector-icons/FontAwesome5";

import {
  textBr,
  textUsa
} from "../../../../assets/content/drawer/MessageScreen";

export default class MessageDetail extends Component {
  constructor(props) {
    super(props);

    let p = this.props.navigation.state.params.data;

    this.state = {
      data: p,
      uid: "",
      messages: [],
      newMessage: "",
      language: "",
      userDireita: {},
      userEsquerda: {},
      userEsquerdaInfo: {}
    };
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "rgb(21,128,251)"
          }
        }}
      />
    );
  }


  renderSend(props) {
    return (
      <Send {...props}>
          <Icon
                  name="arrow-circle-right"
                  size={30}
                  color="rgb(21,128,251)"
                  style={{
                    marginHorizontal: 10,
                    marginBottom: 7
                  }}
                />
      </Send>
    );
  }

  async componentDidMount() {
    let uid = await AsyncStorage.getItem("userUID");
    let p = this.props.navigation.state.params.data;
    await this.setState({ uid: uid });

    System.getUserInfo(p.key)
      .then(r => {
        this.setState({ userEsquerdaInfo: r.data() });
      })
      .then(this.loadMessages)
      .catch(e => {
        console.log(e);
      });

    let s = this.state;
    let languageSelected = await AsyncStorage.getItem("language");

    s.language = languageSelected;

    this.setState({ language: languageSelected });
  }

  sendMessage = async () => {
    let s = this.state;
    let p = this.props.navigation.state.params.data;

    var lastID = 0;

    if (s.messages.length != 0)
      lastID = s.messages[s.messages.length - 1]["_id"];

    let data = {
      _id: lastID + 1,
      createdAt: new Date().getTime(),
      user: s.uid,
      text: s.newMessage
    };

    System.sendMessage(s.uid, p.key, data);

    if (s.uid !== p.key) {
      System.sendMessage(p.key, s.uid, data);
    }

    await this.setState({ newMessage: "" });

    System.setUnread(p.key, s.uid, 1);

    this.loadMessages();
  };

  loadMessages = async () => {
    let s = this.state;
    let uid = await AsyncStorage.getItem("userUID");
    let p = this.props.navigation.state.params.data;

    s.userDireita = { _id: 0 };
    s.userEsquerda = { _id: 1, name: s.userEsquerdaInfo.name };

    System.getListaConversas(uid, async r => {
      s.messages = [
        {
          _id: 0,
          text:
            (this.state.language == "br"
              ? textBr.mensagemPadrao
              : textUsa.mensagemPadrao) + s.userEsquerdaInfo.name,
          system: true
        }
      ];
      r.forEach(r => {
        if (r.key === p.key) {
          let messages = r.val().messages;
          Object.values(messages).forEach(r => {
            s.messages.push({
              _id: r["_id"],
              createdAt: r.createdAt,
              user: r.user == s.uid ? s.userDireita : s.userEsquerda,
              text: r.text
            });
          });
        }
      });
      console.log(s.messages);
      await this.setState(s);
    });
    System.setUnread(s.uid, p.key, 0);
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.sendMessage}
        onInputTextChanged={m => this.setState({ newMessage: m })}
        user={{
          _id: 0
        }}
        renderAvatar={null}
        renderUsernameOnMessage={true}
        inverted={false}
        placeholder={
          this.state.language == "br" ? textBr.placeholder : textUsa.placeholder
        }
        renderBubble={this.renderBubble}
        renderSend={this.renderSend}
      />
    );
  }
}
