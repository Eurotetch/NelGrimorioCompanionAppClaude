import { doc, runTransaction, arrayUnion, arrayRemove, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * joinRoomTransaction
 * - userId: uid dell'utente che vuole entrare
 * - roomId: id della stanza
 * - asBench: boolean (se true entra in bench, altrimenti in active)
 */
export async function joinRoomTransaction({ userId, roomId, asBench = false }) {
  const roomRef = doc(db, "rooms", roomId);

  return runTransaction(db, async (tx) => {
    const roomSnap = await tx.get(roomRef);
    if (!roomSnap.exists()) throw new Error("Room not found");

    const room = roomSnap.data();
    const active = Array.isArray(room.active) ? room.active.slice() : [];
    const bench = Array.isArray(room.bench) ? room.bench.slice() : [];

    // se è già in active o bench, non duplicare
    if (active.includes(userId) || bench.includes(userId)) {
      return { status: "already" };
    }

    if (asBench) {
      bench.push(userId);
      tx.update(roomRef, { bench });
    } else {
      active.push(userId);
      tx.update(roomRef, { active });
    }

    // opzionale: aggiorna lastJoinedAt
    tx.update(roomRef, { lastUpdatedAt: serverTimestamp() });

    return { status: "joined", asBench };
  });
}

/**
 * createRoom minimal
 */
export async function createRoom({ name, ownerId }) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const ref = doc(db, "rooms", id);
  await setDoc(ref, {
    name,
    ownerId,
    createdAt: serverTimestamp(),
    active: [],
    bench: []
  });
  return id;
}
