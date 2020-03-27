import React, {Component} from "react";
import {TouchableHighlight, TouchableOpacity, Image, View, Text, ScrollView, SafeAreaView, BackHandler} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import ImageView from "react-native-image-viewing";

// Api
import System from "../../../../services/api";

// Icon
import Icon from "react-native-vector-icons/FontAwesome5";

// Textos
import {textBr, textUsa} from "../../../../assets/content/mainRoute/categs";

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

export default class Details extends Component {
  constructor(props) {
    super(props);

    let p = this.props.navigation.state.params.data;

    this.state = {
      data: p,
      photo: "",
      textContent: {},
      userInfo: {},
      sales: 0,
      sellerUID: "",
      uniID: "",
      coin: "",
      isImageModalVisible: false
    };
  }

  async componentDidMount() {
    let s = this.state;
    s.language = await AsyncStorage.getItem("language");

    if (s.language === "br") {
      s.textContent = textBr;
    } else if (s.language === "usa") {
      s.textContent = textUsa;
    }

    this.setState(s);

    let uid = s.data.user.split("/", 3);

    System.getUserInfo(uid[2])
      .then(r => {
        s.userInfo = r.data();
        s.sellerUID = uid[2];
        if (s.userInfo.imgProfile) {
          let imgUrlArray = s.userInfo.imgProfile.split('%2F');
          const lastElPosition = imgUrlArray.length - 1;
          imgUrlArray[lastElPosition] = 'thumb_' + imgUrlArray[lastElPosition];
          const imgUrlThumb = imgUrlArray.join('%2F');
          s.photo = {uri: imgUrlThumb};
        } else {
          s.photo = "";
        }

        let uni = s.userInfo.university.split("/", 2);
        s.uniID = uni[1];

        this.setState(s);

        System.getUniData(s.uniID).then(universityCb => {
          let coin = universityCb.data().coin;
          this.setState({coin: coin});
        });
      })
      .catch(e => {
        console.warn(e);
      });

    let auxID = `/users/${uid[2]}`;

    System.getItemsUser(auxID)
      .then(r => {
        let data = r.docs.length;
        s.sales = data;
        this.setState(s);
      })
      .catch(e => {
        console.warn(e);
      });

    BackHandler.removeEventListener('hardwareBackPress', () => {});
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
    });
  }

  setImageModalVisibility(imageModalVisibility) {
    this.setState({
      isImageModalVisible: imageModalVisibility
    })
  }

  render() {
    let s = this.state;
    let pictureThumb = null;
    let picturesModal = [];
    if (s.data.pictures && s.data.pictures.length > 0 && s.data.pictures[0] !== null && s.data.pictures[0] !== "") {
      let pictureArray = s.data.pictures[0].split('%2F');
      const lastElPosition = pictureArray.length - 1;
      pictureArray[lastElPosition] = 'thumb_' + pictureArray[lastElPosition];
      //pictureThumb = pictureArray.join('%2F');
      pictureThumb = s.data.pictures[0];
      picturesModal = s.data.pictures.map(obj => {
        return {
          uri: obj
        }
      })
    }

    return (
      <SafeAreaView style={styles.container}>
        <ImageView
          images={picturesModal}
          imageIndex={0}
          visible={this.state.isImageModalVisible}
          onRequestClose={() => {
            this.setImageModalVisibility(false);
          }}
          presentationStyle={'overFullScreen'}
        />
        <LinearGradient
          colors={colorsGradient}
          start={startGradient}
          end={endGradient}
          style={globalStyles.screen}
        >
          <View style={styles.container}>
            <Header back={true}/>
            <ScrollView style={{flex: 1}}>
              <View style={{alignItems: "center"}}>
                <TouchableHighlight
                  style={{
                    marginTop: 10,
                    width: "90%",
                    height: 200,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: "#0006",
                    backgroundColor: "#FFF",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => {
                    this.setImageModalVisibility(true);
                  }}
                >
                  <Image
                    style={{width: "100%", height: "100%", borderRadius: 10}}
                    source={{uri: pictureThumb}}
                  />
                </TouchableHighlight>
                <View style={{marginTop: 10}}>
                  <Text
                    style={[
                      globalStyles.textBold,
                      {paddingHorizontal: 20, fontSize: 18, textAlign: "center"}
                    ]}
                  >
                    {s.data.description}
                  </Text>
                </View>
                <View style={{alignItems: "center"}}>
                  <Text style={globalStyles.textBold}>
                    {s.textContent.price} {this.state.coin ? this.state.coin : '$'} {Number(s.data.price).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.stats}>
                  <View style={[styles.statsItems, {maxWidth: 75, width: 75}]}>
                    <Text style={globalStyles.textBold}>
                      {s.textContent.sales}
                    </Text>
                    <Text style={globalStyles.textBold}>{s.sales}</Text>
                  </View>
                  <View style={styles.statsItems}>
                    <View style={styles.giantCircle}>
                      <View style={styles.mediumCircle}>
                        {s.photo === "" ? (
                          <Icon name="user" size={30} color="#737373" solid/>
                        ) : (
                          <Image
                            style={{width: 100, height: 100, borderRadius: 50}}
                            source={s.photo}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={[styles.statsItems, {maxWidth: 75, width: 75}]}>
                    <Text style={globalStyles.textBold}>
                      {s.textContent.star}
                    </Text>
                    <Text style={globalStyles.textBold}>{s.userInfo.rank}</Text>
                  </View>
                </View>
                <Text style={[globalStyles.textBold, {fontSize: 16, textAlign: 'center', width: '100%'}]}>
                  {s.userInfo.name}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    this.props.navigation.navigate("MessageDetail", {
                      data: {key: s.sellerUID},
                      data2: s.data
                    });
                  }}
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0008",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 10
                  }}
                >
                  <Text
                    style={[
                      globalStyles.textSemiBold,
                      {color: "#FFF", fontSize: 16}
                    ]}
                  >
                    {s.textContent.message}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
}
