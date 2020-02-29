import React, { Component } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity, Alert, FlatList } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

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
    const language = await AsyncStorage.getItem("language");
    const uid = await AsyncStorage.getItem("userUID");
    let textContent = textUsa;

    if (language === "br") {
      textContent = textBr;
    }

    this.setState({
      language,
      uid,
      textContent
    });

    System.getListaConversas(uid, async r => {
      let conversas = [];
      r.forEach(r => {
        if (r.val().messages != undefined) {
          conversas.push({
            key: r.key,
            messages: r.val().messages
          });
        }
      });
      let loading = false;
      await this.setState({
        loading,
        conversas
      });
    }, 'Message List');
  }

  lastMsg(item) {
    let obj = item.messages;
    if (obj != "undefined") {
      let last = Object.keys(obj)[Object.keys(obj).length - 1];

      return obj[last].text;
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
      <View style={{display: 'flex', flexDirection:'column', height: '100%', width: '100%'}}>
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
            style={{ flex: 1}}
            // Order by last message sent
            data={s.conversas.sort((a,b) => {
              const lastTalkTime = (obj) => {
                let keys = [];
                for (let prop in obj.messages) {
                  if(obj.messages.hasOwnProperty(prop)) {
                    keys.push(prop);
                  }
                }
                return keys.sort().pop();
              };
              return lastTalkTime(b).localeCompare(lastTalkTime(a));
            })}
            disableRightSwipe
            renderItem={({ item }) => {
              return (<Message
                data={item}
                msg={this.lastMsg(item)}
                uid={this.state.uid}
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
