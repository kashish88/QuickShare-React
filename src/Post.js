import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';

function Post({ postId, user, username, caption, imageUrl, userId }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('')
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);



    /*
        useEffect(()=>{
            let unsubscribe;
      
              if(postId) {
                  unsubscribe=db
                  .collection("posts")
                  .doc(postId)
                  .collection("comments")
                  .orderBy('timestamp','desc')
                  .onSnapshot((snapshot)=>{
                      setComments(snapshot.docs.map((doc)=>doc.data()))
                  })
              }
              return ()=>{
                  unsubscribe();
              };
          },[postId]);
    */

    useEffect(() => {
        let unsubscribeComments;
        let unsubscribeLikes;

        if (postId) {
            // Fetch comments
            unsubscribeComments = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => ({ ...doc.data(), commentId: doc.id })));
                });

            // Fetch likes
            unsubscribeLikes = db
                .collection('posts')
                .doc(postId)
                .collection('likes')
                .onSnapshot((snapshot) => {
                    setLikes(snapshot.size);
                });

            // Check if the current user has liked the post
            if (user) {
                db.collection('posts')
                    .doc(postId)
                    .collection('likes')
                    .doc(user.uid)
                    .get()
                    .then((doc) => {
                        setLiked(doc.exists);
                    });
            }
        }

        return () => {
            unsubscribeComments && unsubscribeComments();
            unsubscribeLikes && unsubscribeLikes();
        };
    }, [postId, user]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            //timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('');
    }
    const handleLike = () => {
        // Toggle like status
        const likeRef = db.collection('posts').doc(postId).collection('likes').doc(user.uid);

        if (liked) {
            likeRef.delete();
        } else {
            likeRef.set({
                timestamp: new Date(),
            });
        }

        setLiked(!liked);
    };
    const deleteComment = (commentId) => {
        db.collection('posts')
            .doc(postId)
            .collection('comments')
            .doc(commentId)
            .delete()
            .then(() => {
                console.log('Comment deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting comment:', error);
            });
    };

    const handleDelete = () => {

        db.collection("posts").doc(postId).delete().then(function () {
            console.log("Successfully deleted");
        }).catch(function (error) {
            console.log("Error removing", error);
        });
        /*
        var desertRef=storage.child(name);
        desertRef.delete().then(function(){
            console.log("deleted successfully");
        }).catch(function(error){
            //error
        })
        */

    }



    return (
        <div className="post">
            <div className="post_header">

                <Avatar
                    className="post_avatar"
                    alt='R'

                >
                </Avatar>
                <h3>{username}</h3>
                <DeleteIcon className="d" onClick={handleDelete} />
            </div>
            <img className="post_image" src={imageUrl} alt=""></img>
            <h4 className="post_text"><strong>{username}</strong>  {caption}</h4>
            <div className="post_actions">
                <button onClick={handleLike}>
                    <FavoriteIcon color={liked ? 'secondary' : 'default'} />
                </button>
                <span>{likes} likes</span>
            </div>
            <div className="post_comments">
                {comments.map((comment) => (
                    <div key={comment.commentId} className="comment_container">
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                        {user && user.uid === userId && (
                            <DeleteIcon onClick={() => deleteComment(comment.commentId)}>
                                Delete
                            </DeleteIcon>
                        )}
                    </div>
                ))}
            </div>
            {user && (
                <form className="post_commentBox">
                    <input
                        className="post_input"
                        type="text"
                        placeholder="Add a comment.."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post_button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}



                    >
                        Post
                    </button>




                </form>
            )}
        </div>
    )
}

export default Post
