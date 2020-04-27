import firebase from './firebaseConnection';
import AsyncStorage from '@react-native-community/async-storage';

const firebaseAppAuth = firebase.auth();
const firebaseAppFirestore = firebase.firestore();
const firebaseAppDatabase = firebase.database();

class System {
  static conversas = [];
  static isWatcherRunning = false;
  static messagesCb = {};
  static user = null;
  static userId = null;

  // Função para deslogar do sistema
  async logOut() {
    System.isWatcherRunning = false;
    System.messagesCb = {};
    System.conversas = [];
    firebaseAppDatabase
      .ref('chats')
      .child(System.userId)
      .off('value');
    await AsyncStorage.clear();
    try {
      await firebase.iid().deleteToken();
    } catch (err) {
      console.warn(err);
    }
    await firebaseAppAuth.signOut();
  }

  async signOut() {
    await firebaseAppAuth.signOut();
    let language = await AsyncStorage.getItem('language');
    await AsyncStorage.clear();
    await AsyncStorage.setItem('language', language);
  }

  // Verificar se existe um usuário logado
  async addAuthListener(callback) {
    await firebaseAppAuth.onAuthStateChanged(callback);
  }

  async isSignedIn() {
    try {
      let token = await AsyncStorage.getItem('email');
      return token !== null ? true : false;
    } catch (e) {
      console.warn(e);
    }
  }

  // Login
  async login(email, pass) {
    return await firebaseAppAuth.signInWithEmailAndPassword(email, pass);
  }

  // Register
  async register(email, pass) {
    return await firebaseAppAuth.createUserWithEmailAndPassword(email, pass);
  }

  // Esqueci a senha
  async forgotPass(email) {
    try {
      return await firebaseAppAuth.sendPasswordResetEmail(email);
    } catch (e) {
      console.warn(e);
    }
  }

  // Registrar no Firestore
  async registerOnFirestore(uid, data) {
    let fcmToken = null;

    try {
      fcmToken = await firebase.messaging().getToken();
    } catch (err) {
      console.warn(err);
    }

    try {
      if (fcmToken) data.fcmToken = fcmToken;
      await firebaseAppFirestore
        .collection('users')
        .doc(uid)
        .set(data);
    } catch (e) {
      console.warn(e);
    }
  }

  // Verifica se a Universidade está cadastrada
  async checkUni(domain) {
    try {
      return await firebase
        .firestore()
        .collection('universities')
        .where('domain', '==', domain)
        .get();
    } catch (e) {
      console.warn(e);
    }
  }

  // Busca os dados da Universidade passada por parâmetro
  async getUniData(uniID) {
    try {
      return await firebase
        .firestore()
        .collection('universities')
        .doc(uniID)
        .get();
    } catch (e) {
      console.warn(e);
    }
  }

  // Busca os dados de cadastro do User no Firestore
  async getUserInfo(userUID) {
    let userObj = null;

    try {
      userObj = await firebaseAppFirestore
        .collection('users')
        .doc(userUID)
        .get();
    } catch (e) {
      console.warn(e);
    }

    let curUserUID = await AsyncStorage.getItem('userUID');

    if (userUID === curUserUID) {
      let fcmToken = null;

      try {
        fcmToken = await firebase.messaging().getToken();
      } catch (err) {
        console.warn(err);
      }

      let userObjData = userObj && userObj.data ? userObj.data() : undefined;

      if (
        userObjData &&
        (!userObjData.fcmToken || userObjData.fcmToken !== fcmToken)
      ) {
        userObjData.fcmToken = fcmToken;
        try {
          await firebaseAppFirestore
            .collection('users')
            .doc(userObjData.uid)
            .set(userObjData);
        } catch (err) {
          console.warn(err);
        }
      }
    }

    return userObj;
  }

  // Setar a pasta imgs e a offers com a imagem tento o mesmo nome do UID do User
  async setItemImg(userUID, type, imagePickerResponse, platformOS) {

    const getFileLocalPath = response => {
      const {path, uri} = response;
      return path ? path : uri;
    };

    const createStorageReferenceToFile = response => {
      const {fileName} = response;
      return firebase.storage().ref(`imgs/${type}/${userUID}/${fileName}`);
    };

    try {
      const fileSource = getFileLocalPath(imagePickerResponse);
      const storageRef = createStorageReferenceToFile(imagePickerResponse);
      return storageRef.putFile(fileSource);
    } catch (e) {
      console.warn(e);
    }
  }

