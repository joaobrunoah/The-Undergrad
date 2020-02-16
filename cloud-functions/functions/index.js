const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendPushNotification = functions.database
  .instance('app-venda')
  .ref('chats/{user_from_id}/{user_to_id}/messages/{message_id}')
  .onCreate(async (event, context) => {
    let user_id_from = context.params.user_from_id;
    let user_id_to = context.params.user_to_id;

    let eventObj = event.val();

    if (JSON.stringify(event).indexOf(user_id_to) < 0) {
      // SEND PUSH

      let userObj = await admin
        .firestore()
        .collection('users')
        .doc(user_id_to)
        .get();

      userObj = userObj.data();
      const fcmToken = userObj.fcmToken;

      let senderObj = await admin
        .firestore()
        .collection('users')
        .doc(user_id_from)
        .get();

      senderObj = senderObj.data();

      const nameArray = senderObj.name.split(' ');

      let name =
        nameArray[0] + (nameArray.length > 1 ? ' ' + nameArray[1] : '');

      // Notification details.
      const payload = {
        notification: {
          title: `${name} disse:`,
          body: `${eventObj.message}`,
          icon: 'icon',
        },
      };

      await admin.messaging().sendToDevice(fcmToken, payload);
    }
  });
