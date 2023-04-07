const express = require('express')
const Post = require('../models/Post.js')
const router = express.Router()

router.get('/' , (req,res) => {
    Post.find((err,docs) => {
        if(err) console.log(err)
        res.json(docs)
    })
})

router.post('/',(req,res) => {
    const post = new Post(req.body)
    post.save((err,doc) => {
        if(err) console.log(err)
        res.json(doc)
    })
})

router.put('/:id',(req,res) => {
    Post.findOneAndUpdate({
        _id : req.params.id
    },req.body,{
        new : true
    },(err,doc) => {
        if(err) console.log(err)
        res.json(doc)
    })
})

router.delete('/:id',(req,res) => {
    Post.findByIdAndDelete(req.params.id,(err,doc) => {
        if(err) console.log(err)
        res.json(doc)
    })
})

module.exports = router