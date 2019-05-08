var CONTACT_ADDRESS = 'moninsergei@gmail.com';
const AJV = require('ajv');
const AWS = require('aws-sdk');
const sesClient = new AWS.SES();

module.exports.contact = (event, context, callback) => {

  const ajv = new AJV();

  const validate = ajv.compile({
    "$async": true,
    "properties": {
      "fullName": {"type":"string"},
      "email": {"type":"string", "format": "email"},
      "message": {"type":"string"},
    },
    "additionalProperties": false,
    "required": ["email", "message"]
  });

  console.log(JSON.stringify(event));
  const body = JSON.parse(event.body);
  const { fullName, email, message } = body;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  validate(JSON.stringify(event))
    .then(valid => {
      // Email Template
      const output = `
        <p>You have a message</p>
        <h3>Contact Details</h3>
        <p>Full name: ${fullName}</p>
        <p>Email: ${email}</p>
        <h3>Message</h3>
        <p>${message}</p>
        `;

      sesClient.sendMail({
        from: `${fullName} <${email}>`,
        to: [CONTACT_ADDRESS],
        subject: '[Build in Saratov Contact Form]',
        html: output,
      }, function(err, info) {
        if (err) return callback(err);
        callback(null, {
          statusCode: 200,
          body: "Success!",
          headers
        });
      });
    })
    .catch(error => {
      if (error) {
        console.log(error.errors);
        callback(null, {
          statusCode: 502,
          body: error.errors[0].message,
          headers
        })
      }
    });
};
