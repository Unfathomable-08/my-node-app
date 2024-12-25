const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const User = require('./database.js');
const QuizDB = require('./quizDB.js');
const TestDB = require('./testDB.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', './public');

//homepage

app.get('/', (req, res)=>{
    let verified = req.cookies.token ? jwt.verify(req.cookies.token, process.env.secret) : false;
    if (verified){
        const decoded = jwt.decode(req.cookies.token);
        res.render('home', {username: decoded.username});
    }
    else {
        res.redirect('/signup');
    }
});

//signup page

app.get('/signup', (req, res)=>{
    res.render('signup');
});

//signup form submitted

app.post('/signup', async (req, res)=>{
    existingUser = await User.findOne({ username: req.body.username });
    
    if (existingUser){
        const match = await bcrypt.compare(req.body.password, existingUser.password);
        if (match){
            const token = jwt.sign({ username: existingUser.username }, process.env.secret, { expiresIn: '10d' });
            res.cookie('token', token, {httpOnly: true, secure: true});
            return res.redirect(`/marks?userame=${req.body.username}`);
        }
        else {
            res.redirect('/signup?message=Username already exist with different password');
        }
    }
    else {
        const hashed = await bcrypt.hash(req.body.password, 10);
    
        const newUser = new User({
            username: req.body.username,
            country: req.body.country,
            password: hashed
        });
        await User.collection.insertOne(newUser);
        
        const token = jwt.sign({ username: newUser.username }, process.env.secret, { expiresIn: '1d' });
        res.cookie('token', token, {httpOnly: true, secure:true});
        res.redirect('/');
    }

});

//options submitted

app.post('/optionsSubmit', async (req, res)=>{
    await QuizDB.collection.insertOne(req.body);
    res.redirect(`/marks?userame=${req.body.username}`);
});

//quiz page

app.get('/quizzes', (req, res)=>{
    const username = req.query.username
    res.render('quizzes', {username});
})

//marks page

app.get('/marks', async (req, res)=>{
    const data = [];
    const real = await QuizDB.findOne({ username: req.query.username });
    const results = await TestDB.find({ person: req.query.username });
    results.forEach(result => {
        let marks = 0;

        for(let i=1; i<=10; i++){
            if(result['question'+i] === real['question'+i]){
                marks++;
            }
        }

        data.push({
            username: result.username,
            marks: marks
        });
    });

    res.render('marks', {data});
});

//test submitted

app.post('/quizzesSubmit', async (req, res)=>{
    await TestDB.collection.insertOne(req.body);
    res.redirect(`/result?username=${req.body.person}&person=${req.body.username}`);
});

//result shown 

app.get('/result', async (req, res)=>{
    let marks = 0;
    const real = await QuizDB.findOne({ username: req.query.username });
    const result = await TestDB.findOne({ username: req.query.person });

    for(let i=1; i<=10; i++){
        if(result['question'+i] === real['question'+i]){
            marks++;
        }
    }

    res.render('result', {marks});
});

app.listen(port, ()=>{
    console.log("Running on port 5500");
});