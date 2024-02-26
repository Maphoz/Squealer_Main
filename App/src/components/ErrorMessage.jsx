import tw from "twin.macro";
import styled from "styled-components"
import ReactDOM from 'react-dom';
import errorIcon from "../images/error_icon.png"

const ContainerForMex = styled.div`
  position: fixed;
  width: 100%;
  bottom: 100px;
  display: flex;
  justify-content: center;
  z-index: 1000;
  @keyframes slide-up {
    0% {
      transform: translateY(100%);
      opacity: 1;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  animation: slide-up 0.3s ease-out forwards;
`

const ErrorContainer = styled.div`
  @keyframes shake {
    0% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-10px); }
    80% { transform: translateX(10px); }
    100% { transform: translateX(0); }
  }

  ${tw`
     flex
     flex-row
     mb-4
  `}
  align-items: start;
  color: red;
  background: black;
  animation: shake 0.5s ease-out 0.5s;
  font-size: 15px;
  padding: 12px 15px;
  border-radius: 15px;
`

const IconContainer = styled.div`
  margin-right: 10px;
  width: 22px;
  height: 22px;
`

export default function ErrorPopUp(props){
  return ReactDOM.createPortal(
    <ContainerForMex>
      <ErrorContainer>
        <IconContainer>
          <img src={errorIcon} />
        </IconContainer>
        <span>{props.text}</span>
      </ErrorContainer>
    </ContainerForMex>,
    document.body
  );
}