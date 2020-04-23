import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TextInput,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StackActions, NavigationActions} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {FluidNavigator, Transition} from 'react-navigation-fluid-transitions';
import Modal from 'react-native-modalbox';

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

//Images
import {mainLogo} from '../../../assets/images/logo';

//Texts
import {textBr, textUsa} from '../../../assets/content/switch/login';

import {
  textBrLanguage,
  textUsaLanguage,
} from '../../../assets/content/switch/language';

//Icon
import Icon from 'react-native-vector-icons/FontAwesome5';

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pass: '',
      userUID: '',
      active: false,
      textContent: {},
      textContentModal: {},
      language: '',
      hitSlop: {bottom: 20, top: 20, right: 20, left: 20},
      disabled: false,
      opacity: {opacity: 1},
      loading: false,
    };
  }

  async componentWillMount() {
    let language = await AsyncStorage.getItem('language');

    let textContent = textUsa;
    let textContentModal = textUsaLanguage;

    if (language === 'br') {
      textContent = textBr;
      textContentModal = textBrLanguage;
    }
    this.setState({
      textContent,
      textContentModal,
      language,
    });
  }

  signIn = async () => {
    Keyboard.dismiss();
    let s = this.state;
    let loading = true;
    let disabled = true;
    let opacity = {opacity: 0.7};

    this.setState({
      loading,
      disabled,
      opacity,
    });
    let active = false;

    try {
      await System.signOut();
    } catch (err) {
      console.warn(err);
    }

    let hasError = false;

    try {
      if (s.email !== '' && s.pass !== '') {
        await System.login(s.email, s.pass);

        let user = System.getUser();
        await AsyncStorage.setItem('userUID', user.uid);
        let r = await System.getUserInfo(user.uid);
        active = r.data().active;

        if (active) {
          await AsyncStorage.setItem('isOn', 'true');
          await AsyncStorage.setItem('email', s.email);
          await AsyncStorage.setItem('pass', s.pass);
          if (!System.getUser().emailVerified) {
            Alert.alert(s.textContent.titleError, s.textContent.error_3);
            hasError = true;
            await System.signOut();
          } else {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({routeName: 'Home'})],
            });
            this.props.navigation.dispatch(resetAction);
          }
        } else {
          Alert.alert(s.textContent.titleError, s.textContent.error_4);
          hasError = true;
        }
      } else {
        Alert.alert(s.textContent.titleError, s.textContent.error_2);
        hasError = true;
      }
    } catch (err) {
      Alert.alert(s.textContent.titleError, s.textContent.error_1);
      hasError = true;
    }

    if (hasError) {
      let disabled = false;
      let loading = false;
      let opacity = 1;
      this.setState({
        disabled,
        loading,
        opacity,
      });
    }
  };

  changeModal = async () => {
    this.refs.Use.close();
    setTimeout(() => {
      this.refs.Terms.open();
    }, 600);
  };

  forgotPass = () => {
    this.props.navigation.navigate('ForgotPass');
  };

  regs = () => {
    this.props.navigation.navigate('Cadastro');
  };

  goBack = () => {
    this.props.navigation.navigate('Language');
  };

  render() {
    let s = this.state;

    return (
      <DismissKeyboard>
        <LinearGradient
          colors={colorsGradient}
          start={startGradient}
          end={endGradient}
          style={globalStyles.screen}>
          <SafeAreaView>
            <TouchableOpacity onPress={this.goBack} style={styles.goBack}>
              <Icon name="arrow-left" size={24} color="#737373" solid />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Modal Terms*/}
          <Modal
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
                  ? s.textContentModal.termTitleBR
                  : s.textContentModal.termTitleUSA}
              </Text>
            </View>

            <ScrollView style={{flex: 0.8}}>
              <Text
                style={[
                  globalStyles.textRegular,
                  {textAlign: 'left', color: '#101010'},
                ]}>
                {s.language === 'br'
                  ? s.textContentModal.termPriBR
                  : s.textContentModal.termPriUSA}
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
                  this.props.navigation.navigate('Cadastro');
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
                    ? s.textContentModal.continueBR
                    : s.textContentModal.continueUSA}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* Fim Modal */}

          {/* Modal Use */}
          <Modal
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
                  ? s.textContentModal.termUseTitleBR
                  : s.textContentModal.termUseTitleUSA}
              </Text>
            </View>

            <ScrollView style={{flex: 0.8}}>
              <Text
                style={[
                  globalStyles.textRegular,
                  {textAlign: 'left', color: '#101010'},
                ]}>
                {s.language === 'br'
                  ? s.textContentModal.termUseBR
                  : s.textContentModal.termUseUSA}
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
                    ? s.textContentModal.continueBR
                    : s.textContentModal.continueUSA}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* Fim Modal */}

          <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
              enabled
              behavior="position"
              keyboardVerticalOffset={Platform.OS === 'ios' ? 200 : 0}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* <Transition shared="logo"> */}
              <View style={styles.logoContent}>
                <Image style={styles.logo} source={mainLogo} />
                <Text style={[globalStyles.textRegular, styles.mainText]}>
                  The Undergrad
                </Text>
              </View>
              {/* </Transition> */}

              {/* <Transition disappear="left" inline={true} delay={true}> */}
              <View style={styles.inputContent}>
                <TextInput
                  onSubmitEditing={() => this.senhaInput.focus()}
                  style={[styles.inputArea, globalStyles.textRegular]}
                  multiline={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  value={s.email}
                  onChangeText={email => {
                    this.setState({email: email});
                  }}
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                  placeholder={s.textContent.emailInput}
                />
                <TextInput
                  ref={input => (this.senhaInput = input)}
                  style={[styles.inputArea, globalStyles.textRegular]}
                  multiline={false}
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="go"
                  value={s.pass}
                  secureTextEntry={true}
                  onChangeText={pass => {
                    this.setState({pass: pass});
                  }}
                  placeholder={s.textContent.passInput}
                  placeholderTextColor="#999"
                />
              </View>
              {/* </Transition> */}

              {/* <Transition shared="botao1"> */}
              <View style={styles.inputContent}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.buttons, s.buttonRes, s.opacity]}
                  onPress={this.signIn}
                  disabled={s.buttonDisable}>
                  <Text style={[globalStyles.textRegular, styles.textButton]}>
                    {s.loading
                      ? s.textContent.loading
                      : s.textContent.loginButton}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* </Transition> */}
              <TouchableOpacity
                hitSlop={{bottom: 30, top: 0, right: 20, left: 20}}
                activeOpacity={0.7}
                onPress={() => {
                  this.forgotPass;
                  this.props.navigation.navigate('ForgotPass');
                  Keyboard.dismiss();
                }}>
                <Text
                  style={[
                    globalStyles.textRegular,
                    {marginTop: 5, textAlign: 'center'},
                  ]}>
                  {s.textContent.forgotPass}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.refs.Use.open();
                  this.regs;
                  //this.props.navigation.navigate('Cadastro');
                  Keyboard.dismiss();
                }}
                hitSlop={{bottom: 20, top: 20, right: 20, left: 20}}
                style={{marginTop: 30}}>
                <Text
                  style={[
                    globalStyles.textRegular,
                    styles.cadText,
                    {fontSize: 16},
                  ]}>
                  {s.textContent.noCad}
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </DismissKeyboard>
    );
  }
}
