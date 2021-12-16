import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth, ServerTimestamp } from '../../lib/firebase';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase'
import toast from 'react-hot-toast';
import { collection, doc, getDocs, query, serverTimestamp, setDoc } from 'firebase/firestore';

export default function AdminPostsPage({ }) {
  
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList () {
  const ref = collection(firestore, 'users', auth.currentUser.uid, 'posts')
  const [querySnapshot] = useCollection(ref);

  const posts = querySnapshot?.docs.map((doc) => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin/>
    </>
  )
}

function CreateNewPost () {
  const router = useRouter()
  const {username} = useContext(UserContext)
  const [title, setTitle] = useState('');

  const slug = encodeURI(kebabCase(title))
  const isValid = title.length > 3 && title.length < 100;


  const createPost = async (e) => {
    e.preventDefault();

    await setDoc(doc(firestore, 'users', auth.currentUser.uid, 'posts', slug), {
      title: title,
      slug: slug,
      uid: auth.currentUser.uid,
      username,
      published : false,
      content: '# hello world',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    });

    toast.success('Post creatd!')

    router.push(`/admin/${slug}`)
  }
  return (
    <form onSubmit={createPost}>
      <input 
        defaultValue={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder='My Awesome Article!'
        className={styles.input}
      />
      <p>
        <strong>Slug: </strong> {slug}
      </p>
      <button type='submit' disabled={!isValid} className='btn-green'>
        Create New Post
      </button>
    </form>
  )
}
