const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.uri;

(async () => {await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 60000
})
    .then(console.log('db connected'))
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
    country : {
        type: String,
        require: true
    },
    password : {
        type: String,
        require: true
    }
});

const User = mongoose.model('quizSignUp', schema);

module.exports = User;