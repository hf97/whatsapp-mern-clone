import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import cors from 'cors';
import Messages from './dbMessages2.js';

const app = express();
const port = process.env.PORT || 9000;

//pusher connect
const pusher = new Pusher({
    appId: '1068491',
    key: '11fec21494d2e5de8b19',
    secret: '30c39937ddd7fdec6453',
    cluster: 'eu',
    encrypted: true
});

//to make json insted of just id
app.use(express.json());
//to do same as bellow
app.use(cors());

//just for this exemple
//No security
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', '*');
//     next();
// })

//conenct db
const connection_url = 'mongodb+srv://admin:pV7MO5ctx6Yt62Ql@cluster0.vbzq6.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection

//data stream with pusher
db.once('open', () => {
    console.log("DB connected");

    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log(change);
        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            });
        }else{
            console.log("Error triggering Pusher");
        }
    });
})

//check if is running
app.get('/', (req, res) => res.status(200).send('hello world'));

//get messages
app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

//create new message
app.post('/messages/new', (req, res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(`New message created: ${data}`)
        }
    })
})

app.listen(port, ()=>console.log(`Listening on localhost: ${port}`));