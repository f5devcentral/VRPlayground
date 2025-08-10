const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/tempdb';

// Add Users To MongoDB
const users = [
    [1, 'admin', 'admin'],
    [2, 'user', 'user'],
    [3, 'guest', 'guest'],
];

const UserSchema = new mongoose.Schema({
    id: Number,
    username: String,
    password: String
});

const User = mongoose.model('User', UserSchema);

async function init() {
    await mongoose.connect(MONGODB_URL);

    await User.bulkWrite(
        users.map(([id, username, password]) =>
            ({
                updateOne: {
                    filter: {id: id},
                    update: {
                        $set: {
                            username: username,
                            password: password
                        }
                    },
                    upsert: true
                }
            })
        )
    )
}

module.exports = {
    init,
    User,
}
