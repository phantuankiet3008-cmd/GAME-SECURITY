import React, { useState, useMemo, useRef, useEffect } from "react";
import TinderCard from "../Components/TinderCard";
import questionChild from "../questions/questions.json";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Button, Table, Spinner, Modal, ButtonGroup } from "react-bootstrap";
import { FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";
import { getStoredLanguage, localizeQuestion, uiText } from "../utils/language";
import { useNavigate } from "react-router-dom";
const result = [];

function QuizMinor() {
  const navigate = useNavigate();
  const questions = questionChild.Questions_Child;
  const [currentIndex, setCurrentIndex] = useState(questions.length - 1);
  //const [lastDirection, setLastDirection] = useState()
  const currentIndexRef = useRef(currentIndex);
  const username = sessionStorage.getItem("username");
  const [start, setStart] = useState(false);
  const [winTime, setWinTime] = useState(30);
  const [score, setScore] = useState(0);
  const [saveAnswer, setSaveAnswer] = useState([]);
  const [language, setLanguage] = useState(getStoredLanguage);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const translatedQuestions = useMemo(
    () => questions.map((question) => localizeQuestion(question, language)),
    [language, questions],
  );
  const labels = uiText[language];
  const canSwipe = currentIndex >= 0;

  const childRefs = useMemo(
    () =>
      Array(questions.length)
        .fill(0)
        .map((i) => React.createRef()),
    [questions.length],
  );

  const changeLanguage = (nextLanguage) => {
    sessionStorage.setItem("language", nextLanguage);
    setLanguage(nextLanguage);
  };

  const handleStart = () => {
    setStart(true);
  };

  const showQuizz = () => {
    const readyDiv = document.getElementById("ready");
    const quizDiv = document.getElementById("quiz");

    readyDiv.style.display = "none";
    quizDiv.style.display = "block";
    handleStart();
  };

  /*const remainingTime = ({ remainingTime }) => {
    return (
      <div>
        <h1>{remainingTime}</h1>
      </div>
    );
  };*/

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const sendScore = () => {
    const userScore = sessionStorage.getItem("score");
    const myHeaders = new Headers();
    myHeaders.append("Access-Control-Allow-Origin", "*");
    myHeaders.append("Content-Type", "application/json; charset=UTF-8");

    const raw = JSON.stringify({
      username: username,
      difficulty: 0,
      score: parseInt(userScore),
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    console.log(raw);
    fetch(`https://game-security.onrender.com/addScore`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //const canGoBack = currentIndex < questionChild.Questions_Child.length - 1

  useEffect(() => {
    sessionStorage.setItem("score", score);
    // console.log('time: ', timer)
  }, [score, winTime]);

  // set last direction and decrease current index
  const swiped = async (direction, nameToDelete, index) => {
    const checkWin = document.getElementById("winIcon");
    const checkLoose = document.getElementById("looseIcon");
    const quizDiv = document.getElementById("quiz");
    const detailsDiv = document.getElementById("details");
    const spinn = document.getElementById("spin");
    const timer = sessionStorage.getItem("time");

    //setLastDirection(direction)
    updateCurrentIndex(index - 1);
    if (direction === questions[index].good_answer) {
      checkWin.style.display = "block";
      checkLoose.style.display = "none";
      setScore((score) => score + 50);
      setWinTime((winTime) => winTime + 5);
      result.push("✅");
    } else {
      checkWin.style.display = "none";
      checkLoose.style.display = "block";
      result.push("❌");
    }
    if (index === 0 || timer < 3) {
      while (result.length < questions.length) {
        result.push("🕒");
      }
      const reversed = result.reverse();
      setSaveAnswer(reversed);
      quizDiv.style.display = "none";
      spinn.style.display = "block";
      await wait(1000);
      sendScore();
      await wait(2000);
      spinn.style.display = "none";
      detailsDiv.style.display = "block";
    }
  };

  const outOfFrame = (name, idx) => {
    const currentCardPackage = document.getElementById("card" + idx);
    let nextCardPackage;
    if (idx > 0) {
      nextCardPackage = document.getElementById("card" + (idx - 1));
    }

    currentCardPackage.style.display = "none";
    if (nextCardPackage) {
      nextCardPackage.style.display = "grid";
    }
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < questions.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  return (
    <div>
      <div className="">
        <img
          src={require("../Assets/logo.png")}
          className="quiz-logo"
          alt="Logo"
        />
      </div>
      <Button
        onClick={() => setShowLanguageModal(true)}
        className="language-button button-user"
      >
        {labels.language}: {language.toUpperCase()}
      </Button>
      <Modal
        show={showLanguageModal}
        onHide={() => setShowLanguageModal(false)}
        centered
        className="language-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{labels.chooseLanguage}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ButtonGroup className="language-options">
            <Button
              className="button-user"
              active={language === "en"}
              onClick={() => changeLanguage("en")}
            >
              English
            </Button>
            <Button
              className="button-user"
              active={language === "vi"}
              onClick={() => changeLanguage("vi")}
            >
              Tiếng Việt
            </Button>
          </ButtonGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="button-user"
            onClick={() => setShowLanguageModal(false)}
          >
            {labels.close}
          </Button>
        </Modal.Footer>
      </Modal>
      <div id="ready">
        <div className="" style={{ marginTop: "5%" }}>
          <h1 className="quiz-heading text-light">
            {language === "vi"
              ? `${labels.welcome} ${username} đến với quiz ${labels.beginnerTitle} !`
              : `${labels.welcome} ${username} to the ${labels.beginnerTitle} quiz !`}
          </h1>
          <br />
          <h2 className="text-center text-light">{labels.ready}</h2>
          <br />
          <br />
          <Button
            onClick={showQuizz}
            style={{ backgroundColor: "#01d976", borderColor: "#01d976" }}
            className="button-user rounded-pill col-md-2 start-button"
          >
            {labels.start}
          </Button>
          <br />
          <br />
        </div>
        <br />
        <div className="offset-md-3 col-size how-to-play">
          <div className="d-flex how-to-title">
            <h2 className="text-center text-light">{labels.howToPlay}</h2>
            <img
              src={require("../Assets/Bot.png")}
              className="bot-icon"
              alt="Logo"
            />
          </div>
          <p className="text-center how-to-copy text-light">
            {labels.instructions}
            <br />
            {labels.haveFun}
          </p>
        </div>
      </div>

      <div id="quiz" style={{ display: "none" }}>
        <div className="quiz-status">
          <CountdownCircleTimer
            isPlaying={start}
            duration={winTime}
            colors={["#01d976", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[10, 5, 2, 0]}
            initialRemainingTime={winTime}
            size={100}
          >
            {({ remainingTime }) => {
              if (!start) {
              }
              sessionStorage.setItem("time", remainingTime);
              return <h1 className="text-light">{remainingTime}</h1>;
            }}
          </CountdownCircleTimer>
          <div
            className="col-md-1 offset-md-4"
            id="winIcon"
            style={{ display: "none", marginTop: "2%" }}
          >
            <FaRegCheckCircle color="#01d976" size={40} />
          </div>
          <br />
          <div
            className="col-md-1 offset-md-4"
            id="looseIcon"
            style={{ marginTop: "2%", display: "none" }}
          >
            <FaRegTimesCircle color="red" size={40} />
          </div>
          <br />
          <div className="score-display text-light">
            <h1>
              {username} {labels.score} : {score}
            </h1>
          </div>
        </div>

        <div className="cardContainer">
          {translatedQuestions.map((character, index) => (
            <div
              key={index}
              id={"card" + index}
              style={{ display: index === currentIndex ? "grid" : "none" }}
            >
              <div className="answer-option answer-up">
                <p>3 : {character.up}</p>
              </div>
              <div className="cardMiddleRow">
                <div className="answer-option answer-left">
                  <p>1 : {character.left}</p>
                </div>
                <TinderCard
                  ref={childRefs[index]}
                  className="swipe"
                  key={index}
                  onSwipe={(dir) => swiped(dir, character.title, index)}
                  onCardLeftScreen={() => outOfFrame(character.title, index)}
                >
                  <div>
                    <h4 style={{ marginBottom: "10px" }}>{character.title}</h4>
                  </div>
                  <div
                    style={{ backgroundImage: "url(" + character.image + ")" }}
                    className="card"
                  ></div>
                </TinderCard>
                <div className="answer-option answer-right">
                  <p>2 : {character.right}</p>
                </div>
              </div>
              <div className="answer-option answer-down">
                <p>4 : {character.down}</p>
              </div>
            </div>
          ))}
        </div>
        <br />

        <div className="buttons offset-md2" style={{ marginTop: "20px" }}>
          <button
            className="button-go"
            style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
            onClick={() => swipe("left")}
          >
            {labels.answer} 1
          </button>
          <button
            className="button-aqua"
            style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
            onClick={() => swipe("right")}
          >
            {labels.answer} 2
          </button>
          <button
            className="button-fu"
            style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
            onClick={() => swipe("up")}
          >
            {labels.answer} 3
          </button>
          <button
            className="button-lightsalmon"
            style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
            onClick={() => swipe("down")}
          >
            {labels.answer} 4
          </button>
        </div>
      </div>
      <div id="spin" style={{ display: "none", marginTop: "10%" }}>
        <Spinner
          animation="border"
          variant="#01d976"
          size="500"
          style={{ height: "150px", width: "150px", color: "#01d976" }}
        />
        <br />
        <br />
        <h5 style={{ color: "white", fontWeight: "bold" }}>
          {labels.loadingResults}
        </h5>
      </div>
      <div id="details" style={{ marginTop: "2%", display: "none" }}>
        <Button
          onClick={() => navigate("/score-minor")}
          style={{
            backgroundColor: "#01d976",
            borderColor: "#01d976",
            fontWeight: "bold",
          }}
          className="rounded-pill col-md-2 button-user leaderboard-button"
        >
          {labels.viewLeaderboard}
        </Button>
        <br />
        <br />
        <div className="results-table-wrap">
          <Table
            bordered
            className="dark-score-table"
            style={{
              border: "2px solid #01d976",
              color: "white",
              boxShadow: "0px 0px 20px 0px rgba(1,217,118, 0.8)",
            }}
          >
            <thead style={{ border: "2px solid #01d976" }}>
              <tr style={{ border: "2px solid #01d976" }}>
                <th style={{ border: "2px solid #01d976" }} width="20%">
                  {labels.question}
                </th>
                <th style={{ border: "2px solid #01d976" }} width="10%">
                  {labels.goodAnswer}
                </th>
                <th style={{ border: "2px solid #01d976" }} width="20%">
                  {labels.details}
                </th>
                <th style={{ border: "2px solid #01d976" }} width="4%">
                  {labels.yourAnswer}
                </th>
              </tr>
            </thead>
            <tbody style={{ border: "2px solid #01d976" }}>
              {translatedQuestions.map((question, index) => (
                <tr
                  key={index}
                  style={{ border: "2px solid #01d976", color: "white" }}
                >
                  <td style={{ border: "2px solid #01d976", color: "white" }}>
                    {question.title}
                  </td>
                  <td style={{ border: "2px solid #01d976", color: "white" }}>
                    {question[question.good_answer]}
                  </td>
                  <td style={{ border: "2px solid #01d976", color: "white" }}>
                    {question.details}
                  </td>
                  <td style={{ border: "2px solid #01d976", color: "white" }}>
                    {saveAnswer[index]}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default QuizMinor;
/*
      {lastDirection ? (
        <h2 key={lastDirection} className='infoText'>

        </h2>
      ) : (
        <h2 className='infoText'>
          Swipe a card or press a button to get Card !
        </h2>
      )}



*/
