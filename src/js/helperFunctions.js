const modelURL = "https://teachablemachine.withgoogle.com/models/oQapXjh1t/";
let predictedChord;
// Classifier and model url
let classifier;
let label;

const isAndroid = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) return true;
  return false;
};

const isIos = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/iPad|iPhone|iPod/i.test(userAgent)) return true;
  return false;
};

const isMobile = () => {
  if (window.cordova && (isAndroid() || isIos())) {
    return true;
  } else {
    return false;
  }
};

const loadModel = async () => {
  const options = { probabilityThreshold: 0.7 };

  if (isMobile() == true) {
    console.log("here");
    audioinput.start({
      streamToWebAudio: true,
    });
    audioinput.stop(() => {
      console.log("stopped");
    });

    // document.addEventListener("deviceready", async () => {
    //   cordova.plugins.diagnostic.requestMicrophoneAuthorization(
    //     function (status) {
    //       if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
    //         console.log("Microphone use is authorized");
    //       }
    //     },
    //     function (error) {
    //       console.error(error);
    //     }
    //   );
    // });
  }

  classifier = await ml5.soundClassifier(modelURL + "model.json", options);
};

const startPrediction = async (callback) => {
  classifier.classify(gotResults);

  function gotResults(error, results) {
    if (error) {
      console.error(error);
      return;
    }
    callback(results[0].label);
  }
};

const helperFunctions = {
  loadModel,
  isAndroid,
  isIos,
  isMobile,
  startPrediction,
  predictedChord,
};

export default helperFunctions;
