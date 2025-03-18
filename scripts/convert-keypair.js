const fs = require('fs');
const bs58 = require('bs58');

// The private key provided by the user (this is the bs58 encoded private key)
const privateKeyString = "2DMnCWtpceNncUNCKXv97CWjFo4so7npyRJd5AJGNv3XMPiDUSUtL68Teh9ie5AkDyDkGUTk5qTqo7b5oek3hU9u";

// Decode the private key from bs58 to bytes
const privateKeyBytes = bs58.decode(privateKeyString);

// Write the private key bytes to a file
fs.writeFileSync('new-deploy-keypair.json', JSON.stringify(Array.from(privateKeyBytes)));

console.log("New keypair file created: new-deploy-keypair.json");
