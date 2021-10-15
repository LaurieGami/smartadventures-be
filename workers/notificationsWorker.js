require('dotenv').config();
const Twilio = require('twilio');
const { CompositionPage } = require('twilio/lib/rest/video/v1/composition');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

const Trip = require('../models/trip');

const markAsOverdue = () => {
    Trip.where({trip_status: 'active'})
        .fetchAll()
        .then(trips => {
            trips.models.map(trip => {
                const nowDate = new Date();
                const returnDate = new Date(trip.attributes.return_date);

                if (nowDate > returnDate) {
                    trip
                        .save({
                            trip_status: 'overdue'
                        })
                }
            })
        })
        .catch(err => console.log(err))
}

const sendNotifications = () => {
    Trip.where({trip_status: 'overdue'})
        .fetchAll()
        .then(trips => {
            // console.log(trips.models);
            trips.models.map(trip => {
                const nowDate = new Date();
                const returnDate = new Date(trip.attributes.return_date.getTime() + 1*60000);

                const beforeDate = new Date(nowDate.getTime() - 0.5*60000);
                const afterDate = new Date(nowDate.getTime() + 0.5*60000);
                
                if (beforeDate < returnDate && returnDate < afterDate) {
                    console.log(beforeDate);
                    console.log(returnDate);
                    console.log(afterDate);
                    console.log('Notification!')
                }
            })
        })
        .catch(err => console.log(err))

    const client = new Twilio(accountSid, authToken);

    // const tripsList = JSON.stringify(trips);

    // console.log(trips);

    // trips.map(trip => {
    //     // const emergency_contacts = JSON.stringify(trip.emergency_contacts);
    //     console.log(trip.emergency_contacts);
    // })

    // trips.forEach(function (trip) {
    //     // Create options to send the message
    //     const options = {
    //         to: `+${trip.phoneNumber}`,
    //         from: phoneNumber,
    //         /* eslint-disable max-len */
    //         body: `Hi ${trip.name}. Just a reminder that you have an trip coming up.`,
    //         /* eslint-enable max-len */
    //     };

    //     // Send the message!
    //     client.messages.create(options, function (err, response) {
    //         if (err) {
    //             // Just log it for now
    //             console.error(err);
    //         } else {
    //             // Log the last few digits of a phone number
    //             let masked = trip.phoneNumber.substr(0,
    //                 trip.phoneNumber.length - 5);
    //             masked += '*****';
    //             console.log(`Message sent to ${masked}`);
    //         }
    //     });
    // });

    // Don't wait on success/failure, just indicate all messages have been
    // queued for delivery
    // if (callback) {
    //     callback.call();
    // }
}


const notificationsWorker = () => {
    return {
        run: function () {
            // requireNotification();
            console.log('Every minute...');
            markAsOverdue();
            sendNotifications();
        }
    }
}

module.exports = notificationsWorker();