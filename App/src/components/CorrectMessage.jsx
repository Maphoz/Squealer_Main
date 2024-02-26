import tw from "twin.macro";
import styled from "styled-components"
import checkIcon from "../images/checkIcon.png"
import ReactDOM from 'react-dom';

const ContainerForMex = styled.div`
  position: fixed;
  width: 100%;
  bottom: 100px;
  display: flex;
  justify-content: center;
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
z-index: 1000;
`

const ErrorContainer = styled.div`


  ${tw`
     flex
     flex-row
     items-center
     mt-2
  `}
  white-space: nowrap; // Ensures the content stays in one line
  color: white;
  background: black;
  font-size: 15px;
  padding: 15px 18px;
  border-radius: 15px;
`

const IconContainer = styled.div`
  margin-right: 10px;
  width: 22px;
  height: 22px;
`

export default function CorrectPopUp(props){
  return ReactDOM.createPortal(
    <ContainerForMex>
      <ErrorContainer>
        <IconContainer>
          <img src={checkIcon} />
        </IconContainer>
        <p>{props.text}</p>
      </ErrorContainer>
    </ContainerForMex>,
    document.body
  );
}