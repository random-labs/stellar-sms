var stellarAddress = process.env.STELLAR_WALLET_ADDRESS;

var WebSocket = require('ws');
var ws = new WebSocket('ws://live.stellar.org:9001');

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var client = require('twilio')(accountSid, authToken);

ws.on('open', function() {
  var data = { 
      command : 'subscribe',
      accounts : [ stellarAddress ]
  };
  ws.send( JSON.stringify( data ), function( err ) {
    console.error( err );
  });
});

ws.on('message', function(data, flags) {
  var msg = JSON.parse(data);
  console.log( msg )

  if( 
    msg.engine_result_code === 0 && 
    msg.type === 'transaction' && 
    msg.transaction.Destination === stellarAddress 
  ) {
    client.sendMessage({

      to: process.env.PHONE_NUMBER, // Your phone number
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
      body: 'You received ' + msg.transaction.Amount/1000000 + ' STR' // body of the SMS message

    }, function(err, responseData) {
      if (!err) {
        console.log(responseData.body);
      }
    });
  }
});
