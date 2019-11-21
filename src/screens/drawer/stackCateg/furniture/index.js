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
import AsyncStorage from '@react-native-community/async-storage';

import Item from '../../../../assets/components/Item';

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

export default class Funiture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textContent: {},
      loading: true,
      itemsForSale: [],
      userInfo: {},
      userUid: ""
    };

    console.log("Funiture");
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
      this.setState(s);
      console.log(s.userInfo.university);
    });

    System.getCategories("Furniture")
      .then(r => {
        let data = r.docs;
        data.forEach(doc => {
          let id = doc.id;
          System.getItemsCateg(id).then(r => {
            if (r.size == 0) {
              if (s.language === "br") {
                s.textContent = textBr;
              } else if (s.language === "usa") {
                s.textContent = textUsa;
              }
              s.loading = false;
              this.setState(s);
            }
            r.forEach(doc => {
              let auxUni = doc.data().university.split("/", 3);
              let auxUserUni = s.userInfo.university.split("/", 2);
              if (auxUni[2] === auxUserUni[1]) {
                s.itemsForSale.push(doc.data());
                s.loading = false;
                this.setState(s);
              } else {
                s.loading = false;
                this.setState(s);
              }
            });
          });
        });
      })
      .catch(e => {
        console.log(e);
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
            {s.textContent.furniture}
          </Text>
          {s.loading
            ? <View
                style={{
                  flex: 1,
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
                    <Icon name="surprise" size={50} light color="#0006" />
                    <Text style={globalStyles.textSemiBold}>
                      {"\n" + s.textContent.emptyList}
                    </Text>
                  </View>
                }
                style={{ marginTop: 20 }}
                data={s.itemsForSale}
                columnWrapperStyle={{ justifyContent: "space-around" }}
                numColumns={2}
                renderItem={({ item }) =>
                  <Item
                    text={s.textContent}
                    data={item}
                    nav={this.props.navigation}
                  />}
                keyExtractor={(item, index) => index}
              />}
        </SafeAreaView>
      </LinearGradient>
    );
  }
}
