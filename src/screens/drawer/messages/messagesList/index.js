import React, { Component } from "react";
import { ActivityIndicator, View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

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
        s.conversas.push({
          key: r.key,
          messages: r.val().messages
        });
      });
      console.log(s.conversas);
      s.loading = false;
      await this.setState(s);
    });
  }

  lastMsg(item) {
    var obj = item.messages;
    console.log(obj);
    last = Object.keys(obj)[Object.keys(obj).length - 1];

    return obj[last].text;
  }

  unread(item) {
    var s = this.state;
    var messages;
    System.getListaConversas(s.uid, async r => {
      messages = r.toJSON()[item.key]["unreadMessages"];
      messages = String(messages);
    });
    console.log(messages);
    console.log(typeof messages);
    if (messages == "undefined") return 1;
    return messages;
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
          : <FlatList
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    height: 400,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Icon name="envelope-open" size={50} light color="#0006" />
                  <Text style={globalStyles.textSemiBold}>
                    {s.textContent.empty}
                  </Text>
                </View>
              }
              data={s.conversas}
              renderItem={({ item }) =>
                <Message
                  data={item}
                  msg={this.lastMsg(item)}
                  unread={this.unread(item)}
                />}
              numColumns={1}
              horizontal={false}
              keyExtractor={(item, index) => item.key}
            />}
      </View>
    );
  }
}
