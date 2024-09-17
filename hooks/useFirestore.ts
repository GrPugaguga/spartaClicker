'use client'
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, increment, arrayUnion, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from '../app/firebase/firebaseConfig';

interface FirestoreResult<T> {
  data: T | null;
  error: Error | null | unknown;
  loading: boolean;
}

export function useFirestore<T>(collection: string, documentId: string) {
  const [result, setResult] = useState<FirestoreResult<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, collection, documentId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          setResult({ data: docSnapshot.data() as T, error: null, loading: false });
        } else {
          setResult({ data: null, error: new Error("Document does not exist"), loading: false });
        }
      } catch (error) {
        setResult({ data: null, error, loading: false });
      }
    };

    fetchData();
  }, [collection, documentId]);

  return result;
}

export async function updateFirestoreDoc(collection: string, documentId: string, updateData: any) {
  const docRef = doc(db, collection, documentId);
  try {
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    return false;
  }
}

export async function createFirestoreDoc(collection: string, documentId: string, data: any) {
  const docRef = doc(db, collection, documentId);
  try {
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Error creating document: ", error);
    return false;
  }
}

export async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const data = snapshot.docs.map(doc => doc.data() as T);
    return data;
  } catch (error) {
    console.error("Error fetching collection: ", error);
    throw error;
  }
}
