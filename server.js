console.log('running')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://yoda:babyyoda@cluster0.ca0uj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbName = "palindrome";

function checkPalindrome(word) {
    if (word === '') {
        return `Enter word`
    } else if (word.toLowerCase() == word.toLowerCase().split('').reverse().join('')) {
        return true
    } else {
        return false
    }
}

app.listen(3000, () => {
    console.log('listening')
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });

});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))



app.get('/', (req, res) => {
   
    db.collection('words').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.ejs', {word: result})
    })
  })
  

app.post('/words', (req, res) => {
    let userword = req.body.word
    //palindrome condition 
    let result = checkPalindrome(userword) ? "is a palindrome" : "is not a palindrome"
    if(userword === ""){
        result = "enter a word"
    }

 
    console.log(result)
    db.collection('words').insertOne({ 
        word: req.body.word, 
        palindrome: result
    }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})
