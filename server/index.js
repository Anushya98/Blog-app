const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const { connect } = require('http2');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads', express.static(__dirname + '/uploads'));
const connectDatabase = () => {
  mongoose.connect('mongodb+srv://admin:Wdk8U6stuG80LCir@cluster0.5f3a56e.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(con => {
    console.log("Database Connected")
  })
}

connectDatabase();
app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const token = jwt.sign({ username,id:userDoc._id}, secret, token );
  console.log(token);
  res.json({jwt: token});

  // const passOk = bcrypt.compareSync(password, userDoc.password);
  // if (passOk) {
  //   // logged in
  //   jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
  //     console.log(token)
  //     if (err) throw err;
  //     res.cookie('token', token).json({
  //       id:userDoc._id,
  //       username,
  //     });
  //   });
  // } else {
  //   res.status(400).json('wrong credentials');
  // }
});

// app.get('/profile', (req,res) => {
//   const {token} = req.token;
//   jwt.verify(token, secret, {}, (err,info) => {
//     if (err) throw err;
//     res.json(info);
//   });
// });


app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);


  const {token} = req.token;
  jwt.verify(token, secret, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });
    res.json(postDoc);
  });

});


app.put('/post/:id',uploadMiddleware.single('file'), async (req,res) => {
  let newPath;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.token;
  jwt.verify(token, secret, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const updatePost = await Post.findByIdAndUpdate(req.params.id);
    const isAuthor = JSON.stringify(updatePost.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await updatePost({
      title,
      summary,
      content,
      cover: newPath ? newPath : updatePost.cover,
    });

    res.json(updatePost);
  });

});

app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})


app.delete('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})



app.listen(4000, () => {
  console.log("Server is running on port 4000")
});
//
