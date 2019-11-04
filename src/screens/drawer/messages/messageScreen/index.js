import React, { Component } from "react";
import {
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

//API
import System from "../../../../services/api";

//Icons
import Icon from "react-native-vector-icons/FontAwesome5";

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
      language: "",
      style: { alignSelf: "flex-start" }
    };
  }

  async componentWillMount() {
    let s = this.state;
    let languageSelected = await AsyncStorage.getItem("language");

    s.language = languageSelected;

    this.setState({language: languageSelected});
  };

  async componentDidMount() {
    let s = this.state;
    let uid = await AsyncStorage.getItem("userUID");
    let style = {
      paddingVertical: 5,
      paddingHorizontal: 10,
      maxWidth: 200,
      marginVertical: 5,
      borderRadius: 10
    };

    if (s.data.user == uid) {
      s.style = {
        ...style,
        backgroundColor: "#66ff66",
        alignSelf: "flex-start"
      };
    } else {
      s.style = {
        ...style,
        backgroundColor: "#a6a6a6",
        alignSelf: "flex-end"
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

  async componentDidMount() {
    let uid = await AsyncStorage.getItem("userUID");
    let p = this.props.navigation.state.params.data;
    console.log(p.key);
    await this.setState({ uid: uid });
    this.loadMessages();
  }

  sendMessage = async () => {
    let s = this.state;
    let p = this.props.navigation.state.params.data;
    let hora = `${moment().hour()}:${Number(
      moment()
        .minute()
        .toFixed(2)
    )}`;

    let data = {
      hour: hora,
      user: s.uid,
      message: s.newMessage
    };

    System.sendMessage(s.uid, p.key, data);

    if (s.uid !== p.key) {
      System.sendMessage(p.key, s.uid, data);
    }

    await this.setState({ newMessage: "" });

    this.loadMessages();
  };

  loadMessages = async () => {
    let s = this.state;
    let uid = await AsyncStorage.getItem("userUID");
    let p = this.props.navigation.state.params.data;

    System.getListaConversas(uid, async r => {
      s.messages = [];
      r.forEach(r => {
        if (r.key === p.key) {
          let messages = r.val().messages;
          Object.values(messages).forEach(r => {
            s.messages.push({
              hour: r.hour,
              user: r.user,
              message: r.message
            });
            console.log(r);
          });
        }
      });
      await this.setState(s);
    });
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
          <Header back={true} />
        </SafeAreaView>

        <SafeAreaView style={styles.container}>
          <View
            style={{
              padding: 10,
              height: "100%",
              width: "100%"
            }}
          >
            <FlatList
              style={{ marginTop: 10 }}
              ref="flatList"
              onContentSizeChange={() => this.refs.flatList.scrollToEnd()}
              data={s.messages}
              renderItem={({ item }) => (
                <Mensagem data={item} user={item.user} />
              )}
              keyExtractor={(item, index) => index}
            />
          </View>
          <KeyboardAvoidingView style={styles.messageTextArea}>
            <TextInput
              value={s.newMessage}
              onChangeText={text => {
                this.setState({ newMessage: text });
              }}
              placeholder= {this.state.language == "br" ? "Digite aqui sua mensagem" : "Write your message here"}
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
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}
