const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017/star-wars-quotes'

mongoose.connect(url, { useNewUrlParser: true })
.then(client => {
    // ...
    const db = mongoose.connection
    const quotesCollection = db.collection('quotes')
    
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    
    app.use(bodyParser.json())//accepting the put data
    app.use(express.static('public'))

    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()

      .then(results => {
        res.render('index.ejs', { quotes: results })
      })
      .catch(error => console.error(error))
      
      })
    

    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
          .then(result => {
            res.redirect('/')
          })
          .catch(error => console.error(error))
      })
      app.put('/quotes', (req, res) => {//hadling put req with put method
        quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
        $set: {
        name: req.body.name,
        quote: req.body.quote
        }
        },
        {
        upsert: false
        }
        )
        .then(result => {
        res.json('Sucess')
        })
        .catch(error => console.error(error))
  })
      app.listen(3000, function() {
        console.log('listening on 3000')
      })
        app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    })

})
.catch(console.error)
