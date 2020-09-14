import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    message: String,
    name: String,
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms'}
}, {timestamps: true});

export default mongoose.model('messages', messageSchema)