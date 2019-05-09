const aws = require('aws-sdk');

const ses = new aws.SES();
const myEmail = 'moninsergei@gmail.com';
const myDomain = 'https://build-in-saratov.com/';

function generateResponse(code, payload) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(payload),
  };
}

function generateError(code, err) {
  console.log(err);
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(err.message),
  };
}

function generateEmailParams(body) {
  const { email, fullName, message } = JSON.parse(body);
  console.log(email, fullName, message);
  if (!(email && fullName && message)) {
    throw new Error(
      "Missing parameters! Make sure to add parameters 'email', 'fullName', 'message'.",
    );
  }

  return {
    Source: myEmail,
    Destination: { ToAddresses: [myEmail] },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Message sent from email ${email} by ${fullName} \nContent: ${message}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `You received a message from ${myDomain}!`,
      },
    },
  };
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
module.exports.contact = async event => {
  try {
    const emailParams = generateEmailParams(event.body);
    const data = await ses.sendEmail(emailParams).promise();
    return generateResponse(200, data);
  } catch (err) {
    return generateError(500, err);
  }
};
