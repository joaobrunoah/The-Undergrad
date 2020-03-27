import React, { Component } from "react";
import {
  Image,
  Alert,
  ActivityIndicator,
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform, SafeAreaView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";

// Api
import System from "../../../services/api";

// Modal
import Modal from "react-native-modalbox";

//Components
import Header from "../../../assets/components/header";

//TextContent
import { textBr, textUsa } from "../../../assets/content/drawer/sellScreen";

//Styles
import {
  globalStyles,
  colorsGradient,
  startGradient,
  endGradient
} from "../../globalStyles";
import styles from "./styles";

export default class SellScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      language: "",
      textContent: {},
      userID: "",
      categ: "",
      sellInfo: {
        category: "",
        categoryRef: "",
        createdAt: "",
        description: "",
        pictures: [],
        price: "",
        rank: "",
        university: "",
        user: "",
        userId: ""
      },
      loading: false,
      loadingImg: false,
      photo: null,
      temp: null
    };
  }

  takePhoto = async () => {

    const userUID = await AsyncStorage.getItem("userUID");

    this.setState({
      userID: userUID,
      loadingImg: true
    });

    ImagePicker.showImagePicker({noData: true}, async (r) => {

      if(r.didCancel || r.error) {
        if(r.error)
          Alert.alert(
            this.state.textContent.warning,
            this.state.textContent.msgError + ': ' + r.error
          );
        this.setState({loadingImg : false});
        return;
      }

      try {
        let uploadResponse = await System.setItemImg(userUID, 'offers', r, Platform.OS);

        const imgUrl = uploadResponse.downloadURL;

        let sellInfo = this.state.sellInfo;

        sellInfo.pictures = [imgUrl];
        this.setState({
          sellInfo: sellInfo,
          photo: {uri: r.uri},
          loadingImg: false
        });
      } catch (err) {
        Alert.alert(this.state.textContent.warning, this.state.textContent.msgError + ': ' + err.message);
        this.setState({loadingImg : false});
        return;
      }

    });
  };

  componentWillUnmount() {
    //window.XMLHttpRequest = this.state.temp;
  }

  async componentDidMount() {
    let s = this.state;
    let date = moment().format("LLL");
    s.language = await AsyncStorage.getItem("language");
    s.userID = await AsyncStorage.getItem("userUID");

    if (s.language === "br") {
      s.textContent = textBr;
      s.categ = "Categoria";
    } else if (s.language === "usa") {
      s.textContent = textUsa;
      s.categ = "Category";
    }

    System.getUserInfo(s.userID)
      .then(r => {
        s.sellInfo.createdAt = date;
        s.sellInfo.pictures = [""];
        s.sellInfo.rank = 0;
        s.sellInfo.university = `/${r.data().university}`;
        s.sellInfo.user = `/users/${s.userID}`;
        s.sellInfo.userId = s.userID;
      })
      .catch(e => {
        console.warn(e);
      });

    this.setState(s);
  }

  upOffer = () => {
    let s = this.state;
    s.loading = true;
    s.sellInfo.price = s.sellInfo.price.replace(",", ".");

    this.setState(s);

    let data = s.sellInfo;

    if (s.sellInfo.description !== "") {
      if (s.categ !== "Categoria" && s.categ !== "Category") {
        if (!isNaN(s.sellInfo.price)) {
          System.registerItem(data)
            .then(r => {
              Alert.alert(s.textContent.warning, s.textContent.msgWarning);
              this.props.navigation.navigate("Dashboard");
            })
            .catch(e => {
              Alert.alert(s.textContent.warning, s.textContent.msgError);
              this.props.navigation.navigate("Dashboard");
              console.warn(e);
            });
        } else {
          Alert.alert(s.textContent.warning, s.textContent.msgError_4);
          s.loading = false;
          this.setState(s);
        }
      } else {
        Alert.alert(s.textContent.warning, s.textContent.msgError_2);
        s.loading = false;
        this.setState(s);
      }
    } else {
      Alert.alert(s.textContent.warning, s.textContent.msgError_3);
      s.loading = false;
      this.setState(s);
    }
  };

  render() {

    return (
      <>
        <SafeAreaView style={{flex: 0, backgroundColor: '#ecf0f1'}}/>
        <SafeAreaView style={[styles.container,{backgroundColor: '#bdc3c7'}]}>
          <LinearGradient
            colors={colorsGradient}
            start={startGradient}
            end={endGradient}
            style={globalStyles.screen}
          >
            {/* Modal */}
            <Modal
              swipeToClose={true}
              backButtonClose={true}
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                width: "50%",
                height: "25%",
                borderRadius: 10,
                padding: 10
              }}
              ref="Categ"
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  let oldData = this.state.sellInfo;
                  this.setState({
                    categ: this.state.language === "br" ? "Tecnologia" : "Gadgets",
                    sellInfo: {
                      ...oldData,
                      category: "8PY3ZBsMlNIwhYtEwgGH",
                      categoryRef: `/categories/8PY3ZBsMlNIwhYtEwgGH`
                    }
                  });
                  this.refs.Categ.close();
                }}
              >
                <Text
                  style={[
                    globalStyles.textSemiBold,
                    { marginVertical: 10, fontSize: 16 }
                  ]}
                >
                  {this.state.textContent.gadgets}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  let oldData = this.state.sellInfo;
                  this.setState({
                    categ: this.state.language === "br" ? "Livros" : "Books",
                    sellInfo: {
                      ...oldData,
                      category: "N3iUL6ynRStM5GIHpOvm",
                      categoryRef: `/categories/N3iUL6ynRStM5GIHpOvm`
                    }
                  });
                  this.refs.Categ.close();
                }}
              >
                <Text
                  style={[
                    globalStyles.textSemiBold,
                    { marginVertical: 10, fontSize: 16 }
                  ]}
                >
                  {this.state.textContent.books}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  let oldData = this.state.sellInfo;
                  this.setState({
                    categ: this.state.language === "br" ? "Roupas" : "Clothing",
                    sellInfo: {
                      ...oldData,
                      category: "cKZwtt8QrAEY3xwcWUJl",
                      categoryRef: `/categories/cKZwtt8QrAEY3xwcWUJl`
                    }
                  });
                  this.refs.Categ.close();
                }}
              >
                <Text
                  style={[
                    globalStyles.textSemiBold,
                    { marginVertical: 10, fontSize: 16 }
                  ]}
                >
                  {this.state.textContent.clothing}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  let oldData = this.state.sellInfo;
                  this.setState({
                    categ: this.state.language === "br" ? "Móveis" : "Furniture",
                    sellInfo: {
                      ...oldData,
                      category: "pafcKINwS2mP1AVVu49T",
                      categoryRef: `/categories/pafcKINwS2mP1AVVu49T`
                    }
                  });
                  this.refs.Categ.close();
                }}
              >
                <Text
                  style={[
                    globalStyles.textSemiBold,
                    { marginVertical: 10, fontSize: 16 }
                  ]}
                >
                  {this.state.textContent.furniture}
                </Text>
              </TouchableOpacity>
            </Modal>
            {/* Fim Modal */}
            <ScrollView style={styles.container}>
              <Header back={true} />
              <TouchableOpacity onPress={this.takePhoto} style={styles.uploadArea}>
                {this.state.loadingImg ? (
                  <View
                    style={{
                      backgroundColor: "#FFF4",
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <ActivityIndicator size="large" color="#FFF" />
                  </View>
                ) : this.state.photo === null ? (
                  <Text style={[globalStyles.textSemiBold, styles.uploadText]}>
                    {this.state.textContent.upImg}
                  </Text>
                ) : (
                  <Image
                    source={this.state.photo}
                    style={{ height: "100%", width: "100%" }}
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
              <TextInput
                multiline={false}
                maxLength={80}
                value={this.state.sellInfo.description}
                onChangeText={text => {
                  let oldData = this.state.sellInfo;
                  this.setState({ sellInfo: { ...oldData, description: text } });
                }}
                style={[globalStyles.textRegular, styles.description]}
                placeholder={this.state.textContent.description}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.refs.Categ.open();
                }}
                style={[styles.description, { justifyContent: "center" }]}
              >
                <Text style={[globalStyles.textRegular]}>{this.state.categ}</Text>
              </TouchableOpacity>
              <TextInput
                multiline={false}
                maxLength={150}
                value={this.state.sellInfo.price}
                onChangeText={text => {

                  if(isNaN(text)) {
                    return;
                  }

                  let oldData = this.state.sellInfo;
                  this.setState({
                    sellInfo: { ...oldData, price: text }
                  });
                }}
                keyboardType="decimal-pad"
                style={[
                  globalStyles.textRegular,
                  styles.description,
                  {
                    width: "30%",
                    textAlign: "center"
                  }
                ]}
                placeholder={this.state.textContent.price}
              />
              <TouchableOpacity
                disabled={this.state.loadingImg ? false : this.state.loading}
                activeOpacity={0.7}
                onPress={this.upOffer}
                style={styles.uploadOfferButton}
              >
                {this.state.loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                    <Text style={[globalStyles.textSemiBold, styles.uploadOffer]}>
                      {this.state.textContent.upOffer}
                    </Text>
                  )}
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </SafeAreaView>
      </>
    );
  }
}
