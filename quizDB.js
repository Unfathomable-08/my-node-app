const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.uri;

(async () => {mongoose.connect(uri, {
    serverSelectionTimeoutMS: 60000,
})
    .then(console.log('Quizdb connected'))
    .catch(err => console.log(err));
})();

const schema = mongoose.Schema({
    id : {
        type: String,
        default: ()=>new mongoose.Types.ObjectId().toString()
    },
    username : {
        type: String,
        require: true
    },
    question1 : {
        type: String,
        require: true
    },
    question2 : {
        type: String,
        require: true
    },
    question3 : {
        type: String,
        require: true
    },
    question4 : {
        type: String,
        require: true
    },
    question5 : {
        type: String,
        require: true
    },
    question6 : {
        type: String,
        require: true
    },
    question7 : {
        type: String,
        require: true
    },
    question8 : {
        type: String,
        require: true
    },
    question9 : {
        type: String,
        require: true
    },
    question10 : {
        type: String,
        require: true
    }
});

const QuizDB = mongoose.model('quizResult', schema);

module.exports = QuizDB;