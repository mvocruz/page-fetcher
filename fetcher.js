const fs = require('fs');
const request = require('request');
const readline = require('readline');
const terminal = process.argv.slice(2);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
if (terminal.length < 2) {
  console.log('Error: missing information.');
  process.exit();
}
request(terminal[0], (err, response, body) => {
  if (err) {
    console.log(err.message);
    process.exit();
  }
  if (response && response.statusCode > 300 || response.statusCode < 200) {
    console.log('error',response.statusCode);
    process.exit();
  }
  fs.access(terminal[1],fs.F_OK, (err) => {
    if (!err) {
      rl.question(`File ${terminal[1]} File already exists. Overwrite? (y/n): `, (answer) => {
        if (!/[yY]/g.test(answer)) {
          console.log('Cancelling write...');
          process.exit();
        }
        fs.writeFile(terminal[1], body, (err) => {
          if (err) {
            console.log(err.message);
            process.exit();
          }
          console.log(`Downloaded and saved ${body.length} bytes to ${terminal[1]}`);
        });
        rl.close();
      });
    } else {
      fs.writeFile(terminal[1], body, (err) => {
        if (err) {
          console.log(err.message);
          process.exit();
        }
        console.log(`Downloaded and saved ${body.length} bytes to ${terminal[1]}`);
      });
      rl.close();
    }
  });
});