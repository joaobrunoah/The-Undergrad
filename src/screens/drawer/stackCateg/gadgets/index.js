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

  state = { coin: '' }

  async componentDidMount() {
    console.log(this.props.data);
    let uniID = this.props.uniID;
    System.getUniData(uniID).then(universityCb => {
      let coin = universityCb.data().coin;
      this.setState({ coin: coin });
    });
  }

  render() {
    let p = this.props.data;
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
        <Image
          source={{ uri: p.pictures[0] }}
          style={{
            zIndex: 0,
            position: "absolute",
            width: "100%",
            height: 110,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            top: 0
          }}
        />
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
            {this.props.text.price} {this.state.coin ? this.state.coin : '$'} {Number(p.price).toFixed(2)}
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

    System.getUserInfo(s.userUid).then(r => {
      s.userInfo = r.data();
      let uni = r.data().university.split("/", 2);
      s.uniID = uni[1];
      this.setState(s);
    });

    System.getCategories("Gadgets")
      .then(r => {
        let data = r.docs;
        data.forEach(doc => {
          let id = doc.id;
          System.getItemsCateg(id).then(r => {
            r.forEach(doc => {
              let auxUni = doc.data().university.split("/", 3);
              let auxUserUni = s.userInfo.university.split("/", 2);
              if (auxUni[2] === auxUserUni[1]) {
                s.itemsForSale.push(doc.data());
                this.setState(s);
              } else {
                return;
              }
            });
          });
        });
        s.loading = false;
        this.setState(s);
      })
      .catch(e => {
        console.warn(e);
      });
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
