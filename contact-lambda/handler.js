console.log('Loading function');
const AWS = require('aws-sdk');

const sesClient = new AWS.SES();
const sesConfirmedAddress = 'moninsergei@gmail.com';

function getEmailMessage(emailObj) {
  // Email Template
  const output = `
    You have a message

    Contact Details
    Full name: ${emailObj.fullName}
    Email: ${emailObj.email}

    Message
    ${emailObj.message}
    `;

  const emailRequestParams = {
    Destination: {
      ToAddresses: [sesConfirmedAddress],
    },
    Message: {
      Body: {
        Text: {
          Data: output,
        },
      },
      Subject: {
        Data: '[Build in Saratov Contact Form]',
      },
    },
    Source: sesConfirmedAddress,
    ReplyToAddresses: [emailObj.email],
  };

  return emailRequestParams;
}

/**
 * Lambda to process HTTP POST for contact form with the following body
 * {
      "fullName": <contact-fullName>,
      "email": <contact-email>,
      "message": <contact-message>
    }
 *
 */
exports.contact = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const emailObj = JSON.parse(event.body);
  const params = getEmailMessage(emailObj);
  const sendEmailPromise = sesClient.sendEmail(params).promise();

  const response = {
    statusCode: 200,
  };

  sendEmailPromise
    .then(function(result) {
      console.log(result);
      callback(null, response);
    })
    .catch(function(err) {
      console.log(err);
      response.statusCode = 500;
      callback(null, response);
    });
};
