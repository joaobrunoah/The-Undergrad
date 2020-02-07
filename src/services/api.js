import firebase from "./firebaseConnection";
import "firebase/firestore";
import AsyncStorage from "@react-native-community/async-storage";

class System {
  // Função para deslogar do sistema
  async logOut() {
    await firebase.auth().signOut();
    // await AsyncStorage.multiRemove(["email", "pass", "userUID"]);
    await AsyncStorage.clear();
  }

  // Verificar se existe um usuário logado
  async addAuthListener(callback) {
    try {
      await firebase.auth().onAuthStateChanged(callback);
    } catch (e) {
      console.warn(e)
    }
  }

  async isSignedIn() {
    try {
      let token = await AsyncStorage.getItem("email");
      return token !== null ? true : false;
    } catch (e) {
      console.warn(e)
    }
  }

  // Login
  async login(email, pass) {
    return await firebase.auth().signInWithEmailAndPassword(email, pass);
  }

  // Register
  async register(email, pass) {
    try {
      return await firebase.auth().createUserWithEmailAndPassword(email, pass);
    } catch (e) {
      return console.warn(e)
    }
  }

  // Esqueci a senha
  async forgotPass(email) {
    try {
      return await firebase.auth().sendPasswordResetEmail(email);
    } catch (e) {
      console.warn(e)
    }
  }

  // Registrar no Firestore
  async registerOnFirestore(uid, data) {
    try {
      await firebase.firestore().collection("users").doc(uid).set(data);
    } catch (e) {
      console.warn(e)
    }
  }

  // Verifica se a Universidade está cadastrada
  async checkUni(domain) {
    try {
      return await firebase
        .firestore()
        .collection("universities")
        .where("domain", "==", domain)
        .get();
    } catch (e) {
      console.warn(e)
    }
  }

  // Busca os dados da Universidade passada por parâmetro
  async getUniData(uniID) {
    try {
      return await firebase
        .firestore()
        .collection("universities")
        .doc(uniID)
        .get();
    } catch (e) {
      console.warn(e)
    }
  }

  // Busca os dados de cadastro do User no Firestore
  async getUserInfo(userUID) {
    try {
      return await firebase.firestore().collection("users").doc(userUID).get();
    } catch (e) {
      console.warn(e)
    }
  }

  // Setar a pasta imgs e a offers com a imagem tento o mesmo nome do UID do User
  async setItemImg(userUID, img, mime, numer) {
    try {
      return await firebase
        .storage()
        .ref()
        .child("imgs")
        .child(`offers/${userUID}/${numer}.jpg`)
        .put(img, { contentType: mime });
    } catch (e) {
      console.warn(e)
    }
  }

  // Setar a pasta imgs e a profile com a imagem tento o mesmo nome do UID do User
  async setUserImg(userUID, img, mime, numer) {
    try {
      return await firebase
        .storage()
        .ref()
        .child("imgs")
        .child(`profile/${userUID}/${numer}.jpg`)
        .put(img, { contentType: mime });
    } catch (e) {
      console.warn(e)
    }
  }

  // Pegar URL da Foto de Perfil
  async updateImgProfile(userUID, img) {
    try {
      await firebase.firestore().collection("users").doc(userUID).update(img);
    } catch (e) {
      console.warn(e)
    }
  }

  // Pegar URL da Foto
  async getURLUserImg(userUID, number) {
    try {
      return await firebase
        .storage()
        .ref()
        .child("imgs")
        .child(`profile/${userUID}/${number}.jpg`)
        .getDownloadURL();
    } catch (e) {
      console.warn(e)
    }
  }

  // Pegar URL da Foto
  async getURLItemImg(userUID, number) {
    try {
      return await firebase
        .storage()
        .ref()
        .child("imgs")
        .child(`offers/${userUID}/${number}.jpg`)
        .getDownloadURL();
    } catch (e) {
      console.warn(e)
    }
  }

  // Busca os dados dos ADS
  async getADS(university) {
    try {
      return await firebase
        .firestore()
        .collection("ads")
        .where("university", "==", university)
        .get();
    } catch (e) {
      console.warn(e)
    }
  }

  // Busca as categorias cadastradas
  async getCategories(categ) {
    try {
      return await firebase
        .firestore()
        .collection("categories")
        .where("description.en", "==", categ)
        .get();
    } catch (e) {
      console.warn(e)
    }
  }

  // Busca os itens da categoria desejada
  async getItemsCateg(categID) {
    try {
      return await firebase
        .firestore()
        .collection("offers")
        .where("category", "==", categID)
        .get();
    } catch (e) {
      console.warn(e)
    }
  }

  // Busca as itens cadastrados
  async getSearchItem(item) {
    try {
      return await firebase
        .firestore()
        .collection("offers")
        // .where("description", "==", item)
        .get();
    } catch (e) {
      console.warn(e)
    }
  }

  async getEveryItem() {
    try {
      return await firebase.firestore().collection("offers").get();
    } catch (e) {
      console.warn(e)
    }
  }

  // Registrar oferta no Firestore
  async registerItem(data) {
    try {
      await firebase.firestore().collection("offers").doc().set(data);
    } catch (e) {
      console.warn(e)
    }
  }

  // Busca todos os itens do usuario
  async getItemsUser(userId) {
    try {
      return await firebase
        .firestore()
        .collection("offers")
        .where("user", "==", userId)
        .get();
    } catch (e) {
      console.warn(e)
    }
  }

  // Deleta um item do usuário
  async deleteItemsUser(itemId) {
    try {
      await firebase.firestore().collection("offers").doc(itemId).delete();
    } catch (e) {
      console.warn(e)
    }
  }

  //Verifica atualizações do Chat
  async getListaConversas(uid, callback) {
    try {
      return await firebase
        .database()
        .ref("chats")
        .child(uid)
        .on("value", callback);
    } catch (e) {
      console.warn(e)
    }
  }

  // Envia mensagem
  async sendMessage(uid, sentUid, data) {
    try {
      await this.setUnread(sentUid, uid, 1);
      await firebase
        .database()
        .ref("chats")
        .child(uid)
        .child(sentUid)
        .child("messages")
        .push()
        .set(data);
    } catch (e) {
      console.warn(e)
    }
  }

  async deleteMessages(uid, sentUid) {
    try {
      await firebase
        .database()
        .ref("chats")
        .child(uid)
        .child(sentUid)
        .child("messages")
        .set(null);
    } catch (e) {
      console.warn(e)
    }
  }

  async setUnread(uid, sentUid, numero) {
    var messages = 0;
    this.getListaConversas(uid, async r => {
      messages = r.toJSON()[sentUid]["unreadMessages"];
    });
    messages = messages + 1;
    try {
      await firebase
        .database()
        .ref("chats")
        .child(uid)
        .child(sentUid)
        .update({ unreadMessages: numero ? messages : 0 });
    } catch (e) {
      console.warn(e)
    }
  }

  async getAllUnread(uid) {
    var unread;
    this.getListaConversas(uid, async r => {
      r.forEach(r => {
        unread += r.val().unreadMessages;
      });
    });
    console.log(unread)

  }

  async AsyncStorageContent() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log({ [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  }
}

export default new System();
