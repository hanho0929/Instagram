import { useContext } from 'react';
import {createContext} from 'react';

const FirebaseContext = createContext(null);
// export const useFirebaseContext = () => useContext(FirebaseContext);
export default FirebaseContext;