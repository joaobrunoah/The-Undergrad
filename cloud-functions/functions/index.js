const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Thumbnails config
const mkdirp = require('mkdirp-promise');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

exports.sendAdsPushNotification = functions.firestore
  .document('ads/{id_ad}')
  .onCreate(async (snap, context) => {
    const adObj = snap.data();

    const university = adObj.university;
    const businessName = adObj.university;

    let querySnapshot = await admin
      .firestore()
      .collection('universities')
      .where("initials", "==", university).get();

    let universitiesList = [];

    let language = 'br';

    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      let uniObj = doc.data();
      if(uniObj.coin === 'U$') {
        language = 'en';
      }
      universitiesList.push('universities/' + uniObj.id);
    });

    querySnapshot = await admin
      .firestore()
      .collection('users')
      .where("university", "in", universitiesList).get();

    let pushTokens = [];

    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      let userObj = doc.data();
      if(userObj.fcmToken) {
        pushTokens.push(userObj.fcmToken);
      }
    });



    let title = 'New event at ' + university + '!';
    let body = 'Check '+ businessName + ' in The Undergrad!';

    if(language === 'br') {
      title = 'Novo evento da ' + university + '!';
      body = 'Confira ' + businessName + ' no The Undergrad!';
    }

    // Notification details.
    let payload = {
      notification: {
        title: title,
        body: body
      },
      tokens: pushTokens
    };

    console.log(JSON.stringify(payload));

    await admin.messaging().sendMulticast(payload);
  });

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
          title: `${name}:`,
          body: `${eventObj.message}`,
          icon: 'icon',
        },
      };

      await admin.messaging().sendToDevice(fcmToken, payload);
    }
  });

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
  // File and directory paths.
  const filePath = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
  const tempLocalFile = path.join(os.tmpdir(), `${fileName}`);
  const tempLocalThumbFile = path.join(os.tmpdir(), `${THUMB_PREFIX}${fileName}`);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return console.log('This is not an image.');
  }
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    return console.log('Already a Thumbnail.');
  }

  // Cloud Storage files.
  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(filePath);
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = {
    contentType: contentType,
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    // 'Cache-Control': 'public,max-age=3600',
  };

  // Download file from bucket.
  await file.download({destination: tempLocalFile});
  console.log('The file has been downloaded to', tempLocalFile);
  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempLocalFile, '-resize', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  console.log('Thumbnail created at', tempLocalThumbFile);
  // Uploading the Thumbnail.
  await bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
  console.log('Thumbnail uploaded to Storage at', thumbFilePath);
  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalThumbFile);
  // Get the Signed URLs for the thumbnail and original image.
  const config = {
    action: 'read',
    expires: '03-01-2500',
  };
  const results = await Promise.all([
    thumbFile.getSignedUrl(config),
    file.getSignedUrl(config),
  ]);
  console.log('Got Signed URLs.');
  const thumbResult = results[0];
  const originalResult = results[1];
  const thumbFileUrl = thumbResult[0];
  const fileUrl = originalResult[0];
  // Add the URLs to the Database
  await admin.database().ref('images').push({path: fileUrl, thumbnail: thumbFileUrl});
  return console.log('Thumbnail URLs saved to database.');

});
