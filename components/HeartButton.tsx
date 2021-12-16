import { firestore, auth, fieldIncrement } from "../lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import { collection, doc, increment, writeBatch } from "firebase/firestore";

export default function Heart({ postRef }) {
  const heartRef = doc(firestore, postRef.path, "hearts", auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(firestore);

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  const removeHeart = async () => {
    const batch = writeBatch(firestore);

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    batch.commit();
  }

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
