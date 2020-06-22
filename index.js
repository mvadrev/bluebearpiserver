var express = require("express");
var app = express();
var AWS = require("aws-sdk/dist/aws-sdk-react-native");
var cors = require("cors");
var fs = require("fs");
const PiCamera = require("pi-camera");
var base64ToImage = require("base64-to-image");

// Node config
app.use(cors());

// AWS Config
AWS.config = new AWS.Config();
AWS.config.accessKeyID = "";
AWS.config.secretAccesskey = "";
AWS.config.region = "us-east-1";
var rek = new AWS.Rekognition();

app.get("/snap", function(req, res) {
  // Config camera
  const myCamera = new PiCamera({
    mode: "photo",
    output: `${__dirname}/test.jpg`,
    width: 640,
    height: 480,
    nopreview: true
  });
  // Capture frames
  myCamera
    .snap()
    .then(result => {
      console.log("Picture saved");
      let buff = fs.readFileSync("./test.jpg");
      var rek_params = {
        CollectionId: "face26",
        FaceMatchThreshold: 95,
        Image: { Bytes: Buffer.from(buff) },
        MaxFaces: 5
      };
      var rr = rek.searchFacesByImage(rek_params, function(err, data) {
        res.send(data.FaceMatches);
      });
    })
    .catch(error => {
      console.log("Error capturing image");
    });
  res.send("hello from pi camera");
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});
