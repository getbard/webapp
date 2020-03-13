import * as firebase from 'firebase/app';
import 'firebase/auth';

import firebaseConfig from './firebase.config';

const config = firebaseConfig[process.env.NODE_ENV];

export default !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();