  // Pegar URL da Foto de Perfil
  async updateImgProfile(userUID, img) {
    try {
      await firebaseAppFirestore
        .collection('users')
        .doc(userUID)
        .update(img);
    } catch (e) {
      console.warn(e);
    }
  }

  // Busca os dados dos ADS
  async getADS(university) {
    let adsObj = null;

    try {
      adsObj = await firebase
        .firestore()
        .collection('ads')
        .where('university', '==', university)
        .get();
    } catch (e) {
      console.warn(e);
    }

    return adsObj;
  }

  // Busca as categorias cadastradas
  async getCategories(categ) {
    try {
      return await firebase
        .firestore()
        .collection('categories')
        .where('description.en', '==', categ)
        .get();
    } catch (e) {
      console.warn(e);
    }
  }

  // Busca os itens da categoria desejada
  async getItemsCateg(categID) {
    try {
      return await firebase
        .firestore()
        .collection('offers')
        .where('category', '==', categID)
        .get();
    } catch (e) {
      console.warn(e);
    }
  }

  // Busca as itens cadastrados
  async getSearchItem(item) {
    try {
      return await firebase
        .firestore()
        .collection('offers')
        // .where("description", "==", item)
        .get();
    } catch (e) {
      console.warn(e);
    }
  }

  async getEveryItem() {
    try {
      return await firebaseAppFirestore.collection('offers').get();
    } catch (e) {
      console.warn(e);
    }
  }

  // Registrar oferta no Firestore
  async registerItem(data) {
    try {
      await firebaseAppFirestore
        .collection('offers')
        .doc()
        .set(data);
    } catch (e) {
      console.warn(e);
    }
  }

  // Busca todos os itens do usuario
  async getItemsUser(userId) {
    try {
      return await firebase
        .firestore()
        .collection('offers')
        .where('user', '==', userId)
        .get();
    } catch (e) {
      console.warn(e);
    }
  }

  // Deleta um item do usuário
  async deleteItemsUser(itemId) {
    try {
      await firebaseAppFirestore
        .collection('offers')
        .doc(itemId)
        .delete();
    } catch (e) {
      console.warn(e);
    }
  }

  watchMessages(uid) {
    if (!System.isWatcherRunning) {
      System.isWatcherRunning = true;
      System.userId = uid;
      firebaseAppDatabase
        .ref('chats')
        .child(System.userId)
        .on('value', r => {
          System.conversas = r;
          for (let prop in System.messagesCb) {
            if (System.messagesCb.hasOwnProperty(prop)) {
              System.messagesCb[prop](r);
            }
          }
        });
    }
  }

  //Verifica atualizações do Chat
  getListaConversas(uid, callback, callbackName) {
    if (callbackName) {
      System.messagesCb[callbackName] = callback;
    }

    this.watchMessages(uid);

    if (System.conversas) {
      callback(System.conversas);
    }
  }

  //Verifica atualizações do Chat
  removeListaConversas(callbackName) {
    if (callbackName) {
      System.messagesCb[callbackName] = () => {};
    }
  }

  // Envia mensagem
  async sendMessage(uid, sentUid, data) {
    try {
      await firebaseAppDatabase
        .ref('chats')
        .child(uid)
        .child(sentUid)
        .child('messages')
        .push()
        .set(data);
    } catch (e) {
      console.warn(e);
    }
  }

  async deleteMessages(uid, sentUid) {
    try {
      await firebaseAppDatabase
        .ref('chats')
        .child(uid)
        .child(sentUid)
        .child('messages')
        .set(null);
    } catch (e) {
      console.warn(e);
    }
  }

  async setUnread(uid, sentUid, is_reading = false) {
    try {
      await firebaseAppDatabase
        .ref(`chats/${uid}/${sentUid}`)
        .once('value', async value => {
          await firebaseAppDatabase
            .ref(`chats/${uid}/${sentUid}`)
            .update({
              unreadMessages: is_reading ? 0 : value.val().unreadMessages + 1,
            });
        });
    } catch (e) {
      console.warn(e);
    }
  }

  async AsyncStorageContent() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          return true;
        });
      });
    });
  }

  getUser() {
    return System.user;
  }
}

firebaseAppAuth.onAuthStateChanged(async user => {
  if (user) {
    System.user = user;
  }
});

export default new System();
