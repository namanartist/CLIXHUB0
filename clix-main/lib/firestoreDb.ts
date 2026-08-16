import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { firestore } from './firebase';

export async function firestoreGetAll<T>(collectionName: string): Promise<T[]> {
  try {
    const colRef = collection(firestore, collectionName);
    const snapshot = await getDocs(colRef);
    const results: T[] = [];
    snapshot.forEach(docSnap => {
      results.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    return results;
  } catch (error) {
    console.warn(`Firestore getDocs failed for ${collectionName}:`, error);
    return [];
  }
}

export async function firestoreGetOne<T>(collectionName: string, id: string): Promise<T | null> {
  try {
    const docRef = doc(firestore, collectionName, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as T;
    }
    return null;
  } catch (error) {
    console.warn(`Firestore getDoc failed for ${collectionName}/${id}:`, error);
    return null;
  }
}

export async function firestoreSave<T extends { id?: string }>(collectionName: string, item: T): Promise<T> {
  try {
    const id = item.id || `id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const docRef = doc(firestore, collectionName, id);
    const toSave = { ...item, id, updatedAt: new Date().toISOString() };
    await setDoc(docRef, toSave, { merge: true });
    return toSave as T;
  } catch (error) {
    console.warn(`Firestore save failed for ${collectionName}:`, error);
    return item;
  }
}

export async function firestoreDelete(collectionName: string, id: string): Promise<boolean> {
  try {
    const docRef = doc(firestore, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.warn(`Firestore delete failed for ${collectionName}/${id}:`, error);
    return false;
  }
}

export async function firestoreQueryWhere<T>(collectionName: string, field: string, value: any): Promise<T[]> {
  try {
    const colRef = collection(firestore, collectionName);
    const q = query(colRef, where(field, '==', value));
    const snapshot = await getDocs(q);
    const results: T[] = [];
    snapshot.forEach(docSnap => {
      results.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    return results;
  } catch (error) {
    console.warn(`Firestore query failed for ${collectionName}:`, error);
    return [];
  }
}

export function subscribeToCollection<T>(collectionName: string, callback: (items: T[]) => void) {
  try {
    const colRef = collection(firestore, collectionName);
    return onSnapshot(colRef, (snapshot) => {
      const results: T[] = [];
      snapshot.forEach(docSnap => {
        results.push({ id: docSnap.id, ...docSnap.data() } as T);
      });
      callback(results);
    }, (err) => {
      console.warn(`Firestore onSnapshot listener error for ${collectionName}:`, err);
    });
  } catch (e) {
    return () => {};
  }
}
