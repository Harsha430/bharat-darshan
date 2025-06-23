import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Get all posts
export const getAllPosts = async () => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      const postData = { id: doc.id, ...doc.data() };
      posts.push(postData);
    });

    return posts;
  } catch (error) {
    throw error;
  }
};

// Get single post by ID
export const getPostById = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (postDoc.exists()) {
      return { id: postDoc.id, ...postDoc.data() };
    } else {
      throw new Error('Post not found');
    }
  } catch (error) {
    throw error;
  }
};

// Get posts by author
export const getPostsByAuthor = async (authorId) => {
  try {
    const postsRef = collection(db, 'posts');

    // Try with ordering first, fallback to simple query if index doesn't exist
    try {
      const q = query(postsRef, where('authorId', '==', authorId), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      const posts = [];
      querySnapshot.forEach((doc) => {
        const postData = { id: doc.id, ...doc.data() };
        posts.push(postData);
      });

      return posts;
    } catch (indexError) {
      // Fallback: query without ordering
      const q = query(postsRef, where('authorId', '==', authorId));
      const querySnapshot = await getDocs(q);

      const posts = [];
      querySnapshot.forEach((doc) => {
        const postData = { id: doc.id, ...doc.data() };
        posts.push(postData);
      });

      // Sort manually by timestamp
      posts.sort((a, b) => {
        const aTime = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const bTime = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return bTime - aTime;
      });

      return posts;
    }
  } catch (error) {
    throw error;
  }
};

// Create new post
export const createPost = async (postData) => {
  try {
    const postsRef = collection(db, 'posts');
    const docRef = await addDoc(postsRef, {
      ...postData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Update post
export const updatePost = async (postId, postData) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...postData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

// Delete post
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error) {
    throw error;
  }
};

// Get user data
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
};

// Comment functions
// Get comments for a post
export const getCommentsByPostId = async (postId) => {
  try {
    const commentsRef = collection(db, 'comments');

    // Try with ordering first, fallback to simple query if index doesn't exist
    try {
      const q = query(
        commentsRef,
        where('postId', '==', postId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
      });

      return comments;
    } catch (indexError) {
      // Fallback: query without ordering
      const q = query(commentsRef, where('postId', '==', postId));
      const querySnapshot = await getDocs(q);

      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
      });

      // Sort manually by timestamp (newest first)
      comments.sort((a, b) => {
        const aTime = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const bTime = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return bTime - aTime;
      });

      return comments;
    }
  } catch (error) {
    throw error;
  }
};

// Add a new comment
export const addComment = async (commentData) => {
  try {
    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, {
      ...commentData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
  } catch (error) {
    throw error;
  }
};

// Update a comment
export const updateComment = async (commentId, content) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      content: content,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};
