import React, { Component } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { SwipeListView } from "react-native-swipe-list-view";

// Icon
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

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
      console.log(s.conversas);
      s.loading = false;
      await this.setState(s);
    });

    console.log(s.conversas);
  }

  lastMsg(item) {
    console.log(item);
    console.log(item.messages);
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
      let other_user_name = await System.getUserInfo(item.key).then((user) => { return user.data().name }).catch((e) => { return 'unknown User' });
      Alert.alert(
        this.state.language === 'br' ? 'Você tem certeza de que deseja apagar?'
          : this.state.language === 'usa' ? 'Are you sure that you want to delete?'
            : 'Você tem certeza de que deseja apagar?',
        this.state.language === 'br' ? `Apagar as mensagens de ${other_user_name}?`
          : this.state.language === 'usa' ? `Delete the messages of ${other_user_name}?`
            : `Apagar as mensagens de ${other_user_name}?`,
        [
          {
            text: this.state.language === 'br' ? 'Cancelar' : this.state.language === 'usa' ? 'Cancel' : 'Cancelar',
            onPress: () => { },
            style: 'cancel',
          },
          { text: 'OK', onPress: async () => await System.deleteMessages(this.state.uid, item.key) },
        ],
        { cancelable: false },
      );
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
                  <FontAwesomeIcon name={'trash-o'} style={{ color: 'white', fontWeight: 'bold', paddingRight: 7 }} size={35} />
                </TouchableOpacity>
              </View>
            )}
          />}
      </View>
    );
  }
}
