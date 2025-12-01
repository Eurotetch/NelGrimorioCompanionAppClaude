// src/hooks/useRooms.js
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "../firebaseConfig";

export default function useRooms(gameId = null) {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const q = gameId
      ? query(collection(db, "rooms"), where("gameId", "==", gameId), where("status","==","open"), orderBy("createdAt","desc"))
      : query(collection(db, "rooms"), where("status","==","open"), orderBy("createdAt","desc"));
    const unsub = onSnapshot(q, snap => {
      setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [gameId]);
  return rooms;
}
