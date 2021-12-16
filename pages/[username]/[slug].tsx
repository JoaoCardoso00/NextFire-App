import styles from "../../styles/Post.module.css";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { getDoc, getDocs, doc, collectionGroup } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import MetaTags from "../../components/Metatags";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import Link from "next/link";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const userRef = (await userDoc).ref;
    const postRef = doc(firestore, userRef.path, "posts", slug);
    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = collectionGroup(firestore, "posts");
  const posts = getDocs(snapshot);

  const paths = (await posts).docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = doc(firestore, props.path);

  const [realtimePost] = useDocumentData(postRef);
  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <MetaTags title="post" description="post" image={null} />
      <section>{<PostContent post={post} />}</section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
}
