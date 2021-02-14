import Axios from 'axios';
import Config from "react-native-config";

const BASE_URL = 'https://fcm.googleapis.com/fcm/send';

export function sendNotification(token, message) {
    return () => {
        Axios.post(BASE_URL, 
            {
                'to': token,
                'notification': {
                    'title': message.title,
                    'body': message.body,
                },    
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Config.FIREBASE_SERVER_KEY}`,
                },
            }
        ).then(data => {
            console.log('data', data);
        }).catch(err => {
            console.log('err', err);
        });
    };
};