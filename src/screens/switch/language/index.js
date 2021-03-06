import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {FluidNavigator, Transition} from 'react-navigation-fluid-transitions';

// Api
import System from '../../../services/api';

//Styles
import {
  globalStyles,
  colorsGradient,
  startGradient,
  endGradient,
} from '../../globalStyles';
import styles from './styles';

//Modal
import Modal from 'react-native-modalbox';

//Texts
import {
  textBrLanguage,
  textUsaLanguage,
} from '../../../assets/content/switch/language';

//Flags
import {usaFlag, brFlag} from '../../../assets/images/flags';

//Images
import {mainLogo} from '../../../assets/images/logo';

//Icon
import Icon from 'react-native-vector-icons/FontAwesome5';

let textBr = textBrLanguage;
let textUsa = textUsaLanguage;

export default class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      language: '',
      textContent: {},
      selectedBrStyle: {},
      selectedUsaStyle: {},
    };

    // System.logOut();
  }

  saveLanguage = async language => {
    let s = this.state;
    let selectedStyle = styles.selectedStyle;

    let isSelected = false;
    if (s.language !== null) {
      isSelected = true;
    }

    let selectedBrStyle = {};
    let textContent = textUsa;
    let selectedUsaStyle = selectedStyle;

    if (language === 'br') {
      selectedUsaStyle = {};
      textContent = textBr;
      selectedBrStyle = selectedStyle;
    }

    this.setState({
      language,
      selectedUsaStyle,
      selectedBrStyle,
      textContent,
      isSelected,
    });
  };

  confirmButton = async () => {
    let s = this.state;
    //Saving at AsyncStorage
    await AsyncStorage.setItem('language', s.language).then(
      //Navegar para outra tela
      this.props.navigation.navigate('Login'),
    );
  };

  changeModal = async () => {
    this.refs.Use.close();
    setTimeout(() => {
      this.refs.Terms.open();
    }, 600);
  };

  showConfirm = () => {
    if (this.state.isSelected) {
      return (
        <View style={styles.buttonsContent}>
          <Text style={globalStyles.textRegular}>
            {this.state.textContent.confirmText}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttons}
              onPress={() => {
                this.confirmButton();
              }}>
              <Text style={[globalStyles.textRegular, styles.textButton]}>
                {this.state.textContent.confirmButton}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return;
    }
  };

  render() {
    let s = this.state;

    return (
      <LinearGradient
        colors={colorsGradient}
        start={startGradient}
        end={endGradient}
        style={globalStyles.screen}>
        <View style={styles.container}>
          {/* Modal Terms*/}
          {/* <Modal
            backButtonClose={true}
            coverScreen={true}
            style={{
              borderRadius: 10,
              padding: 10,
              width: '90%',
              height: '90%',
              justifyContent: 'space-between',
            }}
            swipeToClose={false}
            ref="Terms">
            <View
              style={{
                flex: 0.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.refs.Terms.close();
                }}
                style={{position: 'absolute', right: 0, top: 0}}>
                <Icon name="times" size={18} color="#CCC" solid />
              </TouchableOpacity>
              <Text style={[globalStyles.textSemiBold, {fontSize: 18}]}>
                {s.language === 'br'
                  ? s.textContent.termTitleBR
                  : s.textContent.termTitleUSA}
              </Text>
            </View>

            <ScrollView style={{flex: 0.8}}>
              <Text
                style={[
                  globalStyles.textRegular,
                  {textAlign: 'left', color: '#101010'},
                ]}>
                {s.language === 'br'
                  ? s.textContent.termPriBR
                  : s.textContent.termPriUSA}
              </Text>
            </ScrollView>
            <View
              style={{
                flex: 0.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.refs.Terms.close();
                  this.confirmButton();
                }}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1219',
                }}>
                <Text
                  style={[
                    globalStyles.textRegular,
                    {color: '#FFF', fontSize: 14},
                  ]}>
                  {s.language === 'br'
                    ? s.textContent.continueBR
                    : s.textContent.continueUSA}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal> */}
          {/* Fim Modal */}

          {/* Modal Use */}
          {/* <Modal
            backButtonClose={true}
            coverScreen={true}
            style={{
              borderRadius: 10,
              padding: 10,
              width: '90%',
              height: '90%',
              justifyContent: 'space-between',
            }}
            swipeToClose={false}
            ref="Use">
            <View
              style={{
                flex: 0.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.refs.Use.close();
                }}
                style={{position: 'absolute', right: 0, top: 0}}>
                <Icon name="times" size={18} color="#CCC" solid />
              </TouchableOpacity>
              <Text style={[globalStyles.textSemiBold, {fontSize: 18}]}>
                {s.language === 'br'
                  ? s.textContent.termUseTitleBR
                  : s.textContent.termUseTitleUSA}
              </Text>
            </View>

            <ScrollView style={{flex: 0.8}}>
              <Text
                style={[
                  globalStyles.textRegular,
                  {textAlign: 'left', color: '#101010'},
                ]}>
                {s.language === 'br'
                  ? s.textContent.termUseBR
                  : s.textContent.termUseUSA}
              </Text>
            </ScrollView>
            <View
              style={{
                flex: 0.1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.changeModal()}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1219',
                }}>
                <Text
                  style={[
                    globalStyles.textRegular,
                    {color: '#FFF', fontSize: 14},
                  ]}>
                  {s.language === 'br'
                    ? s.textContent.continueBR
                    : s.textContent.continueUSA}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal> */}
          {/* Fim Modal */}

          <View style={styles.logoContent}>
            <Image style={styles.logo} source={mainLogo} />
            <Text style={[globalStyles.textRegular, styles.mainText]}>
              The Undergrad
            </Text>
          </View>
          <View style={styles.flagContent}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.saveLanguage('br');
              }}>
              <Image style={[styles.img, s.selectedBrStyle]} source={brFlag} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.saveLanguage('usa');
              }}>
              <Image
                style={[styles.img, s.selectedUsaStyle]}
                source={usaFlag}
              />
            </TouchableOpacity>
          </View>
          <View>{this.showConfirm()}</View>
        </View>
      </LinearGradient>
    );
  }
}
