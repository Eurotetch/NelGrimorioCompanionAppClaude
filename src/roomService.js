// src/services/roomsService.js
import { doc, runTransaction, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "../firebaseConfig";

export async function createRoom(game, creatorId, dates) {
  return await addDoc(collection(db, "rooms"), {
    gameId: game.id,
    title: `${game.title} (${creatorId}) ${dates.join(", ")}`,
    dates,
    creatorId,
    active: [creatorId],
    bench: [],
    maxPlayers: game.max,
    minPlayers: game.min,
    createdAt: serverTimestamp(),
    expiresAt: serverTimestamp(), // calcola lato server o client come preferisci
    status: "open"
  });
}

export async function joinRoomTransaction(roomId, userId) {
  const roomRef = doc(db, "rooms", roomId);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(roomRef);
    if (!snap.exists()) throw new Error("Room non trovata");
    const r = snap.data();
    if (r.active.includes(userId) || r.bench.includes(userId)) return;
    if (r.active.length < r.maxPlayers) {
      tx.update(roomRef, { active: [...r.active, userId] });
    } else {
      tx.update(roomRef, { bench: [...r.bench, userId] });
    }
  });
}
