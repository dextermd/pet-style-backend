import { Storage } from '@google-cloud/storage';
import { format } from 'util';
import { v4 as uuidv4 } from 'uuid';
const uuid = uuidv4();

const storage = new Storage({
  projectId: 'shop-713b4',
  keyFilename: './serviceAccountKey.json',
});

const bucket = storage.bucket(`gs://shop-713b4.appspot.com/`);

async function uploadToStorage(file, pathImage, mapName, oldImageUrl) {
  return new Promise((resolve, reject) => {
    if (pathImage) {
      if (pathImage != null || pathImage != undefined) {
        let fileUpload = bucket.file(`${mapName}/${pathImage}`);
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: 'image/png',
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
          resumable: false,
        });

        blobStream.on('error', (error) => {
          console.log('Error uploading file to Firebase.', error);
          reject('Something went wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
          const url = format(
            `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`,
          );
          console.log('Cloud Storage URL ', url);
          resolve(url);
        });

        blobStream.end(file.buffer);

        if (oldImageUrl !== null) {
          bucket.deleteFiles(`${oldImageUrl}`);
        }
      }
    }
  });
}

export default uploadToStorage;
