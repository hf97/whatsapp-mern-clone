import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import cors from 'cors';
import rooms from './dbRooms.js';
import messages from './dbMessages.js';

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());

// connect to db
const connection_url = 'mongodb+srv://admin:yxEaVXJ86nyf6oup@cluster0.zhln6.mongodb.net/<whatsapp-mern-db>?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;


//pusher
const pusher = new Pusher({
    appId: '1071301',
    key: '96ee846e6ca898a809de',
    secret: '0bd8660421cdc3de8491',
    cluster: 'eu',
    encrypted: true
});

db.once('open', () => {
    console.log("DB connected");

    const msgCollectionR = db.collection('rooms');
    const changeStreamR = msgCollectionR.watch();

    changeStreamR.on('change', (change) => {
        //new room
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('pRooms', 'inserted', {
                _id: messageDetails._id,
                name: messageDetails.name,
                img_url: messageDetails.img_url,
                messages: messageDetails.messages,
            });
        } else {
            console.log("Error triggering Pusher");
        }
    })

    const msgCollectionM = db.collection('messages');
    const changeStreamM = msgCollectionM.watch();

    changeStreamM.on('change', (change) => {
        //new message
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('pMessages', 'inserted', {
                _id: messageDetails._id,
                message: messageDetails.message,
                name: messageDetails.name,
                room: messageDetails.room,
                updatedAt: messageDetails.updatedAt,
            });
        } else {
            console.log("Error triggering Pusher");
        }
    })
})


// health check
app.get('/', (req, res) => res.status(200).send('Hello World!'));

// get all rooms
app.get('/get/rooms', (req, res) => {
    rooms.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

// get all messages
app.get('/get/messages', (req, res) => {
    messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

//find room
app.get('/get/rooms/:roomId', (req, res) => {
    rooms.find({ _id: req.params.roomId }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

//get message
app.get('/get/messages/:messageId', (req, res) => {
    messages.find({ _id: req.params.messageId }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

//get messages by room
app.get('/get/messages/room/:roomId', (req, res) => {
    messages.find({ room: req.params.roomId }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

//get last message from roomId
app.get('/:roomId/lastmessage', (req, res) => {
    messages.find({ room: req.params.roomId }, {}, { sort: { 'updatedAt' : -1 } }, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data[0])
        }
    })
})


// create new room
app.post('/new/room', (req, res) => {
    const dbMessage = req.body
    rooms.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(`New room created: ${data}`)
        }
    })
})

// create new message
app.post('/new/message', (req, res) => {
    const dbMessage = req.body
    messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(`New message created: ${data}`)
        }
    })
})




// add new message to a room
// app.post('/:roomId/message/new', (req, res) => {
//     const message = req.body
//     rooms.update({ _id: req.params.roomId }, { $push: { "messages": message } }, (err, data) => {
//         if (err) {
//             res.status(500).send(err)
//         } else {
//             res.status(201).send(`New message created: ${data}`)
//         }
//     })
// })


// listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`));