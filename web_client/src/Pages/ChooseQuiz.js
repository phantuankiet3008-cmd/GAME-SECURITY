import {
  Button,
  Container,
  Col,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import "../App.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ChooseQuiz() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  const renderTooltipBeginner = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Your use of the Internet is limited to reading emails, social networks and
      some research.
    </Tooltip>
  );

  const renderTooltipAdvanced = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      You use the Internet at work, for your administrative procedures, you are
      subscribed to third party services.
    </Tooltip>
  );

  return (
    <Container>
      <Col>
        <div
          className="App col-md-12"
          style={{ backgroundColor: "transparent" }}
        >
          <img
            src={require("../Assets/logo.png")}
            style={{ width: "20%" }}
            alt="Logo"
          />

          <div
            id="chooseQuiz"
            className="col-size offset-md-3"
            style={{ marginTop: "10%" }}
          >
            {/* Nút quay về */}
            <Button
              onClick={() => navigate("/home")}
              className="button-user"
              style={{
                marginLeft: "-80%",
                borderRadius: "50%",
                backgroundColor: "#01d976",
                borderColor: "#01d976",
              }}
            >
              <FaArrowLeft />
            </Button>

            <h3>Welcome {username} !</h3>
            <h4>Choose the type of quiz:</h4>

            <OverlayTrigger
              placement="left"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltipBeginner}
            >
              <Button
                onClick={() => navigate("/quiz-minor")}
                className="col-md-5 rounded-pill button-user"
                style={{
                  fontWeight: "bold",
                  fontSize: "17px",
                  marginRight: "2%",
                  backgroundColor: "#01d976",
                  borderColor: "#01d976",
                }}
              >
                Quiz for Beginner
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltipAdvanced}
            >
              <Button
                onClick={() => navigate("/quiz-major")}
                className="col-md-5 rounded-pill button-major"
                style={{
                  marginRight: "1%",
                  fontWeight: "bold",
                  fontSize: "17px",
                }}
                variant="danger"
              >
                Quiz for Advanced
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </Col>
    </Container>
  );
}

export default ChooseQuiz;
