import React, {Component} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modalbox';
import System from '../../../services/api';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import ModalSelect from 'react-native-modal-select-option';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.Blob = Blob;

//Icon
import Icon from 'react-native-vector-icons/FontAwesome5';

//Components
import Header from '../../../assets/components/header';

//Styles
import {
  globalStyles,
  colorsGradient,
  startGradient,
  endGradient,
} from '../../globalStyles';
import styles from './styles';

//TextContent
import {textBr, textUsa} from '../../../assets/content/mainRoute/perfil';

export default class Perfil extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {
        active: false,
        createdAt: '',
        email: '',
        imgProfile: '',
        name: '',
        phone: '',
        rank: 10,
        totalRank: 0,
        sales: 0,
        uid: '',
        university: '',
        universityName: '',
      },
      sales: 0,
      disable: true,
      photo: null,
      stars: 0,
      textContent: {},
      imgLoader: false,
      temp: null,
      imgOptionsShow: false,
    };
  }

  takePicture = async mode => {
    const userUID = await AsyncStorage.getItem('userUID');

    if (mode === 'picker') {
      this.setState({
        userID: userUID,
        loading: true,
        imgLoader: true,
      });

      ImagePicker.openPicker({
        noData: true,
        cropping: true,
        width: 150,
        height: 200,
      })
        .then(async image => {
          console.log(image);

          let uploadResponse = await System.setItemImg(
            userUID,
            'profile',
            image,
            Platform.OS,
          );

          const imgUrl = uploadResponse.downloadURL;

          await System.updateImgProfile(userUID, {imgProfile: imgUrl});

          this.setState({
            photo: {uri: image.path},
            loading: false,
            imgLoader: false,
          });
        })
        .catch(e => {
          this.setState({
            loading: false,
            imgLoader: false,
          });
          console.warn(e);
        });
    } else if (mode == 'camera') {
      this.setState({
        userID: userUID,
        loading: true,
        imgLoader: true,
      });
      ImagePicker.openCamera({
        noData: true,
        cropping: true,
        width: 150,
        height: 200,
      })
        .then(async image => {
          console.log(image);

          let uploadResponse = await System.setItemImg(
            userUID,
            'profile',
            image,
            Platform.OS,
          );

          const imgUrl = uploadResponse.downloadURL;

          await System.updateImgProfile(userUID, {imgProfile: imgUrl});

          this.setState({
            photo: {uri: image.path},
            loading: false,
            imgLoader: false,
          });
        })
        .catch(e => {
          this.setState({
            loading: false,
            imgLoader: false,
          });
          console.warn(e);
        });
    }
  };

  componentWillUnmount() {
    let s = this.state;
    if (s.temp === null) {
      return;
    } else {
      // window.XMLHttpRequest = s.temp;
    }
  }

  async componentDidMount() {
    let s = this.state;
    s.language = await AsyncStorage.getItem('language');
    s.imgLoader = true;
    this.setState(s);

    if (s.language === 'br') {
      s.textContent = textBr;
    } else if (s.language === 'usa') {
      s.textContent = textUsa;
    }

    let userUID = await AsyncStorage.getItem('userUID');

    System.getUserInfo(userUID)
      .then(r => {
        let data = r.data();
        s.userData = data;
        s.stars = s.userData.rank / s.userData.totalRank;
        if (s.userData.imgProfile) {
          let imgUrlArray = s.userData.imgProfile.split('%2F');
          const lastElPosition = imgUrlArray.length - 1;
          imgUrlArray[lastElPosition] = 'thumb_' + imgUrlArray[lastElPosition];
          const imgUrlThumb = imgUrlArray.join('%2F');
          s.photo = {uri: imgUrlThumb};
        } else {
          s.photo = '';
        }
        s.disable = false;
        s.imgLoader = false;
        this.setState(s);
      })
      .catch(e => {
        s.imgLoader = false;
        alert('Impossível carregar dados do usuário!');
      });

    let auxID = `/users/${userUID}`;

    System.getItemsUser(auxID)
      .then(r => {
        let data = r.docs.length;
        s.sales = data;
        this.setState(s);
      })
      .catch(e => {
        console.warn(e);
      });

    this.setState(s);
  }

  render() {
    let s = this.state;

    return (
      <LinearGradient
        colors={colorsGradient}
        start={startGradient}
        end={endGradient}
        style={globalStyles.screen}>
        {/* Modal */}
        <Modal
          ref={'BuyOrSale'}
          position="center"
          animationDuration={450}
          useNativeDriver={true}
          style={styles.modal}
          swipeToClose={true}
          backButtonClose={true}>
          <Text
            style={[
              globalStyles.textBold,
              {fontSize: 18, color: '#737373', marginBottom: 20},
            ]}>
            {s.textContent.phase}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.refs.BuyOrSale.close();
              this.props.navigation.navigate('Search');
            }}
            style={styles.modalButtons}>
            <Text style={[globalStyles.textBold, styles.modalText]}>
              {s.textContent.buy}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.refs.BuyOrSale.close();
              this.props.navigation.navigate('SellScreen');
            }}
            style={[styles.modalButtons, {marginTop: 10}]}>
            <Text style={[globalStyles.textBold, styles.modalText]}>
              {s.textContent.sell}
            </Text>
          </TouchableOpacity>
        </Modal>
        {/* Fim Modal */}
        {/*Modal Select Options*/}
        <Modal
          ref={'imgOptions'}
          position="center"
          animationDuration={0}
          useNativeDriver={false}
          style={styles.modal}
          swipeToClose={true}
          backButtonClose={true}>
          <Text
            style={[
              globalStyles.textBold,
              {fontSize: 18, color: '#737373', marginBottom: 20},
            ]}>
            {s.textContent.imgOptionsTitle}
          </Text>
          <TouchableOpacity
            onPress={async () => {
              this.refs.imgOptions.close();
              this.takePicture('camera');
            }}
            style={styles.ImgOptionsModalButtons}>
            <Text style={[globalStyles.textBold, styles.modalText]}>
              {s.textContent.cameraOption}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.takePicture('picker');
              this.refs.imgOptions.close();
            }}
            style={[styles.ImgOptionsModalButtons, {marginTop: 10}]}>
            <Text style={[globalStyles.textBold, styles.modalText]}>
              {s.textContent.pickerOption}
            </Text>
          </TouchableOpacity>
        </Modal>
        {/*Finish Modal Select Options*/}

        <SafeAreaView style={styles.container}>
          <Header back={true} />
          <View style={styles.stats}>
            <View style={[styles.statsItems, {maxWidth: 75, width: 75}]}>
              <Text style={globalStyles.textBold}>{s.textContent.sales}</Text>
              <Text style={globalStyles.textBold}>
                {s.sales} {s.textContent.items}
              </Text>
            </View>
            <View style={styles.statsItems}>
              <TouchableOpacity
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={() => this.props.navigation.navigate('Settings')}>
                <Icon name="sliders-h" size={24} />
              </TouchableOpacity>
              <View style={styles.giantCircle}>
                <View style={styles.mediumCircle}>
                  <TouchableOpacity
                    disabled={s.disable}
                    onPress={() => {
                      this.refs.imgOptions.open();
                    }}
                    style={styles.userCircle}>
                    {s.imgLoader ? (
                      <View
                        style={{
                          position: 'absolute',
                          zIndex: 10,
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#CCC',
                          opacity: 0.4,
                        }}>
                        <ActivityIndicator size="small" color="#000" />
                      </View>
                    ) : null}
                    {s.photo === '' ? (
                      <Icon name="user" size={30} color="#737373" />
                    ) : (
                      <Image
                        style={styles.userCircle}
                        source={s.photo}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={[styles.statsItems, {maxWidth: 75, width: 75}]}>
              <Text style={globalStyles.textBold}>{s.textContent.stars}</Text>
              <Text style={globalStyles.textBold}>
                {s.stars > 0 ? s.stars : 0}
              </Text>
            </View>
          </View>
          <View style={{flex: 0.4}}>
            <Text
              style={[
                globalStyles.textBold,
                {fontSize: 16, width: '100%', textAlign: 'center'},
              ]}>
              {s.userData.name === '' ? s.textContent.name : s.userData.name}
            </Text>
            <TouchableOpacity
              style={styles.itemsForSale}
              onPress={() => this.props.navigation.navigate('ItemsForSale')}>
              <Text style={[globalStyles.textBold, {fontSize: 16}]}>
                {s.textContent.itemsFor}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.lookingFor}>
            <Icon name="map-marker-alt" size={40} />
            <Text
              style={[globalStyles.textBold, {marginTop: 10, fontSize: 14}]}>
              {s.userData.universityName === ''
                ? s.textContent.name
                : s.userData.universityName}
            </Text>
            <TouchableOpacity
              style={styles.lookingForButton}
              onPress={() => this.refs.BuyOrSale.open()}>
              <Text
                style={[globalStyles.textBold, {color: '#FFF', fontSize: 22}]}>
                {s.textContent.looking}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}
