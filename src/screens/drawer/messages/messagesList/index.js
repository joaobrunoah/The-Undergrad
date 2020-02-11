import React, { Component } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { SwipeListView } from "react-native-swipe-list-view";

// Icon
import Icon from "react-native-vector-icons/FontAwesome5";

//API
import System from "../../../../services/api";

import Message from "../messagesItem";

// Styles
import { globalStyles } from "../../../globalStyles";

// Textos
import { textBr, textUsa } from "../../../../assets/content/mainRoute/messages";

export default class MessagesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "",
      uid: "",
      textContent: {},
      conversas: [],
      loading: true
    };
    this.props = props;
  }

  async componentDidMount() {
    let s = this.state;
    s.language = await AsyncStorage.getItem("language");
    var uid = await AsyncStorage.getItem("userUID");
    s.uid = uid;

    if (s.language === "br") {
      s.textContent = textBr;
    } else if (s.language === "usa") {
      s.textContent = textUsa;
    }

    this.setState(s);

    System.getListaConversas(uid, async r => {
      s.conversas = [];
      r.forEach(r => {
        if (r.val().messages != undefined) {
          s.conversas.push({
            key: r.key,
            messages: r.val().messages
          });
        }
      });
      s.loading = false;
      await this.setState(s);
    });
  }

  lastMsg(item) {
    var obj = item.messages;
    if (obj != "undefined") {
      last = Object.keys(obj)[Object.keys(obj).length - 1];

      return obj[last].text;
    }
  }

  unread(item) {
    var s = this.state;
    var messages;
    System.getListaConversas(s.uid, async r => {
      messages = r.toJSON()[item.key]["unreadMessages"];
      messages = String(messages);
    });
    if (messages == "undefined") return 1;
    else {
      return messages;
    }
  }
  delete = async (item) => {
    try {
      if (window.confirm("Tem certeza de que deseja apagar essas mensagens?")) await System.deleteMessages(this.state.uid, item.key);
    } catch (e) {
      console.warn(e)
    }
  }

  render() {
    let s = this.state;

    return (
      <View>
        {s.loading
          ? <View
            style={{
              flex: 1,
              marginTop: 60,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ActivityIndicator size="large" color="#0008" />
          </View>
          : <SwipeListView
            rightOpenValue={-75}
            data={s.conversas}
            disableRightSwipe
            renderItem={({ item }) => {

              return (<Message
                data={item}
                msg={this.lastMsg(item)}
                unread={this.unread(item)}
              />)
            }
            }
            renderHiddenItem={({ item }) => (
              <View style={{
                alignItems: 'center',
                backgroundColor: '#DF2020',
                flex: 1,
                flexDirection: 'row-reverse',
                paddingLeft: 15,
              }}>
                <TouchableOpacity onPress={() => { this.delete(item) }}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          // numColumns={1}
          // horizontal={false}
          // keyExtractor={(item, index) => item.key}
          />}
      </View>
    );
  }
}
