import React, { useState, useEffect } from 'react'
import './App.css'
import { makeStyles } from '@material-ui/core/styles';
import Post from './Post'
import { db, auth } from './firebase'
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';




function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));







function App() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle)
    const [posts, setPosts] = useState([
        /*
         {
             username:"picasa", 
             caption:"Wow its wonderful" ,
             imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTbAmafdPNr9fd0KC0Z98WYEC7Wl1wYlPVf-A&usqp=CAU"
         },
         {
             username:"picasa", 
             caption:"Wow its wonderful" ,
             imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTbAmafdPNr9fd0KC0Z98WYEC7Wl1wYlPVf-A&usqp=CAU"
         },
         */

    ]);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);



    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser)
                setUser(authUser)
            }
            else {
                setUser(null);
            }
        })
        return () => {
            unsubscribed();
        }
    }, [user, username])

    /*
        useEffect(()=>{
            db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
                setPosts(snapshot.docs.map(doc=>({
                   id:doc.id, 
                   post:doc.data()
                  })))
            });
      },[])
    */


    useEffect(() => {
        db.collection('posts').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })))
        });
    }, [])

    const signUp = (event) => {
        event.preventDefault();
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username,
                });
            })
            .catch((error) => alert(error.message));
        setOpen(false);
    };

    const signIn = (event) => {
        event.preventDefault();
        auth
            .signInWithEmailAndPassword(email, password)
            .catch((error) => alert(error.message));
    
        setOpenSignIn(false);
    };

    return (

        <div className="app">



            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="s">
                        <center>
                            <img className="app_headerImage"
                                src="https://cdn.worldvectorlogo.com/logos/instagram-1.svg"
                                alt=""
                            >
                            </img>
                        </center>
                        <Input
                            placeholder="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        >
                        </Input>
                        <Input
                            placeholder="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </Input>
                        <Input

                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </Input>
                        <Button type="submit" onClick={signUp}>Sign Up</Button>

                    </form>
                </div>
            </Modal>

            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="s">
                        <center>
                            <img className="app_headerImage"
                                src="https://cdn.worldvectorlogo.com/logos/instagram-1.svg"
                                alt=""
                            >
                            </img>
                        </center>

                        <Input
                            placeholder="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </Input>
                        <Input

                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </Input>
                        <Button type="submit" onClick={signIn}>Sign In</Button>

                    </form>
                </div>
            </Modal>


            <div className="app_header">
                <img className="app_headerImage"
                    src="https://cdn.worldvectorlogo.com/logos/instagram-1.svg"
                    alt=""
                >
                </img>
                {user ? (
                    <Button onClick={() => auth.signOut()}>Log out</Button>
                ) : (
                    <div className="app_loginContainer">
                        <Button onClick={() =>
                            setOpenSignIn(true)}>Sign In</Button>
                        <Button onClick={() =>
                            setOpen(true)}>Sign Up</Button>

                    </div>

                )}

            </div>
            <div className="app_posts">
                <div className="app_postsLeft">

                    {
                        posts.map(({ id, post }) => (
                            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}></Post>
                        ))
                    }
                </div>


            </div>


            {user?.displayName ? (
                <ImageUpload username={user.displayName} />
            ) : (
                <h3 className="s">Sorry you need to login to upload</h3>
            )}

        </div>

    )
}

export default App
