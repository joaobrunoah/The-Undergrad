import firebase from "./firebaseConnection";
import "firebase/firestore";

class System {
  // Função para deslogar do sistema
  async logOut() {
    await firebase.auth().signOut();
  }

  // Verificar se existe um usuário logado
  async addAuthListener(callback) {
    await firebase.auth().onAuthStateChanged(callback);
  }

  // Login
  async login(email, pass) {
    return await firebase.auth().signInWithEmailAndPassword(email, pass);
  }

  // Register
  async register(email, pass) {
    return await firebase.auth().createUserWithEmailAndPassword(email, pass);
  }

  // Esqueci a senha
  async forgotPass(email) {
    return await firebase.auth().sendPasswordResetEmail(email);
  }

  // Registrar no Firestore
  async registerOnFirestore(uid, data) {
    await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .set(data);
  }

  // Verifica se a Universidade está cadastrada
  async checkUni(domain) {
    return await firebase
      .firestore()
      .collection("universities")
      .where("domain", "==", domain)
      .get();
  }

  // Busca os dados da Universidade passada por parâmetro
  async getUniData(uniID) {
    return await firebase
      .firestore()
      .collection("universities")
      .doc(uniID)
      .get();
  }

  // Busca os dados de cadastro do User no Firestore
  async getUserInfo(userUID) {
    return await firebase
      .firestore()
      .collection("users")
      .doc(userUID)
      .get();
  }

  // Setar a pasta imgs e a offers com a imagem tento o mesmo nome do UID do User
  async setItemImg(userUID, img, mime, numer) {
    return await firebase
      .storage()
      .ref()
      .child("imgs")
      .child(`offers/${userUID}/${numer}.jpg`)
      .put(img, { contentType: mime });
  }

  // Setar a pasta imgs e a profile com a imagem tento o mesmo nome do UID do User
  async setUserImg(userUID, img, mime, numer) {
    return await firebase
      .storage()
      .ref()
      .child("imgs")
      .child(`profile/${userUID}/${numer}.jpg`)
      .put(img, { contentType: mime });
  }

  // Pegar URL da Foto de Perfil
  async updateImgProfile(userUID, img) {
    await firebase
      .firestore()
      .collection("users")
      .doc(userUID)
      .update(img);
  }

  // Pegar URL da Foto
  async getURLUserImg(userUID, number) {
    return await firebase
      .storage()
      .ref()
      .child("imgs")
      .child(`profile/${userUID}/${number}.jpg`)
      .getDownloadURL();
  }

  // Pegar URL da Foto
  async getURLItemImg(userUID, number) {
    return await firebase
      .storage()
      .ref()
      .child("imgs")
      .child(`offers/${userUID}/${number}.jpg`)
      .getDownloadURL();
  }

  // Busca os dados dos ADS
  async getADS(university) {
    return await firebase
      .firestore()
      .collection("ads")
      .where("university", "==", university)
      .get();
  }

  // Busca as categorias cadastradas
  async getCategories(categ) {
    return await firebase
      .firestore()
      .collection("categories")
      .where("description.en", "==", categ)
      .get();
  }

  // Busca os itens da categoria desejada
  async getItemsCateg(categID) {
    return await firebase
      .firestore()
      .collection("offers")
      .where("category", "==", categID)
      .get();
  }

  // Busca as itens cadastrados
  async getSearchItem(item) {
    return await firebase
      .firestore()
      .collection("offers")
      .where("description", "==", item)
      .get();
  }

  // Registrar oferta no Firestore
  async registerItem(data) {
    await firebase
      .firestore()
      .collection("offers")
      .doc()
      .set(data);
  }

  // Busca todos os itens do usuario
  async getItemsUser(userId) {
    return await firebase
      .firestore()
      .collection("offers")
      .where("user", "==", userId)
      .get();
  }

  // Deleta um item do usuário
  async deleteItemsUser(itemId) {
    await firebase
      .firestore()
      .collection("offers")
      .doc(itemId)
      .delete();
  }

  //Verifica atualizações do Chat
  async getListaConversas(uid, callback) {
    return await firebase
      .database()
      .ref("chats")
      .child(uid)
      .on("value", callback);
  }

  // Envia mensagem
  async sendMessage(uid, sentUid, data) {
    await firebase
      .database()
      .ref("chats")
      .child(uid)
      .child(sentUid)
      .child("messages")
      .push()
      .set(data);
  }
}

export default new System();
