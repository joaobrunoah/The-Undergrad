import React, { Component } from "react";
import {
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  InputAccessoryView,
  StyleSheet,
  Keyboard
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

  async componentDidMount() {
    let s = this.state;
    let languageSelected = await AsyncStorage.getItem("language");

    s.language = languageSelected;

    this.setState({ language: languageSelected });
  }

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
        backgroundColor: "rgb(220,246,199)",
        alignSelf: "flex-end"
      };
    } else {
      s.style = {
        ...style,
        backgroundColor: "rgb(249,249,249)",
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
      newMessage: "",
      language: "",
      height: 0,
      keyboardOffset: 0
    };
  }

  componentDidMount() {
    console.log(this.state.keyboardOffset);
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = (event) => {
    this.setState({keyboardOffset: event.endCoordinates.height});
  }

  _keyboardDidHide = () => {
    this.setState({keyboardOffset: 0});
  }

  async componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    let uid = await AsyncStorage.getItem("userUID");
    let p = this.props.navigation.state.params.data;
    console.log(p.key);
    await this.setState({ uid: uid });
    this.loadMessages();

    let s = this.state;
    let languageSelected = await AsyncStorage.getItem("language");

    s.language = languageSelected;

    this.setState({ language: languageSelected });
    console.log(this.state.language);
  }

  sendMessage = async () => {
    let s = this.state;
    let p = this.props.navigation.state.params.data;
    let hora = `${moment().hour()}:${Number(moment().minute().toFixed(2))}`;

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
        <View style={styles.container}>
          <View
            style={{
              flex:1,
              width: "100%",
              // height: "100%",
              marginBottom: this.state.keyboardOffset == 0 ? this.state.height - 10 : this.state.keyboardOffset - 10,
            }}
            onLayout={() => this.refs.flatList.scrollToEnd()}
          >
            <FlatList
              style={{ paddingTop: 0, paddingBottom: 10 }}
              ref="flatList"
              onContentSizeChange={() => this.refs.flatList.scrollToEnd()}
              data={s.messages}
              renderItem={({ item }) =>
                <Mensagem data={item} user={item.user} />}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <InputAccessoryView
            backgroundColor="#ebebeb"
            
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center"
              }}
              onLayout={event => {
              var { x, y, width, height } = event.nativeEvent.layout;
              this.setState({ height: height });
              console.log(this.state.height)
            }}
            >
              <TextInput
                style={{
                  flex: 1,
                  margin: 10,
                  padding: 10,
                  borderRadius: 100,
                  borderWidth: StyleSheet.hairlineWidth,
                  backgroundColor: "white"
                }}
                placeholder={
                  this.state.language == "br"
                    ? "Digite aqui sua mensagem"
                    : "Write your message here"
                }
                value={s.newMessage}
                onChangeText={text => {
                  this.setState({ newMessage: text });
                }}
              />
              <TouchableOpacity onPress={this.sendMessage}>
                <Icon
                  name="arrow-circle-right"
                  size={30}
                  color="#666"
                  style={{
                    borderRadius: 100,
                    marginVertical: 10,
                    marginRight: 10
                  }}
                />
              </TouchableOpacity>
            </View>
          </InputAccessoryView>
        </View>
      </LinearGradient>
    );
  }
}
