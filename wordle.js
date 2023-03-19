const wordsBox = document.querySelectorAll(".word");
const keywords = document.querySelectorAll(".keyword");
const root = document.querySelector(':root');
const restart = document.querySelectorAll(".reset");
const correctWord = document.querySelectorAll(".correct-word")
const ANSWER_LENGTH = 5;
const ROUND = 6;

// loading.style.setProperty("--hidden", "hidden")

async function init() {
  let boxRow = 1;
  let guessWord = "";
  let win = false;
  let loading = true;

  const response = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
  const responseObj = await response.json();
  const answer = responseObj.word.toUpperCase();
  const answerPart = answer.split("");

  root.style.setProperty("--loading", "hidden");


  function addLetter(letter) {
    if (guessWord.length < ANSWER_LENGTH) {
      guessWord = guessWord + letter;
    }
    else {
        guessWord = guessWord.substring(0, guessWord.length - 1) + letter;
    }
    wordsBox[ANSWER_LENGTH * (boxRow - 1)+ guessWord.length - 1].classList.add("zoominout");
    wordsBox[ANSWER_LENGTH * (boxRow - 1)+ guessWord.length - 1].classList.add("border");

    wordsBox[ANSWER_LENGTH * (boxRow - 1)+ guessWord.length - 1].innerText = letter;
  }

  async function enter() {
    if(guessWord.length < 5) {
      return;
    }

    loading = false;
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: guessWord })
      });
      const resObj = await res.json();
      const validWord = resObj.validWord;

      if(!validWord){
        invalidWord();
        return;
      };

    const guessPart = guessWord.split("");
    const remainPart = [...answerPart];


    for(let i = 0; i < ANSWER_LENGTH; i++ ){
      wordsBox[ANSWER_LENGTH * (boxRow - 1) + i].classList.add("flip", "color");
    }

    for(let i = 0; i < ANSWER_LENGTH; i++ ){

      if(guessPart[i] === answerPart[i]){
        wordsBox[ANSWER_LENGTH * (boxRow - 1) + i].classList.add("correct");

        remainPart.splice(i, 1, "");
      }

    }


    for(let i = 0; i < ANSWER_LENGTH; i++ ){

      if(guessPart[i] === answerPart[i]){
        // do nothing
      }

       else if( remainPart.includes(guessPart[i])){
        wordsBox[ANSWER_LENGTH * (boxRow - 1) + i].classList.add("close");


      }
      else {
        wordsBox[ANSWER_LENGTH * (boxRow - 1) + i].classList.add("wrong");
      }


    }
    if(guessWord === answer){
      root.style.setProperty("--win-result", "visible");
      win = true;
      correctWord[0].innerText = `${answer} is correct word.`;
      return;
    }
    else if(ROUND === boxRow){
      root.style.setProperty("--lost-result", "visible");
      win = !false;
      correctWord[1].innerText = `${answer} is correct word.`;
      return;
    }

    boxRow++;
    guessWord = "";
    loading = true;
  }

  function back() {

    if(guessWord.length > 0) {

      wordsBox[ANSWER_LENGTH * (boxRow - 1) + guessWord.length - 1].classList.remove("zoominout");
      wordsBox[ANSWER_LENGTH * (boxRow - 1) + guessWord.length - 1].classList.remove("border");
      wordsBox[(boxRow - 1) * ANSWER_LENGTH + guessWord.length - 1].innerText = "";
    }
    guessWord = guessWord.substring(0, guessWord.length - 1);
  }

  function invalidWord(){
    root.style.setProperty("--valid", "visible");
    setTimeout(()=>{
      root.style.setProperty("--valid", "hidden");
      loading = true;
    },600)
  };

    document.addEventListener("keydown", function keyPress(event) {

  if (!win && loading){
      const action = event.key;
      if (action === "Enter") {
        enter();
      } else if (action === "Backspace") {
        back();
      } else if (alphabet(action)) {
        addLetter(action.toUpperCase());
      } else {
      }
    }
      });

      keywords.forEach(box => {
       box.addEventListener('click', (event)=> {
              const action = event.target.innerText;
              if (!win){
              if (action === "Enter") {
              enter();
              } else if (action === "Back") {
              back();
              } else if (action) {
              addLetter(action.toUpperCase());
              } else {
                  // do noting
              }
            }
          }
       )
    });



    function alphabet(letter) {
      return /^[a-zA-Z]$/.test(letter);
    }

    restart.forEach(reset => {
      reset.addEventListener('click', ()=> {
        document.location.reload()
      })
    });

}

init();

