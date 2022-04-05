<template>
  <f7-page name="home">
    <!-- Top Navbar -->
    <f7-navbar>
      <f7-nav-title>Microphone check</f7-nav-title>
    </f7-navbar>
    <!-- Page content-->
    <div class="content-container">
      <h2>Chords recognition</h2>
      <f7-button large small fill @click="startRecognizingChords()"
        >Start recognizing chords
      </f7-button>
      <p>{{ label }}</p>
    </div>
  </f7-page>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    let audio;
    let fileSystem;
    // Storing the label
    const label = ref("waiting...");
    // Classifier and model url

    let classifier;
    let modelURL = "https://teachablemachine.withgoogle.com/models/oQapXjh1t/";

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

    const isMobile = () => window.cordova && (isAndroid() || isIos());

    // Predict piano chords
    const startRecognizingChords = async () => {
      const options = { probabilityThreshold: 0.85 };

            audioinput.start({
        streamToWebAudio: true,
      });

      // cordova.plugins.diagnostic.requestMicrophoneAuthorization(
      //   function (status) {
      //     if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
      //       console.log("Microphone use is authorized");
      //     }
      //   },
      //   function (error) {
      //     console.error(error);
      //   }
      // );

      // STEP 1: Load the model!
      // classifier = await ml5.soundClassifier(modelURL + "model.json", options);
      // // STEP 2: Start classifying (will listen to mic by default)
      // classifier.classify(gotResults);
    };

    function gotResults(error, results) {
      if (error) {
        console.error(error);
        return;
      }
      // Store the label
      label.value = results[0].label;
      console.log(results[0].label);
    }

    const getAudioCordovaPluginMedia = () => {
      let src = "myrecording.mp3";
      var mediaRec = new Media(
        src,
        // success callback
        function () {
          console.log("recordAudio():Audio Success");
        },

        // error callback
        function (err) {
          console.log("recordAudio():Audio Error: " + err.code);
        }
      );

      // Record audio
      mediaRec.startRecord();

      // Stop recording after 10 seconds
      setTimeout(function () {
        mediaRec.stopRecord();
        mediaRec.play();
      }, 5000);
    };

    return {
      getAudioCordovaPluginMedia,
      startRecognizingChords,
      label,
    };
  },
};
</script>
