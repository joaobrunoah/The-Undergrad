import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { withNavigation } from "react-navigation";

//Api
import System from "../../../../services/api";

//Icons
import Icon from "react-native-vector-icons/FontAwesome5";

//Styles
import styles from "./styles";

//GlobalStyles
import { globalStyles } from "../../../globalStyles";

export class Message extends Component {
  constructor(props) {
    super(props);
    let p = this.props.data;

    this.state = {
      imageProfile: p.img,
      nome: "",
      uni: "",
      messages: [],
      lastMessage: "",
      unread: p.unreadMessages ? p.unreadMessages : 0,
      uid: this.props.uid,
    };
  }

  messageDetail = () => {
    this.props.navigation.navigate("MessageDetail", { data: this.props.data });
  };

  componentDidMount() {
    let auxID = this.props.data.key;
    let s = this.state;
    System.getUserInfo(auxID).then(r => {
      s.nome = r.data().name;
      s.uni = r.data().email;
      let aux = s.uni.split("@", 2);
      s.uni = aux[1];
      s.imageProfile = r.data().imgProfile;
      this.setState(s);
    });
  }

  componentWillReceiveProps(nextProps){
    let p = nextProps.data;
    this.setState({
      unread: p.unreadMessages ? p.unreadMessages : 0
    });
  }

  render() {
    let s = this.state;

    return (
      <TouchableOpacity
        onPress={this.messageDetail}
        activeOpacity={1}
        style={styles.container}
      >
        <SafeAreaView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {s.imageProfile
            ? <Image
              source={{ uri: s.imageProfile }}
              style={styles.imgProfile}
            />
            : <View style={styles.imgProfile}>
              <Icon name="user" color="#FFF" size={18} solid />
            </View>}

          <View style={{ justifyContent: "flex-start", marginLeft: 20 }}>
            <Text style={[globalStyles.textRegular, styles.name]}>
              {s.nome}
            </Text>
            <Text
              style={[globalStyles.textRegular, styles.msg, { width: 100 }]}
              ellipsizeMode={"tail"}
              numberOfLines={1}
            >
              {this.props.msg}
            </Text>
          </View>
        </SafeAreaView>
        {this.state.unread !== 0 ?
          <View style={styles.unread}>
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "600" }}
            >
              {this.state.unread}
            </Text>
          </View> : null}
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Message);
