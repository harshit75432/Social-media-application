const express =  require('express')
const bodyParser =  require('body-parser')
const ejs = require('ejs')
const cors = require('cors');
const session = require('express-session')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const http = require('http');
const multer = require('multer')
const fs = require('fs')
const app = express()
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000
const friend_details = require('./data/helperfunction.js')
const getDetails = require('./data/date.js')
const User = require('./models/User.js')
const Notification = require('./models/Notification.js')
const localDb = 'mongodb://127.0.0.1:27017/fz'
mongoose.set('strictQuery', true);
app.use(cors());

mongoose.connect(localDb,{useNewUrlPArser:true,useUnifiedTopology:true})
.then((result)=>{
   console.log('connection successfull');
   server.listen(3000,()=>{
         console.log("Project running on port 3000")
   
   });

})



let notification = io.of('/notification')
notification.on('connection', function(socket){
   console.log('notification');
   socket.on('notification',async function(data){
      let notifications = await Notification.find({$and :[{seen: 'false'},{receiver_id : {$eq: data.user_id}}]})
      let user_details = []
      for(let i=0;i<notifications.length;i++){
       let user = await User.findById(notifications[i].sender_id)
         let user_detail = {
               name : user.first_name + " " + user.last_name,
               pic : user.profile_pic,
               type : notifications[i].type
         }
         user_details.push(user_detail)
      }
      console.log(user_details);
      console.log(notifications);
      notification.emit('notification',notifications,user_details)
   })
   socket.on('disconnect',function(){
      console.log('Notification disconnect');
   })
})

let usp = io.of('/online')
usp.on('connection',async function(socket){
   console.log('Online');
   let user_id = socket.handshake.auth.user_id;
   await User.findByIdAndUpdate(user_id,{status : 1})
   socket.on('disconnect',async function(){
      await User.findByIdAndUpdate(user_id,{status : 0})
      console.log('Not online');
   })
})

io.on('connection', socket => {
   console.log('A user connected');
   console.log(socket);
socket.on('chat message', async msg => {

   let new_notification = new Notification({
      sender_id : msg.user_id,
      receiver_id : msg.friend_id,
      time : getDetails.getTime(msg.date).toLowerCase(),
      type : 'message',
      seen : false
   })
   await new_notification.save()
 
   let date = getDetails.getTime(msg.date).toLowerCase()
   let message = msg.message 
   let messageObject = {
      user_id : msg.user_id,
      date : date,
      msg : message,
      friend_id : msg.friend_id,
      images : msg.images,
      seen : false,
      type : msg.type
   }
   console.log(messageObject);
   io.emit('chat message', messageObject); // Broadcast the message to all connected clients
});

socket.on('tag-notification', async data =>{

   for(let i=0;i<data.tagFriends.length;i++){
      let new_notification = new Notification({
         sender_id : data.user_id,
         receiver_id : data.tagFriends[i],
         time : getDetails.getTime(data.date).toLowerCase(), 
         type : 'tag',
         seen : false   
      })
      await new_notification.save()
   }
   let notifications = await Notification.find({seen: 'false'})
   let tagNotification = {
      status : true,
      notilength : notifications.length,
      user_id : data.user_id,
      friend_id : data.friend_id
   }
   io.emit('tag-notification',tagNotification)
})

socket.on('accept-request-notification', async data =>{
   if(data.status){
      console.log('accept');
      let new_notification = new Notification({
         sender_id : data.user_id,
         receiver_id : data.friend_id,
         time : getDetails.getTime(data.date).toLowerCase(), 
         type : 'accept',
         seen : false
      })
      new_notification.save()
      let notifications = await Notification.find({seen: 'false'})
      let acceptNotification = {
         status : true,
         notilength : notifications.length,
         user_id : data.user_id,
         friend_id : data.friend_id
      }
      io.emit('accept-request-notification',acceptNotification)
   }
})

socket.on('request notification', async data => {
   if(data.status){
      console.log('accept');
      let new_notification = new Notification({
         sender_id : data.user_id,
         receiver_id : data.friend_id,
         time : getDetails.getTime(data.date).toLowerCase(), 
         type : 'request',
         seen : false   
      })
      new_notification.save()
      let notifications = await Notification.find({seen: 'false'})
      console.log(data.friend_id);
      let requestNotification = {
         status : true,
         notilength : notifications.length,
         user_id : data.user_id,
         friend_id : data.friend_id
      }
      io.emit('request notification',requestNotification)
   }
})

socket.on('unseen-message', async unseen=>{
   let friends_details = await friend_details.getFriendsArray(req.session.user_id)
   let chats = await Chat.find({status : false})
   let unseen_details = {
       friends_details : friends_details,
       chats : chats 
   }
   io.emit('unseen-messsage',unseen_details)
})

socket.on('like-notification',async data=>{
   if(data.status == true){
      console.log('like socket');
      let new_notification = new Notification({
         sender_id : data.user_id,
         receiver_id : data.friend_id,
         time : getDetails.getTime(data.time).toLowerCase(),
         type : 'like',
         seen : false
      })
      console.log(new_notification);
      new_notification.save()
     let notifications = await Notification.find({seen: 'false'})
     console.log(notifications);
     let notifications_details = {
      status : true,
      notilength : notifications.length,
      user_id : data.user_id,
      friend_id : data.friend_id
     }
      io.emit('like-notification',notifications_details)
   }
})
socket.on('seen',data=>{
   if(data.seen == true){
      console.log('seen');
      let seenData = {
         seen : true
      }
      io.emit('seen',seenData) 
   }else{
      io.emit('seen',data)
   }
}) 
socket.on('notification', async (data)=>{
   if(data.status == true){
      console.log('svsajv');
      let notifications = await Notification.find({seen : false})
      console.log(notifications.length);
      let notify = {
         friend_id : data.friend_id,
         status : data.status,
         notifications : notifications
      }
      console.log(notify);
      io.emit('notification',notify)
   }
})
socket.on('display-notification', async(data)=>{
   if(data.status == true){
      let notifications = await Notification.find({$and :[{seen: 'false'},{receiver_id : {$eq: data.user_id}}]})
      let user_details = []
      console.log(notifications.length);
      let receiverId = ''
      for(let i=0;i<notifications.length;i++){
         receiverId = notifications[i].receiver_id
       let user = await User.findById(notifications[i].sender_id)
         let user_detail = {
               name : user.first_name + " " + user.last_name,
               pic : user.profile_pic,
               time : notifications[i].time,
               type : notifications[i].type         
         }
         user_details.push(user_detail)
      }
      let notificationDetails={
         user_details : user_details,
         receiver_id : receiverId,
         notification_length : notifications.length
      }
      console.log(user_details);
      console.log(notifications);
      io.emit('display-notification',notificationDetails)
   }
})
socket.on('typing', (data)=>{
   console.log('typing');
   console.log(data.user_id);
   console.log(data.friend_id);
   if(data.typing==true){
      io.emit('display', data)
   }else{
      io.emit('display', data)
   }
 })

 // Handle disconnection
 socket.on('disconnect', () => {

   console.log('User disconnected');
 });
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.set('view engine','ejs')
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))



