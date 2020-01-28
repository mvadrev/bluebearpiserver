var express = require("express");
var AWS = require("aws-sdk");
var fs = require("fs");
const PiCamera = require('pi-camera');
var cors = require("cors");

// Init express app
var app = express(app);
app.use(cors());

// Image buffer



//aws config
AWS.config = new AWS.Config();
AWS.config.accessKeyId = "";
AWS.config.secretAccessKey = "";
AWS.config.region = "us-east-1";
var rek = new AWS.Rekognition();

// Recognize base64 image API

app.get("/rek", (req, res) => {
  // Init params for Rekognition
  
  const myCamera = new PiCamera({
  mode: 'photo',
  output: `${ __dirname }/test.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});
 
myCamera.snap()
  .then((result) => {
      setTimeout(function() {
    let test_img = fs.readFileSync("./test.jpg");
    var rek_params = {
      CollectionId: "face26",
      FaceMatchThreshold: 95,
      Image: { Bytes: Buffer.from(test_img) },
      MaxFaces: 5
    };
    var rr = rek.searchFacesByImage(rek_params, function(err, data) {
      if (err) res.send("No Face found");
      else res.send(data.FaceMatches);
    });
    console.log("recognized");
  }, 10);
    // Your picture was captured
  })
  .catch((error) => {
     // Handle your error
  });


});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
