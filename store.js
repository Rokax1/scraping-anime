 import {db} from './firebase-config.js'

 let animes = await db.collection('Animes').get();

 //listar
// let a =animes.docs.map(anime=>({
//   'id':anime.id,
//   ...anime.data()
//  }));


 export const  storeAnime = async (anime) => {
   await db.collection('animes').add(anime);
};