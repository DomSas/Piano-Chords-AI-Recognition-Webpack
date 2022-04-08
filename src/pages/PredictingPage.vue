<template>
  <f7-page name="PredictingPage">
    <div class="predicting-page">
      <!-- Page content-->
      <h3 class="predicting-page__title">pAIno</h3>
      <p class="predicting-page__description">
        Play the chord shown below.<br />
        If you do not know, click on the <br />card to get hint.
      </p>

      <div class="predicting-page__chord-card">
        <div
          v-if="!chordImageVisible"
          class="predicting-page__card-face card-front"
        >
          <h2 class="predicting-page__chord-name">{{ currentChordLetter }}</h2>
        </div>

        <div
          v-if="chordImageVisible"
          class="predicting-page__card-face card-back"
        >
          <img
            class="predicting-page__chord-img"
            :src="`../static/${currentChordLetter}_chord.jpg`"
            alt="chord"
          />
        </div>
      </div>

      <div class="predicting-page__buttons">
        <a class="predicting-page__button-reveal" @click="flipCard()">Reveal</a>
        <a class="predicting-page__button-next" @click="randomizeChordLetter()"
          >Next</a
        >
      </div>

      <p>Recognized letter: {{ label }}</p>
    </div>
  </f7-page>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const chordLetters = ["C", "D", "E", "F"];
    const currentChordLetter = ref("");
    const chordImageVisible = ref(false);
    const label = ref("waiting...");

    let card;
    // Classifier and model url
    let classifier;
    let modelURL = "https://teachablemachine.withgoogle.com/models/oQapXjh1t/";

    onMounted(() => {
      randomizeChordLetter();
      card = document.querySelector(".predicting-page__chord-card");
      card.addEventListener("click", function () {
        flipCard();
      });
      console.log(isMobile());
      startRecognizingChords();
    });

    const flipCard = () => {
      card.classList.toggle("is-flipped");
      chordImageVisible.value = !chordImageVisible.value;
    };

    const randomizeChordLetter = () => {
      currentChordLetter.value = chordLetters[Math.floor(Math.random() * 4)];
    };

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

    // Predict piano chords
    const startRecognizingChords = async () => {
      const options = { probabilityThreshold: 0.7 };

      if (isMobile == true) {
        console.log("here");
        audioinput.start({
          streamToWebAudio: true,
        });
        audioinput.stop(() => {
          console.log("stopped");
        });
      }
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
      classifier = await ml5.soundClassifier(modelURL + "model.json", options);
      // STEP 2: Start classifying (will listen to mic by default)
      classifier.classify(gotResults);
    };

    function gotResults(error, results) {
      if (error) {
        console.error(error);
        return;
      }
      // Store the label
      label.value = results[0].label;
      console.log(results[0].label);

      if (results[0].label === currentChordLetter.value) {
        // TODO: Show correct banner
        randomizeChordLetter();
      }
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
      flipCard,
      randomizeChordLetter,
      label,
      chordImageVisible,
      currentChordLetter,
    };
  },
};
</script>
