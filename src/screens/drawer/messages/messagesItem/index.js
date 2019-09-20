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
      uni: ""
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
      console.log(r.data());
    });
  }

  render() {
    let s = this.state;

    return (
      <TouchableOpacity
        onPress={this.messageDetail}
        activeOpacity={0.7}
        style={styles.container}
      >
        <SafeAreaView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {s.imageProfile ? (
            <Image source={{ uri: s.imageProfile }} style={styles.imgProfile} />
          ) : (
            <View style={styles.imgProfile}>
              <Icon name="user" color="#FFF" size={18} solid />
            </View>
          )}

          <View style={{ justifyContent: "flex-start", marginLeft: 20 }}>
            <Text style={[globalStyles.textRegular, styles.name]}>
              {s.nome}
            </Text>
            <Text style={[globalStyles.textRegular, styles.msg]}>{s.uni}</Text>
          </View>
        </SafeAreaView>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Message);