const Chat = require('./models/Chat.js')

function isLoggedIn(req,res,next){
   if(req.session.is_logged_in){
    next()
   }else{
    res.redirect('/login')
   }
 }
 
 function isNotLoggedIn(req,res,next){
    if(!req.session.isLogedIn){
     next()
    }else{
     res.redirect('/')
    }
  }

  
const upload = multer({
   storage:multer.diskStorage({
      destination : function(req,file,cb){
         cb(null,'public/uploads')
      },
      filename: function(req,file,cb){
         let temp_file_arr = file.originalname.split('.')
        
         let temp_file_name = temp_file_arr[0]
         let temp_file_extension = temp_file_arr[temp_file_arr.length-1]
         let file_name = temp_file_name+'-'+Date.now()+'.'+ temp_file_extension
         req.file_name = file_name
         cb(null,file_name)
      }
   })
}).single('file')


app.post('/upload',upload,(req,res)=>{
   let url =`http://localhost:3000/uploads/${req.file_name}`
   res.json({url})  
}) 

app.get('/signup',(req,res)=>{
   res.render('signup')
})

app.post('/signup', async (req,res)=>{
  
      User.findOne({email : req.body.email})
      .then((eUser)=>{
         if(eUser){
            res.render('signup',{error : "User already exist please login page!!"})
         }else{
            User.findOne({mobile : req.body.mobile})
            .then(( mUser)=>{
               if(mUser){
                  res.render('signup',{error : "User are already register"})
               }else{
                  bcrypt.hash(req.body.password,10,function(err,hash){
                     let user = new User({
                        first_name : req.body.first_name,
                        last_name : req.body.last_name,
                        email : req.body.email,
                        mobile : req.body.mobile,
                        password : hash,
                        profile_pic : ''
                     })
                     
                     user.save()
                     .then(() => {  
                        res.render('login',{success : "User Successfully Register"})
                     })
                     .catch((e) => {
                        console.log(e);
               
                     })
               
                  })
               }
            })
         }
      })
})


app.get('/login',isNotLoggedIn,(req,res)=>{
   let error = req.query.error
   
   if(error){
      res.render('login',{error : `No account found with ${req.query.email} email`})
   }else{
      res.render('login')
   }
})

app.post('/login',(req,res)=>{
    User.findOne({email : req.body.email})
   .then((eUser) => {
      if(eUser){      
         bcrypt.compare(req.body.password,eUser.password,function(err,result){
            if(result){
               req.session.is_logged_in = true
               req.session.email = eUser.email
               req.session.first_name = eUser.first_name
               req.session.last_name = eUser.last_name
               req.session.mobile = eUser.mobile
               req.session.friends = eUser.friends
               req.session.requests = eUser.requests
               req.session.request_sent = eUser.request_sent
               req.session.user_id = eUser.id 
               req.session.profile_pic = eUser.profile_pic  
               req.session.is_online = true
               res.redirect('/')
            }else{
               res.render('login', {error : "Password is not correct please check your password"})
            }
           
             
         })
         
      }else{
         res.render('login',{error : "User are not register please create a account"})
      }
   })
})


app.get('/friends',isLoggedIn,(req,res)=>{
   console.log('ff');
   let requests = req.session.requests 
   let friends = []
   
      for(let i=0; i<=requests.length; i++){

         User.findById(requests[i])
         .then((user)=>{
            let first_name = user.first_name
            let last_name = user.last_name 
               res.render('friends', {requests, first_name, last_name})
         })
         .catch((err)=>{
            console.log(err)
         })
        
      }
      
      
   
   
   // User.find({id : {$ne : [...friendsId,req.session.user_id]}})
   
})

const Post = require('./models/Post.js');
const { log } = require('console');


app.get('/profile',isLoggedIn,async(req,res)=>{
      let friends_details = await friend_details.getFriendsArray(req.session.user_id)
      const friends = req.session.friends
    
      const all_friends = []
      if(friends_details.length>0){
         friends_details = friends_details
      }else{
         friends_details = []
      }
     
      if(friends.length == 0){
         console.log('friends');
         Post.find({user_id :  req.session.user_id})
               .then((posts)=>{ 
   
         res.render('profile',{title : 'Profile', all_friends, session : req.session, posts : posts,friends_details : friends_details,date : getDetails.getDate})
      })
      .catch((err)=>{
         console.log(err);
      })
      }else{
         console.log('friends');
         for(let i=0;i<friends.length;i++){
            User.findById(friends[i])
            .then((friend)=>{     
               all_friends.push(friend)
             
            })
         } 

       
         
      let id = req.session.user_id
         Post.find({$or:[{tag_friends : {$in : id}},{user_id : id}]}).populate('user_id')
         .then((posts)=>{ 
            console.log('Posts:',posts); 
            let photos = []
              for(let i=0;i<posts.length;i++){
                  photos.push(...posts[i].post_pics)
              } 
              let peoples = []
             
            console.log(peoples)
            console.log(posts);
              console.log(photos);                 
               res.render('profile',{title : 'Profile', all_friends, session : req.session, posts : posts,friends_details : friends_details,date : getDetails.getDate,photos : photos})
            
         })
         .catch((err)=>{
            console.log(err);
         })    
      }
})
   
