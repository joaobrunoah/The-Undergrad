import React, { Component } from "react";
import {
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

//API
import System from "../../../../services/api";

//Icons
import Icon from "react-native-vector-icons/FontAwesome5";

// Textos
import { textBr, textUsa } from "../../../../assets/content/mainRoute/categs";

//Components
import Header from "../../../../assets/components/header";

//Styles
import {
  globalStyles,
  colorsGradient,
  startGradient,
  endGradient
} from "../../../globalStyles";
import styles from "./styles";

export class Mensagem extends Component {
  constructor(props) {
    super(props);
    let p = this.props.data;

    this.state = {
      data: p,
      style: { alignSelf: "flex-start" }
    };
  }

  async componentDidMount() {
    let s = this.state;
    let uid = await AsyncStorage.getItem("userUID");
    let style = {
      paddingVertical: 5,
      paddingHorizontal: 10,
      maxWidth: 300,
      marginVertical: 2,
      borderRadius: 10
    };

    if (s.data.user == uid) {
      s.style = {
        ...style,
        backgroundColor: "#c0ffa2",
        alignSelf: "flex-end"
      };
    } else {
      s.style = {
        ...style,
        backgroundColor: "#a6a6a6",
        alignSelf: "flex-start"
      };
    }

    this.setState(s);
  }

  render() {
    let s = this.state;

    return (
      <View style={s.style}>
        <Text
          style={{
            color: "#0008",
            textAlign: "justify",
            fontFamily: "Montserrat-SemiBold"
          }}
        >
          {s.data.message}
        </Text>
        <Text
          style={{
            color: "#0006",
            fontFamily: "Montserrat-SemiBold",
            fontSize: 12
          }}
        >
          {s.data.hour}
        </Text>
      </View>
    );
  }
}

export default class MessageDetail extends Component {
  constructor(props) {
    super(props);

    let p = this.props.navigation.state.params.data;

    this.state = {
      data: p,
      uid: "",
      messages: [],
      newMessage: ""
    };
  }

  async componentWillMount() {
    let s = this.state;
    s.language = await AsyncStorage.getItem("language");

    if (s.language === "br") {
      s.textContent = textBr;
    } else if (s.language === "usa") {
      s.textContent = textUsa;
    }

    this.setState(s);
  }

  async componentDidMount() {
    let uid = await AsyncStorage.getItem("userUID");
    let p = this.props.navigation.state.params.data;
    await this.setState({ uid: uid });
    await System.setUnread(uid, p.key, true);
    this.loadMessages();
  }

  sendMessage = async () => {
    let s = this.state;
    let p = this.props.navigation.state.params.data;
    let d = this.props.navigation.state.params.data2;
    let prefixo = typeof d === "undefined" ? "" : "[" + d.description + " - " + s.textContent.price + Number(d.price).toFixed(2).toString() + "]\n";
    let hora = moment().format('HH:mm');
    let full_date = moment().format('YYYYMMDDHHmmss');

    let data = {
      full_date: full_date,
      hour: hora,
      user: s.uid,
      message: prefixo + s.newMessage
    };

    await System.setUnread(p.key, s.uid, false);
    await System.sendMessage(s.uid, p.key, data);

    if (s.uid !== p.key) {
      await System.sendMessage(p.key, s.uid, data);
    }

    await this.setState({ newMessage: "" });

    this.loadMessages();
  };

  loadMessages = async () => {
    let s = this.state;
    let uid = await AsyncStorage.getItem("userUID");
    let p = this.props.navigation.state.params.data;

    System.getListaConversas(uid, async r => {

      let messageArray = [];
      r.forEach(r => {
        if (r.key === p.key) {
          System.setUnread(uid, p.key,true);
          let messages = r.val().messages;
          for (let param in messages) {
            if (messages.hasOwnProperty(param)) {
              let message = messages[param];
              message.id = param;

              messageArray.push({
                id: message.id,
                hour: message.hour,
                full_date: message.full_date,
                user: message.user,
                message: message.message
              });
            }
          }
        }
      });

      messageArray = messageArray.sort((a, b) => {
        if(a && a.full_date && b && b.full_date) {
          return b.full_date.localeCompare(a.full_date);
        } else {
          if (!a || !a.full_date) {
            return 1;
          } else {
            return -1;
          }
        }
      });

      this.setState({ messages: messageArray });
    }, 'Actual Conversation');
  };

  render() {
    let s = this.state;

    return (
      <LinearGradient
        colors={colorsGradient}
        start={startGradient}
        end={endGradient}
        style={globalStyles.screen}
      >
        <SafeAreaView
          style={{
            margin: -10,
            padding: 10,
            backgroundColor: "#FFF",
            zIndex: 7,
            opacity: 0.8
          }}
        >
          <Header back={true} backCb={() => {
            System.removeListaConversas('Actual Conversation');
          }}/>
        </SafeAreaView>

        <SafeAreaView style={styles.container}>
          <View
            style={{
              padding: 10,
              paddingBottom: 50,
              height: "100%",
              width: "100%"
            }}
          >
            <FlatList
              inverted
              style={{ marginTop: 10 }}
              contentContainerStyle={{ paddingTop: 10, paddingBottom: 10}}
              data={s.messages}
              renderItem={({ item }) => (
                <Mensagem data={item} user={item.user} />
              )}
              keyExtractor={(item, index) => item.id+''+index}
            />
          </View>
          <View style={styles.messageTextArea}>
            <TextInput
              value={s.newMessage}
              onChangeText={text => {
                this.setState({ newMessage: text });
              }}
              placeholder="Digite aqui sua mensagem"
              style={[
                globalStyles.textRegular,
                {
                  height: 40,
                  maxHeight: 40,
                  width: "90%",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  flexDirection: "row",
                  borderColor: "#CCC",
                  borderWidth: 1,
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "flex-start"
                }
              ]}
            />
            <TouchableOpacity
              onPress={this.sendMessage}
              style={{ marginRight: 5 }}
            >
              <Icon name="arrow-circle-right" size={24} color="#737373" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}
