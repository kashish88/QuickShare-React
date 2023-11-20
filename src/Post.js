import React,{useState,useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import {db} from './firebase';
import DeleteIcon from '@material-ui/icons/Delete';
function Post({postId,user,username,caption,imageUrl}) {

    const[comments,setComments]=useState([]);
    const[comment,setComment]=useState('')
   
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










    useEffect(()=>{
      let unsubscribe;

        if(postId) {
            unsubscribe=db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            })
        }
        return ()=>{
            unsubscribe();
        };
    },[postId]);

const postComment=(event)=>{
   event.preventDefault();
   db.collection("posts").doc(postId).collection("comments").add({
       text:comment,
       username:user.displayName,
         //timestamp:firebase.firestore.FieldValue.serverTimestamp(),
   });
   setComment('');
}
const handleDelete=()=>{
   
        db.collection("posts").doc(postId).delete().then(function(){
            console.log("Successfully deleted");
        }).catch(function(error){
            console.log("Error removing",error);
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
               <DeleteIcon className="d" onClick={handleDelete}/>
            </div>
            <img className="post_image"src={imageUrl} alt=""></img>
            <h4 className="post_text"><strong>{username}</strong>  {caption}</h4>

           <div className="post_comments">
           {comments.map((comment)=>(
               <p >
               <strong>{comment.username}</strong>  {comment.text}
               </p>
           ))}
           </div>
            {user && (
            <form className="post_commentBox">
               <input
                   className="post_input"
                   type="text"
                   placeholder="Add a comment.."
                   value={comment}
                   onChange={(e)=>setComment(e.target.value)}
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
