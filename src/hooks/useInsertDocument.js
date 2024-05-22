import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const initialState = {
  loading: false,
  error: null,
};

const insertReducer = (state, action) => {
  console.log("Reducer action:", action); // Log da ação despachada
  switch (action.type) {
    case "LOADING":
      console.log("LOADING action dispatched"); // Log da ação LOADING despachada
      return { loading: true, error: null };
    case "INSERTED_DOC":
      console.log("INSERTED_DOC action dispatched"); // Log da ação INSERTED_DOC despachada
      return { loading: false, error: null };
    case "ERROR":
      console.log("ERROR action dispatched"); // Log da ação ERROR despachada
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export const useInsertDocument = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState);

  // deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const insertDocument = async (document) => {
    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      const newDocument = { ...document, createdAt: Timestamp.now() };

      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      )
        
      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument,
      });
    } catch (error) {
      checkCancelBeforeDispatch({ type: "ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    setCancelled(false);
    return () => setCancelled(true);
  }, []);

  return { insertDocument, response };
};