app.post('/profile',isLoggedIn,async(req,res)=>{

   if(req.body.type == 'tagged-peoples'){
      console.log('tagged people');
      let postId = req.body.post_id
      console.log(postId);
      let peoples = []
      Post.findById(postId)
      .then((post)=>{
         for(let i=0;i<post.tag_friends.length;i++){
            User.findById(post.tag_friends[i])
            .then((user)=>{
               let people = {
                  pic : user.profile_pic,
                  name : user.first_name + " " + user.last_name,
                  user_id : user._id,                 
               }
               peoples.push(people)
               if(i == post.tag_friends.length-1){
                  res.json({
                     status : true,
                     peoples : peoples,
                     friends : req.session.friends,
                     user_id : req.session.user_id,
                     request_sent : req.session.request_sent,
                  })
               }
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         }
         console.log(peoples)
        
      })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(req.body.type == 'comment-reply'){
      let comment = req.body.comment
      let postId = req.body.postId
      let userId = req.session.user_id
      User.findById(userId)
      .then((user)=>{
         Post.findById(postId)
         .then((post)=>{
            let comments = post.comments   
            let new_comment = {
               id : 'c' + Date.now(),
               user_id : user._id,
               comment : comment,
               replies : [],
            }
            comments.push(new_comment)
            Post.findByIdAndUpdate(postId,{comments : comments})
            .then(()=>{
               res.json({
                  added : true
               })
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         })
         })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(req.body.type == 'all-friend-tab'){
     
      let friends = await friend_details.getFriendsArray(req.session.user_id)
      
     
         res.json({
            status : true,
            friends : friends
         })
    

   }
   if(req.body.type == 'notification-change'){
      Notification.find({$and :[{seen: 'false'},{receiver_id : {$eq: req.body.user_id}}]})
      .then((notifications)=>{
         if(notifications.length>0){
            for(let i=0;i<notifications.length;i++){
               console.log('i');
               Notification.findByIdAndUpdate(notifications[i]._id,{seen : true})
               .then(()=>{
                  if(i == notifications.length-1){
                     res.json({
                        status : true
                     })
                  }
               })
               .catch((err)=>{
                  res.json({
                     error : err
                  })
               })
            }
         }
      })
      .catch((err)=>{
         console.log(err); 
      })
   }

   if(req.body.type == 'view-more'){
      Post.findById(req.body.postId)
      .then((post)=>{
         if(post.comments.length == 0){
            res.json({ 
               post,
               user_details : req.session,
            })
         }else{
                  const commentsUserIds = post.comments.map(item => item.user_id)
                  let repliesUserIds = []
                  for(let i = 0;i < post.comments.length;i++){
                     let ids = post.comments[i].replies.map(item => item.user_id)
                     repliesUserIds = [...repliesUserIds,...ids]
                  }

                  let userIds = commentsUserIds.concat(repliesUserIds)
                  let filteredUserIds = userIds.filter((item, pos) => userIds.indexOf(item) === pos)

                  let users_details = {}
                  User.find({_id : {$in : filteredUserIds}}).select('first_name last_name profile_pic')
                  .then((users) => {
                     for(let i = 0;i< users.length;i++){
                        users_details[users[i].id] = {
                           name : users[i].first_name + ' ' + users[i].last_name,
                           profile_pic : users[i].profile_pic
                        }

                        if(i == users.length - 1){
                           console.log(users_details);
                           res.json({
                              post,
                              user_details : req.session,
                              users_details
                           })
                        }
                     }
                  })
                  .catch((e) => {
                     console.log(e);
                  })

//             for(let i=0;i<post.comments.length;i++){
// console.log('comment');
//                // Problem issuee        
//                User.findById(post.comments[i].user_id)
//                .then((commentUser)=>{

//                   post.comments[i].commentUser = {
//                      name : commentUser.first_name + ' ' + commentUser.last_name,
//                      profile_pic : commentUser.profile_pic
//                   }
                  
//                   if(i == post.comments.length - 1 && post.comments[i].replies.length == 0){
//                      console.log('11');
//                      res.json({  
//                         post,
//                         user_details : req.session,
//                      })
//                   }
//                   if(post.comments[i].replies.length>0){
                    
//                      User.findById(post.comments[i].user_id)
//                      .then((commentUser)=>{
//                         post.comments[i].commentUser = {
//                            name : commentUser.first_name + ' ' + commentUser.last_name,
//                            profile_pic : commentUser.profile_pic
//                         }  
//                         for(let j=0;j<post.comments[i].replies.length;j++){
//                            console.log('replies');
//                            User.findById(post.comments[i].replies[j].user_id)
//                            .then((user)=>{
                             
//                               post.comments[i].replies[j].user = {
//                                  name : user.first_name + ' ' + user.last_name,
//                                  profile_pic : user.profile_pic
//                               }
//                               console.log(post.comments[i].replies.length-1);
//                               console.log(j);
//                               if(j == post.comments[i].replies.length-1){
//                                  console.log('12');
//                                  res.json({  
//                                     post,
//                                     user_details : req.session        
//                                  })
//                               }
                              
//                            })
//                            .catch((err)=>{
//                               console.log(err);
//                            })
//                         }
//                      })
//                      .catch((err)=>{
//                         console.log(err);
//                      })

//                   }
                  
//                }) 
//                .catch((err)=>{
//                   console.log(err);
//                })
//             }
         }
      })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(req.body.type == 'comment'){
      console.log('2');
      let comment = req.body.comment
      let postId = req.body.postId
      let userId = req.session.user_id
      User.findById(userId)
      .then((user)=>{
         Post.findById(postId)
         .then((post)=>{
            let comments = post.comments   
            let new_comment = {
               id : 'c' + Date.now(),
               user_id : user.id,
               comment : comment,
               replies : [],
            }
            comments.push(new_comment)
            Post.findByIdAndUpdate(postId,{comments : comments})
            .then(()=>{
               res.json({
                  added : true
               })
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         })
         })
      .catch((err)=>{
         console.log(err);
      })
      
   }

   if(req.body.type == 'reply-comment'){

      console.log('3');
      let reply = req.body.reply
      let postId = req.body.postId
      let commentId = req.body.commentId
     console.log(commentId);
      Post.findById(postId)
      .then((post)=>{                                      
              let commentIndex = post.comments.findIndex((item)=> item.id == commentId)       
               let reply_comment = {
                  user_id : req.session.user_id,
                  reply : reply,
                  comment_id : commentId,
                  id : 'r'+ Date.now()
               }
               let replies = post.comments[commentIndex].replies
               replies.push(reply_comment)

               post.comments[commentIndex].replies = replies
               console.log(post.comments[commentIndex]);

               Post.findByIdAndUpdate(postId,{comments : post.comments})
               .then(()=>{
                  res.json({
                     replied :true,
                     replies : post.comments
                  })
               })
               .catch((err)=>{
                  res.json({
                     error : err
                  })
               })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
      
   }

   if(req.body.type == 'only-text'){
      console.log('4');
      let {title} = req.body
     console.log(title);
      let id = req.session.user_id
         let new_post = new Post({
            title : title,
            type : 'text',
            user_id : req.session.user_id,
           
         })
         
         new_post.save()
         Post.findById(new_post._id.toString())
         .then((post)=>{
            let date = getDetails.getDate(post.createdAt)
            User.findById(req.session.user_id)
            .then((user)=>{
               res.json({
                  testPosted : true,
                  post : post,
                  user : user,
                  date : date 
               })

            })
            .catch((err)=>{
               res.json({
                  error : err
                  })
            })
         })
         .catch((err)=>{
            console.log(err);
         })
   }
   if(req.body.type == 'unlike'){
      console.log('5');
      let id = req.session.user_id
      let postId = req.body.postId
      Post.findById(postId)
      .then((post)=>{
         let likeArray = post.likes
         let updateLikeArray = likeArray.filter((item)=> item!=id)
         Post.findByIdAndUpdate(postId,{likes: updateLikeArray})
         .then(()=>{
            res.json({
               unliked : true
            })
         })
         .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(req.body.type == 'remove-img'){
      console.log('6');
      User.findByIdAndUpdate(req.session.user_id,{...req.body})
      .then(()=>{
         let image = req.body.profile_pic
         req.session.profile_pic = image
         res.json({
            removed : true
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }
   if(req.body.type == 'like'){
      console.log('7');
      let id = req.session.user_id
      let likedArray = []
      let postId = req.body.postId
      likedArray.push(id)
      Post.findByIdAndUpdate(postId,{likes : likedArray})
      .then(()=>{
         res.json({
            liked : true
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }

   if(req.body.type == 'post-images'){
      let post_id = req.body.postId
      Post.findById(post_id)
      .then((post)=>{
         res.json({
            post : post
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }
   if(req.body.type == 'text-photos'){
      console.log('hjcbs');
      let urls = req.body.urls
      console.log(urls);
      let title = req.body.title
      let new_post = new Post({
         type : 'text-photos',
         title : title,
         post_pics : urls,
         user_id : req.session.user_id,
          
      })
      new_post.save()
      console.log(new_post._id);
      Post.findById(new_post._id.toString())
      .then((post)=>{
         let date = getDetails.getDate(post.createdAt)
         User.findById(req.session.user_id)
         .then((user)=>{
            res.json({
               received : true,
               post : post,
               user : user,
               date : date
            })

         })
         .catch((err)=>{
            res.json({
               error : err
               })
         })
      })
      .catch((err)=>{
         console.log(err);
      })
   }
   if(req.body.type == "cancel"){
      console.log('9');
      let id = req.body.id
      let new_request_sent_array = req.session.request_sent.filter((item)=> item != id)

      User.findById(id)
      .then((user)=>{

         let requests = user.requests
         let new_requests_array = requests.filter((item)=> item != req.session.user_id)

         User.findByIdAndUpdate(id,{requests : new_requests_array})
         .then(()=>{

            User.findByIdAndUpdate(req.session.user_id,{request_sent : new_request_sent_array})
            .then(() => {
               req.session.request_sent = new_request_sent_array
               res.json({
                  cancel : true
               })
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })

         })
         .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
      //    User.findByIdAndUpdate({id : req.session.user_id},{request_sent : new_request_sent})
      //    .then(()=>{
      //       req.session.request_sent.destroy()
      //       res.json({cancel : true})
      //    })
      //    .catch((error) => {
      //       console.error('Error while deleting user information:', error);
      //       res.json({ error: 'Internal server error' });
      // })
      
      
   }

   if(req.body.type == 'delete'){
      console.log('10');
      let profile_pic = req.body.profile_pic
      let url = './public' +  req.session.profile_pic.split('localhost:3000')[1]

      if(req.session.profile_pic){
         fs.unlink(url,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
         });
      }
      User.findByIdAndUpdate({_id : req.session.user_id},{profile_pic : req.body.profile_pic})
      .then(()=>{
         req.session.profile_pic = req.body.profile_pic
         res.json({
            updated : true
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }

   if(req.body.type == "send" ){
      console.log('11');
      let requests = []
      let request_sent = req.session.request_sent
      User.findById(req.body.id)
      .then((user)=>{
         requests = user.requests
         requests.push(req.session.user_id)
         request_sent.push(req.body.id)
            User.findOneAndUpdate({_id : req.body.id},{requests})
            .then(() => {
   
               User.findOneAndUpdate({_id : req.session.user_id},{request_sent})
               .then(() => {
                  req.session.request_sent = request_sent
                  res.json({ sent: true});
               })
               .catch((error) => {
                     console.error('Error while updating user information:', error);
                     res.json({ error: 'Internal server error' });
               });
   
            })
            .catch((error) => {
                  console.error('Error while updating user information:', error);
                  res.json({ error: 'Internal server error' });
            }); 
   }) 
   }

   if(req.body.type == 'suggestion'){

      console.log('12');
      User.findById(req.session.user_id)
      .then((user)=>{
         let friends = user.friends
         let requests_sent = user.request_sent
         let requests = user.requests
         console.log(requests);
         User.find({_id : {$nin : [req.session.user_id,...friends,...requests_sent,...requests]}})
         .then((users)=>{
            console.log(users);
            res.json({
               users,
            })
         })
         .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      .catch((err)=>{
         console.log(err);
      })

     
   }

   if(req.body.type == 'requests'){
console.log('13');
            User.findById(req.session.user_id)
            .then((user)=>{
               let names = []
               let friend_requests = user.requests
               console.log(friend_requests);
               for(let i=0;i<friend_requests.length;i++){
                  User.findById(friend_requests[i])
                  .then((user)=>{
                     let name = user.first_name+" "+user.last_name
                     names.push(name)
                     if(i == friend_requests.length-1){
                        res.json({
                           friend_requests,
                           names
                        })
                     }
                  })
               }
                 
               
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
            
         
   }      
   
   if(req.body.type == 'changed' ){
      console.log('14');
   let profile_pic = req.body.profile_pic
   let url = './public' +  req.session.profile_pic.split('localhost:3000')[1]
   
   fs.unlink(url,function(err){
         if(err) return console.log(err);
         console.log('file deleted successfully');
      });
   
      User.findByIdAndUpdate({_id : req.session.user_id},{profile_pic : profile_pic})
      .then(()=>{
         req.session.profile_pic = profile_pic
         res.json({
            updated : true,
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })

   }

   if(req.body.type == 'decline'){
      console.log('15');
      let requests = req.session.requests
      
      let id = req.body.id
      console.log(id);
      let updateRequests = requests.filter((item)=> item != id)
      User.findById(id)
      .then((user)=>{
         let request_sent = user.request_sent
         let updateRequestSent = request_sent.filter((item)=> item != req.session.user_id)
         User.findByIdAndUpdate(id,{request_sent : updateRequestSent})
         .then(()=>{
            User.findByIdAndUpdate(req.session.user_id,{requests : updateRequests})
            .then(()=>{
               req.session.requests = updateRequests
               res.json({
                  declined : true
               })
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         })
         .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }

   if(req.body.type == 'accept'){
      console.log('1');
      User.findById(req.session.user_id)
      .then((user)=>{
         let requests = user.requests
         let friends = user.friends
         let id = req.body.id
         let updateRequests = requests.filter((item)=> item != id)
         let user_id = req.session.user_id.toString()
         friends.push(id)
         console.log(updateRequests);
         User.findOne({_id : req.body.id})
         .then((user)=>{   
            let request_sent = user.request_sent
            let updateRequestSent = request_sent.filter((item)=>item != user_id)
            console.log(updateRequestSent);
           let apponentFriend = user.friends
           apponentFriend.push(req.session.user_id)
            let notUserId = friends.filter((item)=> item != user_id)
            User.findByIdAndUpdate(req.session.user_id,{friends : notUserId, requests : updateRequests})
            .then(()=>{
               req.session.friends = notUserId
               req.session.requests = updateRequests
               User.findByIdAndUpdate(id,{friends : apponentFriend, request_sent : updateRequestSent})
               .then(()=>{
                  res.json({
                     accepted : true
                  })
               })
               .catch((err)=>{
                  res.json({
                     error : err
                  })
               })
            })
            .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      })
   }

})

app.get('/',isLoggedIn,async(req,res)=>{
   let friendDetails = await friend_details.getFriendsArray(req.session.user_id)
   User.findById(req.session.user_id)
   .then((user)=>{
      let friends = user.friends
      Post.find({user_id : {$in : friends}}).populate('user_id')
      .then((posts)=>{
         if(friends.length > 0 && posts.length>0){
            let postDetails = []
            for(let i=0;i<posts.length;i++){
               console.log('uhvs');
               User.findById(posts[i].user_id)
               .then((user)=>{
         
                  let postDetail = {
                     user_id : user._id, 
                     name : user.first_name +" "+ user.last_name,
                     pic : user.profile_pic
                  }
                  postDetails.push(postDetail)
                  console.log(postDetails);
                  if(i == posts.length-1){
                     console.log(postDetails.length);
                     res.render('home',{posts : posts,title:'Home',session : req.session,post_details : postDetails,friends_details : friendDetails,date : getDetails.getDate})
               }
            })
               .catch((err)=>{
                  console.log(err);
               })
              
              
            }
            console.log(postDetails);
               console.log(posts);
         }else{
            let posts = []
            res.render('home',{title:'Home',session : req.session,posts:posts,friends_details : friendDetails})
         }
          
             
         })
         .catch((err)=>{
             console.log(err);
         })
     
   })
   .catch((err)=>{
      console.log(err);
   })
   
})

app.post('/',(req,res)=>{
   if(req.body.type == 'comment-reply'){
      let comment = req.body.comment
      let postId = req.body.postId
      let userId = req.session.user_id
      User.findById(userId)
      .then((user)=>{
         Post.findById(postId)
         .then((post)=>{
            let comments = post.comments   
            let new_comment = {
               id : 'c' + Date.now(),
               user_id : user._id,
               comment : comment,
               replies : [],
            }
            comments.push(new_comment)
            Post.findByIdAndUpdate(postId,{comments : comments})
            .then(()=>{
               res.json({
                  added : true
               })
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         })
         })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(req.body.type == 'view-more'){
      Post.findById(req.body.postId)
      .then((post)=>{
         if(post.comments.length == 0){
            res.json({ 
               post,
               user_details : req.session,
            })
         }else{
                  const commentsUserIds = post.comments.map(item => item.user_id)
                  let repliesUserIds = []
                  for(let i = 0;i < post.comments.length;i++){
                     let ids = post.comments[i].replies.map(item => item.user_id)
                     repliesUserIds = [...repliesUserIds,...ids]
                  }

                  let userIds = commentsUserIds.concat(repliesUserIds)
                  let filteredUserIds = userIds.filter((item, pos) => userIds.indexOf(item) === pos)

                  let users_details = {}
                  User.find({_id : {$in : filteredUserIds}}).select('first_name last_name profile_pic')
                  .then((users) => {
                     for(let i = 0;i< users.length;i++){
                        users_details[users[i].id] = {
                           name : users[i].first_name + ' ' + users[i].last_name,
                           profile_pic : users[i].profile_pic
                        }

                        if(i == users.length - 1){
                           console.log(users_details);
                           res.json({
                              post,
                              user_details : req.session,
                              users_details
                           })
                        }
                     }
                  })
                  .catch((e) => {
                     console.log(e);
                  })
         }
      })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(req.body.type == 'comment'){
      console.log('2');
      let comment = req.body.comment
      let postId = req.body.postId
      let userId = req.session.user_id
      User.findById(userId)
      .then((user)=>{
         Post.findById(postId)
         .then((post)=>{
            let comments = post.comments   
            let new_comment = {
               id : 'c' + Date.now(),
               user_id : user._id,
               comment : comment,
               replies : [],
            }
            comments.push(new_comment)
            Post.findByIdAndUpdate(postId,{comments : comments})
            .then(()=>{
               res.json({
                  added : true
               })
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         })
         })
      .catch((err)=>{
         console.log(err);
      })
      
   }

   if(req.body.type == 'reply-comment'){

      console.log('3');
      let reply = req.body.reply
      let postId = req.body.postId
      let commentId = req.body.commentId
     console.log(commentId);
      Post.findById(postId)
      .then((post)=>{                                      
              let commentIndex = post.comments.findIndex((item)=> item.id == commentId)       
               let reply_comment = {
                  user_id : req.session.user_id,
                  reply : reply,
                  comment_id : commentId,
                  id : 'r'+ Date.now()
               }
               let replies = post.comments[commentIndex].replies
               replies.push(reply_comment)

               post.comments[commentIndex].replies = replies
               console.log(post.comments[commentIndex]);

               Post.findByIdAndUpdate(postId,{comments : post.comments})
               .then(()=>{
                  res.json({
                     replied :true,
                     replies : post.comments
                  })
               })
               .catch((err)=>{
                  res.json({
                     error : err
                  })
               })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
      
   }

   if(req.body.type == 'only-text'){
      console.log('4');
      console.log(req.body.date);
      let {title,date} = req.body
           console.log(title);
        
      let id = req.session.user_id
         let new_post = new Post({
            title : title,
            type : 'text',
            user_id : req.session.user_id,
          
            tag_friends : req.body.tag_friends,
            
         })
         
         new_post.save()
         .then((created)=>{
            Post.findById(created._id)
            .then((post)=>{
               res.json({
                  testPosted : true,
                  post
               })
            })
         })
         .catch((err)=>{
            res.json({
            error : err
            })
         })
   }
   if(req.body.type == 'unlike'){
      console.log('5');
      let id = req.session.user_id
      let postId = req.body.postId
      Post.findById(postId)
      .then((post)=>{
         let likeArray = post.likes
         let updateLikeArray = likeArray.filter((item)=> item!=id)
         Post.findByIdAndUpdate(postId,{likes: updateLikeArray})
         .then(()=>{
            res.json({
               unliked : true
            })
         })
         .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      .catch((err)=>{
         console.log(err);
      })
   }


   if(req.body.type == 'like'){
      console.log('7');
      let id = req.session.user_id
      let likedArray = []
      let postId = req.body.postId
      likedArray.push(id)
      Post.findByIdAndUpdate(postId,{likes : likedArray})
      .then(()=>{
         res.json({
            liked : true
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }

   if(req.body.type == 'post-images'){
      let post_id = req.body.postId
      Post.findById(post_id)
      .then((post)=>{
         res.json({
            post : post
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }
   if(req.body.type == 'text-photos'){
      console.log('hjcbs');

   
      let urls = req.body.urls
      console.log(urls);
      let title = req.body.title
      let new_post = new Post({
         type : 'text-photos',
         title : title,
         post_pics : urls,
         user_id : req.session.user_id,
         tag_friends : req.body.tag_friends,
      })
      new_post.save()
      .then(()=>{
         res.json({
            received : true
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }

   if(req.body.type == 'notification-change'){
      Notification.find({$and :[{seen: 'false'},{receiver_id : {$eq: req.body.user_id}}]})
      .then((notifications)=>{
         for(let i=0;notifications.length;i++){
            Notification.findByIdAndUpdate(notifications[i]._id,{seen : true})
            .then(()=>{
               if(i == notifications.length-1){
                  res.json({
                     status : true
                  })
               }
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         }
      })
      .catch((err)=>{
         
      })
   }
})
app.get('/logout',(req,res)=>{
   req.session.destroy()
   res.redirect('/login')
})

app.get('/messenger/:id',isLoggedIn,async(req,res)=>{
   let friendId = req.params.id
   let userId  = req.session.user_id
   let searchInput = req.query.search
      console.log(searchInput);
   let friends_details = await friend_details.getFriendsArray(req.session.user_id)
   console.log(friend_details.length);
   if(searchInput){
      friends_details = friends_details.filter((item)=> item.name == searchInput)
   }else{
      friends_details = await friend_details.getFriendsArray(req.session.user_id)
   }
      console.log(friend_details);
   Chat.find({$or:[{$and:[{reply_id : {$eq: userId},sender_id :{$eq: friendId} }]},{$and:[{reply_id : {$eq : friendId},sender_id : {$eq :userId}}]}]})
   .then((chats)=>{
      console.log(chats);
      let chatIds = chats.map(item => item.id,)
      // for(let i=0;i<chats.length;i++){
      //    chatIds.push(chats[i]._id.toString())
      // }
      for(let i=0;i<chatIds.length;i++){
         if(chats[i].userId == chats[i].friendId){
            Chat.findByIdAndUpdate(chatIds[i],{status : true})
            .then(()=>{
   
            })
            .catch((err)=>{
               console.log(err);
            })
         }
      }
      console.log(chatIds);
      console.log(chats);
      User.findById(friendId)
      .then((user)=>{
         res.render('messenger',{title:'Messenger',session:req.session,friends_details,user,friend_id:friendId,chats:chats,is_online : req.session.is_online})
      })
   })
   .catch((err)=>{
      console.log(err);
   })
})
app.post('/messenger/:id',isLoggedIn,async(req,res)=>{
 
   let {type} = req.body
   if(type == 'text'){
      let new_chat = new Chat({
         reply_id : req.body.user_id,
         sender_id : req.body.friend_id,
         message : req.body.message,
         time : getDetails.getTime(req.body.time).toLowerCase(),
         status : req.body.status
      })
      new_chat.save()
      .then(()=>{
         res.json({
         })
      })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(type == 'text-photo'){
      let new_chat = new Chat({
         reply_id : req.body.user_id,
         sender_id : req.body.friend_id,
         message : req.body.message,
         time : getDetails.getTime(req.body.time).toLowerCase(),
         images : req.body.images,
         status : req.body.status
      })
      new_chat.save()
      .then(()=>{
         res.json({
         })
      })
      .catch((err)=>{
         console.log(err);
      })
   }
   if(req.body.type == 'notification-change'){
      Notification.find({$and :[{seen: 'false'},{receiver_id : {$eq: req.body.user_id}}]})
      .then((notifications)=>{
         for(let i=0;notifications.length;i++){
            Notification.findByIdAndUpdate(notifications[i]._id,{seen : true})
            .then(()=>{
               if(i == notifications.length-1){
                  res.json({
                     status : true
                  })
               }
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         }
      })
      .catch((err)=>{
         
      })
   }
})

app.get('/messengerhome',isLoggedIn,async(req,res)=>{
   let friends_details = await friend_details.getFriendsArray(req.session.user_id)
   let searchInput = req.query.search
   if(searchInput){
      friends_details = friends_details.filter((item)=> item.name == searchInput)
   }else{
      friends_details = await friend_details.getFriendsArray(req.session.user_id)
   }
   console.log(searchInput);
   Chat.find({status : false})
   .then((chats)=>{
      res.render('messengerhome',{title:'Messenger',session:req.session,friends_details,chats : chats})
   })

})

app.post('/messengerhome',isLoggedIn,async(req,res)=>{
   if(req.body.type == 'notification-change'){
      Notification.find({$and :[{seen: 'false'},{receiver_id : {$eq: req.body.user_id}}]})
      .then((notifications)=>{
         for(let i=0;notifications.length;i++){
            Notification.findByIdAndUpdate(notifications[i]._id,{seen : true})
            .then(()=>{
               if(i == notifications.length-1){
                  res.json({
                     status : true
                  })
               }
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         }
      })
      .catch((err)=>{
         
      })
   }
})

app.get('/test',(req,res)=>{
   res.render('test')
})

app.delete('/postdelete/:id',(req,res)=>{
   let post_id = req.params.id
   Post.findById(post_id)
   .then((post)=>{
      let images = post.post_pics
      if(images.length>0){
         for(let i=0;i<images.length;i++){
            let image = './public' + images[i].split('http://localhost:3000')[1]
            console.log(image);  
            fs.unlink(image,function(err){
               if(err) return console.log(err);
               console.log('file deleted successfully');
            });
         }
      }
         Post.findByIdAndDelete(post_id)
         .then(()=>{
            res.json({
               status : true
            })
         })
         .catch((err)=>{
            res.json({
               error : err
            })
         })
      
   })
   .catch((err)=>{
      console.log(err);
   })
  
})

app.get('/profile/:id',isLoggedIn,async (req,res)=>{
   let id = req.params.id
   console.log(req.session.user_id);
   let friends_details = await friend_details.getFriendsArray(id)
   
      if(friends_details.length>0){
         friends_details = friends_details
      }else{
         friends_details = []
      }


         
      if(friends_details.length == 0){
         
         Post.find({user_id :  id})
               .then((posts)=>{ 
                   res.render('personprofile',{title : 'Profile', session : req.session.user_id, posts : posts,friends_details : friends_details,date : getDetails.getDate})
         })
         .catch((err)=>{
         console.log(err);
      })
      }else{
         console.log('friends');
       
         Post.find({$or:[{tag_friends : {$in : id}},{user_id : id}]}).populate('user_id')
         .then((posts)=>{ 
           
            let photos = []
              for(let i=0;i<posts.length;i++){
                  photos.push(...posts[i].post_pics)
              }  
              User.findById(id)
              .then((detail)=>{                
               res.render('personprofile',{title : 'Profile', session : req.session, posts : posts,friends_details : friends_details,date : getDetails.getDate,photos : photos,user:detail})
            })
            .catch((err)=>{
               console.log(err);
            })
            
         })
         .catch((err)=>{
            console.log(err);
         })    
      }
})

app.post('/profile/:id',isLoggedIn,async (req,res)=>{
   if(req.body.type == 'tagged-peoples'){
      console.log('tagged people');
      let postId = req.body.post_id
      console.log(postId);
      let peoples = []
      Post.findById(postId)
      .then((post)=>{
         for(let i=0;i<post.tag_friends.length;i++){
            User.findById(post.tag_friends[i])
            .then((user)=>{
               let people = {
                  pic : user.profile_pic,
                  name : user.first_name + " " + user.last_name,
                  user_id : user._id,                 
               }
               peoples.push(people)
               if(i == post.tag_friends.length-1){
                  res.json({
                     status : true,
                     peoples : peoples,
                     friends : req.session.friends,
                     user_id : req.session.user_id
                  })
               }
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         }
         console.log(peoples)
        
      })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(req.body.type == 'comment-reply'){
      let comment = req.body.comment
      let postId = req.body.postId
      let userId = req.session.user_id
      User.findById(userId)
      .then((user)=>{
         Post.findById(postId)
         .then((post)=>{
            let comments = post.comments   
            let new_comment = {
               id : 'c' + Date.now(),
               user_id : user._id,
               comment : comment,
               replies : [],
            }
            comments.push(new_comment)
            Post.findByIdAndUpdate(postId,{comments : comments})
            .then(()=>{
               res.json({
                  added : true
               })
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         })
         })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(req.body.type == 'all-friend-tab'){
     
      let friends = await friend_details.getFriendsArray(req.session.user_id)
      
     
         res.json({
            status : true,
            friends : friends
         })
    

   }
   if(req.body.type == 'notification-change'){
      Notification.find({$and :[{seen: 'false'},{receiver_id : {$eq: req.body.user_id}}]})
      .then((notifications)=>{
         if(notifications.length>0){
            for(let i=0;i<notifications.length;i++){
               console.log('i');
               Notification.findByIdAndUpdate(notifications[i]._id,{seen : true})
               .then(()=>{
                  if(i == notifications.length-1){
                     res.json({
                        status : true
                     })
                  }
               })
               .catch((err)=>{
                  res.json({
                     error : err
                  })
               })
            }
         }
      })
      .catch((err)=>{
         console.log(err); 
      })
   }

   if(req.body.type == 'view-more'){
      Post.findById(req.body.postId)
      .then((post)=>{
         if(post.comments.length == 0){
            res.json({ 
               post,
               user_details : req.session,
            })
         }else{
                  const commentsUserIds = post.comments.map(item => item.user_id)
                  let repliesUserIds = []
                  for(let i = 0;i < post.comments.length;i++){
                     let ids = post.comments[i].replies.map(item => item.user_id)
                     repliesUserIds = [...repliesUserIds,...ids]
                  }

                  let userIds = commentsUserIds.concat(repliesUserIds)
                  let filteredUserIds = userIds.filter((item, pos) => userIds.indexOf(item) === pos)

                  let users_details = {}
                  User.find({_id : {$in : filteredUserIds}}).select('first_name last_name profile_pic')
                  .then((users) => {
                     for(let i = 0;i< users.length;i++){
                        users_details[users[i].id] = {
                           name : users[i].first_name + ' ' + users[i].last_name,
                           profile_pic : users[i].profile_pic
                        }

                        if(i == users.length - 1){
                           console.log(users_details);
                           res.json({
                              post,
                              user_details : req.session,
                              users_details
                           })
                        }
                     }
                  })
                  .catch((e) => {
                     console.log(e);
                  })

//             for(let i=0;i<post.comments.length;i++){
// console.log('comment');
//                // Problem issuee        
//                User.findById(post.comments[i].user_id)
//                .then((commentUser)=>{

//                   post.comments[i].commentUser = {
//                      name : commentUser.first_name + ' ' + commentUser.last_name,
//                      profile_pic : commentUser.profile_pic
//                   }
                  
//                   if(i == post.comments.length - 1 && post.comments[i].replies.length == 0){
//                      console.log('11');
//                      res.json({  
//                         post,
//                         user_details : req.session,
//                      })
//                   }
//                   if(post.comments[i].replies.length>0){
                    
//                      User.findById(post.comments[i].user_id)
//                      .then((commentUser)=>{
//                         post.comments[i].commentUser = {
//                            name : commentUser.first_name + ' ' + commentUser.last_name,
//                            profile_pic : commentUser.profile_pic
//                         }  
//                         for(let j=0;j<post.comments[i].replies.length;j++){
//                            console.log('replies');
//                            User.findById(post.comments[i].replies[j].user_id)
//                            .then((user)=>{
                             
//                               post.comments[i].replies[j].user = {
//                                  name : user.first_name + ' ' + user.last_name,
//                                  profile_pic : user.profile_pic
//                               }
//                               console.log(post.comments[i].replies.length-1);
//                               console.log(j);
//                               if(j == post.comments[i].replies.length-1){
//                                  console.log('12');
//                                  res.json({  
//                                     post,
//                                     user_details : req.session        
//                                  })
//                               }
                              
//                            })
//                            .catch((err)=>{
//                               console.log(err);
//                            })
//                         }
//                      })
//                      .catch((err)=>{
//                         console.log(err);
//                      })

//                   }
                  
//                }) 
//                .catch((err)=>{
//                   console.log(err);
//                })
//             }
         }
      })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(req.body.type == 'comment'){
      console.log('2');
      let comment = req.body.comment
      let postId = req.body.postId
      let userId = req.session.user_id
      User.findById(userId)
      .then((user)=>{
         Post.findById(postId)
         .then((post)=>{
            let comments = post.comments   
            let new_comment = {
               id : 'c' + Date.now(),
               user_id : user.id,
               comment : comment,
               replies : [],
            }
            comments.push(new_comment)
            Post.findByIdAndUpdate(postId,{comments : comments})
            .then(()=>{
               res.json({
                  added : true
               })
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         })
         })
      .catch((err)=>{
         console.log(err);
      })
      
   }

   if(req.body.type == 'reply-comment'){

      console.log('3');
      let reply = req.body.reply
      let postId = req.body.postId
      let commentId = req.body.commentId
     console.log(commentId);
      Post.findById(postId)
      .then((post)=>{                                      
              let commentIndex = post.comments.findIndex((item)=> item.id == commentId)       
               let reply_comment = {
                  user_id : req.session.user_id,
                  reply : reply,
                  comment_id : commentId,
                  id : 'r'+ Date.now()
               }
               let replies = post.comments[commentIndex].replies
               replies.push(reply_comment)

               post.comments[commentIndex].replies = replies
               console.log(post.comments[commentIndex]);

               Post.findByIdAndUpdate(postId,{comments : post.comments})
               .then(()=>{
                  res.json({
                     replied :true,
                     replies : post.comments
                  })
               })
               .catch((err)=>{
                  res.json({
                     error : err
                  })
               })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
      
   }

   if(req.body.type == 'only-text'){
      console.log('4');
      let {title} = req.body
     console.log(title);
      let id = req.session.user_id
         let new_post = new Post({
            title : title,
            type : 'text',
            user_id : req.session.user_id,
           
         })
         
         new_post.save()
         Post.findById(new_post._id.toString())
         .then((post)=>{
            let date = getDetails.getDate(post.createdAt)
            User.findById(req.session.user_id)
            .then((user)=>{
               res.json({
                  testPosted : true,
                  post : post,
                  user : user,
                  date : date 
               })

            })
            .catch((err)=>{
               res.json({
                  error : err
                  })
            })
         })
         .catch((err)=>{
            console.log(err);
         })
   }
   if(req.body.type == 'unlike'){
      console.log('5');
      let id = req.session.user_id
      let postId = req.body.postId
      Post.findById(postId)
      .then((post)=>{
         let likeArray = post.likes
         let updateLikeArray = likeArray.filter((item)=> item!=id)
         Post.findByIdAndUpdate(postId,{likes: updateLikeArray})
         .then(()=>{
            res.json({
               unliked : true
            })
         })
         .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      .catch((err)=>{
         console.log(err);
      })
   }

   if(req.body.type == 'remove-img'){
      console.log('6');
      User.findByIdAndUpdate(req.session.user_id,{...req.body})
      .then(()=>{
         let image = req.body.profile_pic
         req.session.profile_pic = image
         res.json({
            removed : true
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }
   if(req.body.type == 'like'){
      console.log('7');
      let id = req.session.user_id
      let likedArray = []
      let postId = req.body.postId
      likedArray.push(id)
      Post.findByIdAndUpdate(postId,{likes : likedArray})
      .then(()=>{
         res.json({
            liked : true
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }

   if(req.body.type == 'post-images'){
      let post_id = req.body.postId
      Post.findById(post_id)
      .then((post)=>{
         res.json({
            post : post
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }
   if(req.body.type == 'text-photos'){
      console.log('hjcbs');
      let urls = req.body.urls
      console.log(urls);
      let title = req.body.title
      let new_post = new Post({
         type : 'text-photos',
         title : title,
         post_pics : urls,
         user_id : req.session.user_id,
          
      })
      new_post.save()
      console.log(new_post._id);
      Post.findById(new_post._id.toString())
      .then((post)=>{
         let date = getDetails.getDate(post.createdAt)
         User.findById(req.session.user_id)
         .then((user)=>{
            res.json({
               received : true,
               post : post,
               user : user,
               date : date
            })

         })
         .catch((err)=>{
            res.json({
               error : err
               })
         })
      })
      .catch((err)=>{
         console.log(err);
      })
   }
   if(req.body.type == "cancel"){
      console.log('9');
      let id = req.body.id
      let new_request_sent_array = req.session.request_sent.filter((item)=> item != id)

      User.findById(id)
      .then((user)=>{

         let requests = user.requests
         let new_requests_array = requests.filter((item)=> item != req.session.user_id)

         User.findByIdAndUpdate(id,{requests : new_requests_array})
         .then(()=>{

            User.findByIdAndUpdate(req.session.user_id,{request_sent : new_request_sent_array})
            .then(() => {
               req.session.request_sent = new_request_sent_array
               res.json({
                  cancel : true
               })
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })

         })
         .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
      //    User.findByIdAndUpdate({id : req.session.user_id},{request_sent : new_request_sent})
      //    .then(()=>{
      //       req.session.request_sent.destroy()
      //       res.json({cancel : true})
      //    })
      //    .catch((error) => {
      //       console.error('Error while deleting user information:', error);
      //       res.json({ error: 'Internal server error' });
      // })
      
      
   }

   if(req.body.type == 'delete'){
      console.log('10');
      let profile_pic = req.body.profile_pic
      let url = './public' +  req.session.profile_pic.split('localhost:3000')[1]

      if(req.session.profile_pic){
         fs.unlink(url,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
         });
      }
      User.findByIdAndUpdate({_id : req.session.user_id},{profile_pic : req.body.profile_pic})
      .then(()=>{
         req.session.profile_pic = req.body.profile_pic
         res.json({
            updated : true
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }

   if(req.body.type == "send" ){
      console.log('11');
      let requests = []
      let request_sent = req.session.request_sent
      User.findById(req.body.id)
      .then((user)=>{
         requests = user.requests
         requests.push(req.session.user_id)
         request_sent.push(req.body.id)
            User.findOneAndUpdate({_id : req.body.id},{requests})
            .then(() => {
   
               User.findOneAndUpdate({_id : req.session.user_id},{request_sent})
               .then(() => {
                  req.session.request_sent = request_sent
                  res.json({ sent: true });
               })
               .catch((error) => {
                     console.error('Error while updating user information:', error);
                     res.json({ error: 'Internal server error' });
               });
   
            })
            .catch((error) => {
                  console.error('Error while updating user information:', error);
                  res.json({ error: 'Internal server error' });
            }); 
   }) 
   }

   if(req.body.type == 'suggestion'){

      console.log('12');
      User.findById(req.session.user_id)
      .then((user)=>{
         let friends = user.friends
         let requests_sent = user.request_sent
         let requests = user.requests
         console.log(requests);
         User.find({_id : {$nin : [req.session.user_id,...friends,...requests_sent,...requests]}})
         .then((users)=>{
            console.log(users);
            res.json({
               users,
            })
         })
         .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      .catch((err)=>{
         console.log(err);
      })

     
   }

   if(req.body.type == 'requests'){
console.log('13');
            User.findById(req.session.user_id)
            .then((user)=>{
               let names = []
               let friend_requests = user.requests
               console.log(friend_requests);
               for(let i=0;i<friend_requests.length;i++){
                  User.findById(friend_requests[i])
                  .then((user)=>{
                     let name = user.first_name+" "+user.last_name
                     names.push(name)
                     if(i == friend_requests.length-1){
                        res.json({
                           friend_requests,
                           names
                        })
                     }
                  })
               }
                 
               
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
            
         
   }      
   
   if(req.body.type == 'changed' ){
      console.log('14');
   let profile_pic = req.body.profile_pic
   let url = './public' +  req.session.profile_pic.split('localhost:3000')[1]
   
   fs.unlink(url,function(err){
         if(err) return console.log(err);
         console.log('file deleted successfully');
      });
   
      User.findByIdAndUpdate({_id : req.session.user_id},{profile_pic : profile_pic})
      .then(()=>{
         req.session.profile_pic = profile_pic
         res.json({
            updated : true,
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })

   }

   if(req.body.type == 'decline'){
      console.log('15');
      let requests = req.session.requests
      
      let id = req.body.id
      console.log(id);
      let updateRequests = requests.filter((item)=> item != id)
      User.findById(id)
      .then((user)=>{
         let request_sent = user.request_sent
         let updateRequestSent = request_sent.filter((item)=> item != req.session.user_id)
         User.findByIdAndUpdate(id,{request_sent : updateRequestSent})
         .then(()=>{
            User.findByIdAndUpdate(req.session.user_id,{requests : updateRequests})
            .then(()=>{
               req.session.requests = updateRequests
               res.json({
                  declined : true
               })
            })
            .catch((err)=>{
               res.json({
                  error : err
               })
            })
         })
         .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      .catch((err)=>{
         res.json({
            error : err
         })
      })
   }

   if(req.body.type == 'accept'){
      console.log('1');
      User.findById(req.session.user_id)
      .then((user)=>{
         let requests = user.requests
         let friends = user.friends
         let id = req.body.id
         let updateRequests = requests.filter((item)=> item != id)
         let user_id = req.session.user_id.toString()
         friends.push(id)
         console.log(updateRequests);
         User.findOne({_id : req.body.id})
         .then((user)=>{   
            let request_sent = user.request_sent
            let updateRequestSent = request_sent.filter((item)=>item != user_id)
            console.log(updateRequestSent);
           let apponentFriend = user.friends
           apponentFriend.push(req.session.user_id)
            let notUserId = friends.filter((item)=> item != user_id)
            User.findByIdAndUpdate(req.session.user_id,{friends : notUserId, requests : updateRequests})
            .then(()=>{
               req.session.friends = notUserId
               req.session.requests = updateRequests
               User.findByIdAndUpdate(id,{friends : apponentFriend, request_sent : updateRequestSent})
               .then(()=>{
                  res.json({
                     accepted : true
                  })
               })
               .catch((err)=>{
                  res.json({
                     error : err
                  })
               })
            })
            .catch((err)=>{
            res.json({
               error : err
            })
         })
      })
      })
   }
})

// 