import React, {Component} from 'react';
import {
  Alert,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StackActions, NavigationActions} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

// Api
import System from '../../../services/api';

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
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

class Item extends Component {
  state = {coin: ''};

  async componentDidMount() {
    let uniID = this.props.uniID;
    let coin = '$';

    try {
      let universityCb = await System.getUniData(uniID);
      coin = universityCb.data().coin;
    } catch (err) {
      console.warn(err);
    }

    let language = await AsyncStorage.getItem('language');
    let userUid = await AsyncStorage.getItem('userUID');

    let textContent = textUsa;

    if (language === 'br') {
      textContent = textBr;
    }

    this.setState({
      language,
      userUid,
      textContent,
      coin
    });
  }

  delete = async () => {

    let p = this.props.data;
    let s = this.state;

    try {
      await System.deleteItemsUser(p.idItem);

      Alert.alert(
        s.textContent.alertTitle,
        s.textContent.alertDeleted,
      );

      if(this.props.deleteCallback) {
        this.props.deleteCallback();
      }

    } catch (err) {
      console.warn(err);
      Alert.alert(s.textContent.alertTitle, s.textContent.alertUnsuc);
    }
  };

  render() {
    let s = this.state;
    let p = this.props.data;
    if (
      p.pictures &&
      p.pictures.length > 0 &&
      p.pictures[0] !== null &&
      p.pictures[0] !== ''
    ) {
      p.pictureThumb = p.pictures[0].split('%2F');
      const lastElPosition = p.pictureThumb.length - 1;
      p.pictureThumb[lastElPosition] =
        'thumb_' + p.pictureThumb[lastElPosition];
      p.pictureThumb = p.pictureThumb.join('%2F');
    }

    return (
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            s.textContent.alertTitle,
            s.textContent.alertDesc,
            [
              {
                text: s.textContent.alertCancel,
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: s.textContent.alertConfirm,
                onPress: () => this.delete(),
              },
            ],
            {cancelable: false},
          );
        }}
        activeOpacity={0.7}
        style={styles.itemArea}>
        <View
          style={{
            zIndex: 1,
            top: 0,
            position: 'absolute',
            height: 35,
            maxHeight: 35,
            paddingHorizontal: 10,
            width: '100%',
            backgroundColor: '#0008',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={[globalStyles.textSemiBold, {color: '#FFF'}]}>
            {p.description}
          </Text>
        </View>
        {p.pictureThumb ? (
          <Image
            source={{uri: p.pictureThumb}}
            style={{
              zIndex: 0,
              position: 'absolute',
              width: '100%',
              height: 110,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              top: 0,
            }}
          />
        ) : null}
        <View
          style={{
            zIndex: 6,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
            width: '100%',
            borderTopWidth: 1,
            borderTopColor: '#0003',
            paddingHorizontal: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Text style={[globalStyles.textSemiBold, {color: '#0008'}]}>
            {this.props.text.price} {this.state.coin ? this.state.coin : '$'}{' '}
            {Number(p.price).toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class ItemsForSale extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textContent: {},
      loading: true,
      itemsForSale: [],
      userInfo: {},
      userUid: '',
    };
  }

  async componentDidMount() {

    const language = await AsyncStorage.getItem('language');
    const userUid = await AsyncStorage.getItem('userUID');

    let textContent = textUsa;

    if (language === 'br') {
      textContent = textBr;
    }

    this.setState({
      language,
      userUid,
      textContent
    });

    System.getUserInfo(userUid).then(r => {
      const userInfo = r.data();
      this.setState({
        userInfo
      });
    });

    console.log('here1');

    await this.loadItems();
  }

  async loadItems() {
    let auxID = `/users/${this.state.userUid}`;

    try {
      let r = await System.getItemsUser(auxID);
      let data = r.docs;
      let itemsForSale = [];
      data.forEach(doc => {
        let item = doc.data();
        item.idItem = doc.id;
        itemsForSale.push(item);
      });
      itemsForSale.push({is_sell_button: true});
      const loading = false;
      this.setState({
        itemsForSale,
        loading
      });
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    let s = this.state;

    return (
      <>
        <SafeAreaView style={{flex: 0, backgroundColor: '#ecf0f1'}} />
        <SafeAreaView style={[styles.container, {backgroundColor: '#bdc3c7'}]}>
          <LinearGradient
            colors={colorsGradient}
            start={startGradient}
            end={endGradient}
            style={globalStyles.screen}>
            {/* Modal */}

            {/* Fim Modal */}
            <View style={styles.container}>
              <Header back={true} />
              <Text
                style={[
                  globalStyles.textBold,
                  {fontSize: 20, marginVertical: 10, textAlign: 'center'},
                ]}>
                {s.textContent.yourItemsFor}
              </Text>
              <View style={styles.separator} />
              {s.loading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size="large" color="#0008" />
                </View>
              ) : (
                <FlatList
                  ListEmptyComponent={
                    <View
                      style={{
                        flex: 1,
                        height: 400,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon name="surprise" size={50} light color="#0006" />
                      <Text style={globalStyles.textSemiBold}>
                        {s.textContent.emptyList}
                      </Text>
                    </View>
                  }
                  style={{marginTop: 20}}
                  data={s.itemsForSale}
                  columnWrapperStyle={{justifyContent: 'space-around'}}
                  numColumns={2}
                  renderItem={({item}) => {
                    let result;
                    if (item.is_sell_button) {
                      result = (
                        <TouchableOpacity
                          style={{
                            height: 140,
                            maxHeight: 140,
                            width: '45%',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            borderRadius: 10,
                            marginBottom: 20,
                            backgroundColor: '#0008',
                          }}
                          onPress={()=>{
                            this.props.navigation.navigate('SellScreen');
                          }}
                          opacity={0.7}>
                          <View>
                            <FontAwesome5Icon
                              name={'plus'}
                              size={40}
                              color={'white'}
                            />
                          </View>
                          <Text
                            style={{
                              paddingTop: 10,
                              color: 'white',
                              fontSize: 16,
                              fontWeight: 'bold',
                            }}>
                            {s.textContent.addItem}
                          </Text>
                        </TouchableOpacity>
                      );
                    } else {
                      result = (
                        <Item
                          text={s.textContent}
                          data={item}
                          nav={this.props.navigation}
                          deleteCallback={this.loadItems.bind(this)}
                        />
                      );
                    }
                    return result;
                  }}
                  keyExtractor={(item, index) => index}
                />
              )}
            </View>
          </LinearGradient>
        </SafeAreaView>
      </>
    );
  }
}
