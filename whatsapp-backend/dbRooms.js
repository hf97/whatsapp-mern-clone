import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
    name: String,
    img_url: String,
})

export default mongoose.model('rooms', roomSchema)