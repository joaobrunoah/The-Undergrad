import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";

// Icon
import Icon from "react-native-vector-icons/FontAwesome5";

// Api
import System from "../../../../services/api";

// Textos
import { textBr, textUsa } from "../../../../assets/content/mainRoute/categs";

//Styles
import {
  globalStyles,
  colorsGradient,
  startGradient,
  endGradient
} from "../../../globalStyles";
import styles from "./styles";

//Components
import Header from "../../../../assets/components/header";

class Item extends Component {

  state = { coin: '' };

  async componentDidMount() {
    let uniID = this.props.uniID;
    System.getUniData(uniID).then(universityCb => {
      let coin = universityCb.data().coin;
      this.setState({ coin: coin });
    });
  }

  render() {
    let p = this.props.data;
    if(p.pictures && p.pictures.length > 0 && p.pictures[0] !== null && p.pictures[0] !== "") {
      p.pictureThumb =  p.pictures[0].split('%2F');
      const lastElPosition = p.pictureThumb.length-1;
      p.pictureThumb[lastElPosition] = 'thumb_' + p.pictureThumb[lastElPosition];
      p.pictureThumb = p.pictureThumb.join('%2F');
    }

    let nav = this.props.nav;
    return (
      <TouchableOpacity
        onPress={() => {
          nav.navigate("Details", { data: p });
        }}
        activeOpacity={0.7}
        style={styles.itemArea}
      >
        <View
          style={{
            zIndex: 1,
            top: 0,
            position: "absolute",
            height: 35,
            maxHeight: 35,
            paddingHorizontal: 10,
            width: "100%",
            backgroundColor: "#0008",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text
            numberOfLines={1}
            style={[globalStyles.textSemiBold, { color: "#FFF" }]}
          >
            {p.description}
          </Text>
        </View>
        {(p.pictureThumb) ?
          <Image
            source={{ uri: p.pictureThumb }}
            style={{
              zIndex: 0,
              position: "absolute",
              width: "100%",
              height: 110,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              top: 0
            }}
          /> : null
        }
        <View
          style={{
            zIndex: 6,
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
            width: "100%",
            borderTopWidth: 1,
            borderTopColor: "#0003",
            paddingHorizontal: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10
          }}
        >
          <Text style={[globalStyles.textSemiBold, { color: "#0008" }]}>
            {this.state.coin ? this.state.coin : '$'} {Number(p.price).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class Gadgets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textContent: {},
      loading: true,
      itemsForSale: [],
      userInfo: {},
      userUid: "",
      uniID: "",
    };

  }

  async componentDidMount() {
    let s = this.state;
    s.language = await AsyncStorage.getItem("language");
    s.userUid = await AsyncStorage.getItem("userUID");

    if (s.language === "br") {
      s.textContent = textBr;
    } else if (s.language === "usa") {
      s.textContent = textUsa;
    }

    this.setState(s);

    let userInfoObj = await System.getUserInfo(s.userUid);
    s.userInfo = userInfoObj.data();
    let uni = userInfoObj.data().university.split("/", 2);
    s.uniID = uni[1];
    this.setState(s);

    try {
      let categoryObj = await System.getCategories("Gadgets");
      let data = categoryObj.docs;
      for (const doc of data) {
        let id = doc.id;
        let itemsCategObj = await System.getItemsCateg(id);
        itemsCategObj.forEach(doc => {
          let auxUni = doc.data().university.split("/", 3);
          let auxUserUni = s.userInfo.university.split("/", 2);
          if (auxUni[2] === auxUserUni[1]) {
            s.itemsForSale.push(doc.data());
            this.setState(s);
          }
        });
      }
      s.loading = false;
      this.setState(s);
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    let s = this.state;
    return (
      <LinearGradient
        colors={colorsGradient}
        start={startGradient}
        end={endGradient}
        style={globalStyles.screen}
      >
        <SafeAreaView style={styles.container}>
          <Header back={true} />
          <Text
            style={[
              globalStyles.textSemiBold,
              { marginTop: 10, textAlign: "center", fontSize: 16 }
            ]}
          >
            {s.textContent.gadgets}
          </Text>
          {s.loading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ActivityIndicator size="large" color="#0008" />
            </View>
          ) : (
              <FlatList
                ListEmptyComponent={
                  <View
                    style={{
                      flex: 1,
                      height: 400,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon name="surprise" size={50} light color="#0006" />
                    <Text style={globalStyles.textSemiBold}>
                      {s.textContent.emptyList}
                    </Text>
                  </View>
                }
                style={{ marginTop: 20 }}
                data={s.itemsForSale}
                columnWrapperStyle={{ justifyContent: "space-around" }}
                numColumns={2}
                renderItem={({ item }) => (
                  <Item
                    text={s.textContent}
                    data={item}
                    nav={this.props.navigation}
                    uniID={this.state.uniID}
                  />
                )}
                keyExtractor={(item, index) => index}
              />
            )}
        </SafeAreaView>
      </LinearGradient>
    );
  }
}
