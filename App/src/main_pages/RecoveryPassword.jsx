import React from "react";
import FormField from "../components/FormField";
import styled from "styled-components";
import tw from "twin.macro";
import MainButton from "../components/MainButton";
import { useNavigate } from "react-router";
import { mainColor } from "../const";
import no_image from '../images/user_image.jpg';
import ImageModal from "../components/ImageModal";
import { WebcamCapture } from "../components/WebcamCapture";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { DotLoader } from "react-spinners";
import CorrectPopUp from "../components/CorrectMessage";
import ErrorPopUp from "../components/ErrorMessage";

const PageContainer = styled.div`
  ${tw`
      w-full
      flex
      flex-col
      items-center
      mt-10
  `}
`

const CustomForm = styled.div`
  ${tw`
      w-full
  `}

  padding-inline: 30%;

  @media (max-width: 768px) {
    padding-inline: 30px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CustomDiv = styled.div`
${tw`
      w-full
  `}

  padding-inline: 30%;

  @media (max-width: 768px) {
    padding-inline: 30px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
`
const FormRow = styled.div`
  ${tw`
      flex
      w-full
      justify-between
      items-center
  `}
`

const Title = styled.div`
  color: ${mainColor};
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`

const ButtonRow = styled.div`
  ${tw`
      flex
      justify-between
      items-center
  `}
  width: 50%;

  @media (max-width: 768px) {
    width: 70%;
  }
`

const ImageContainer = styled.div`
  display: flex;
  width: full;
  justify-content: center;

  @media (max-width: 768px) {
    img{
      width: 100px;
      height: 100px;
      margin-bottom: 15px;
    }
  }

  img{
    width: 130px;
    height: 130px;
    border: 1px solid black;
    margin-bottom: 20px;
    border-radius: 50%;
  }
`

const BiographyContainer = styled.div`
  ${tw`
      w-full
      mt-5
      mb-5
  `}

  .red{
    color: red;
  }
`

const SmallTitle = styled.div`
  ${tw`
      mb-1
      ml-3
  `}
  color: black;
  font-weight: 500;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 16px;
  }  

  .optional{
    opacity: 0.8;
  }
`

const StyledText = styled.textarea`
  ${tw`
      w-full
  `}
  height: 150px;
  border: 1px solid ${mainColor};
  color: black;
  border-radius: 15px;

  font-size: 16px;
  @media (max-width: 768px) {
    height: 100px;
    font-size: 14px;
    padding: 5px;
    box-shadow: 0px 0px 1px 1px ${mainColor};
  }  

  &:focus{
    outline: none; // Remove the default focus outline
    border: 1px solid ${mainColor}; // Apply border color on focus
    box-shadow: 0px 0px 2px 2px ${mainColor};
  }

  /* Adjust text position */
  padding: 10px; // Add padding to the input
  margin: 5px 0 0 5px; // Adjust margin for the text position
  box-sizing: border-box; // Include padding and border in the element's total width and height
`

const Appendix = styled.div`
  ${tw`
      w-full 
      ml-2
  `}
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const RECOVER_PASSWORD = gql`
  mutation recoverPassword($email: String!, $newPassword: String!){
    recoverPassword(email: $email, newPassword: $newPassword)
  }
`

const GET_RECOVERY = gql`
query getRecoveryData($email: String!){
  getRecoveryData(email: $email){
    recoverAnswer
    recoverQuestion
  }
}
`
const VERIFY_DATA = gql`
query verifyData($email: String!, $recoverAnswer: String!){
  verifyData(email: $email, recoverAnswer: $recoverAnswer)
}
`

const SectionTitle = styled.div`
  color: black;
  font-size: 18px;
  text-align: left;
  font-weight: 600;
  margin-bottom: 20px;
`

const SectionQuestion = styled.div`
  color: ${mainColor};
  font-size: 20px;
  text-align: left;

  .dom{
    color: black;
    margin-right: 10px;
    font-size: 18px;
  }
  margin-bottom: 20px;
`

export default function RecoveryPassword(){
  const navigate = useNavigate();
  const [recoverPassword, {loading: loadingNewPass, error: errorNewPass, data: dataNewPass}] = useMutation(RECOVER_PASSWORD, {
    onError: () => {
      setErrorNewPassword(true);
      setTimeout(() => {
        setErrorNewPassword(false)
      }, 1500)
    },
    onCompleted: () => {
      setCorrectNewPassword(true);
      setTimeout(() => {
        navigate('/');
        setCorrectNewPassword(false);
      }, 1500)
    }
  });
  const [getRecovery, {loading: loadingRecovery, error: errorRecovery, data : dataRecovery}] = useLazyQuery(GET_RECOVERY, {
    onError: () => {
      setErrorEmail(true);
      setEmail("");
      setTimeout(() => {
        setErrorEmail(false);
      }, 1500)
    },
    onCompleted: () => {
      setCorrectEmail(true);
      nextPhase();
      setTimeout(() => {
        setCorrectEmail(false);
      }, 1500);
    }
  });
  const [verifyData, {loading: loadingVerify, error: errorVerify, data : dataVerify}] = useLazyQuery(VERIFY_DATA, {
    onError: (error) => {
      console.log(error)
    }
  });

  React.useEffect(() => {
    if(dataVerify){
      if(dataVerify.verifyData){
        setCorrectAnswer(true);
        nextPhase();
        setTimeout(() => {
          setCorrectAnswer(false)
        }, 1500);
      }else{
        setErrorAnswer(true);
      setAnswer("");
      setTimeout(() => {
        setErrorAnswer(false)
      }, 1500)
      }
    }
  }, [dataVerify])

  React.useEffect(() => {
    if(dataRecovery){
      setQuestion(dataRecovery.getRecoveryData.recoverQuestion);
    }
  }, [dataRecovery])

  const [correctEmail, setCorrectEmail] = React.useState(false);
  const [errorEmail, setErrorEmail] = React.useState(false);
  const [correctAnswer, setCorrectAnswer] = React.useState(false);
  const [errorAnswer, setErrorAnswer] = React.useState(false);
  const [correctNewPassword, setCorrectNewPassword] = React.useState(false);
  const [errorNewPassword, setErrorNewPassword] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [question, setQuestion] = React.useState("");


  const [passwordError, setPassError] = React.useState(false);
  const [confirmPassError, setConfirmError] = React.useState(false);
  const [phase, setPhase] = React.useState(1);


  

  function checkPassword(str){
    const hasNumber = /\d/.test(str);
    const hasLetter = /[a-zA-Z]/.test(str);
    const hasSpecialSymbol = /[^a-zA-Z0-9]/.test(str);
    const minLength = str.length >= 8;

    return hasNumber && hasLetter && hasSpecialSymbol && minLength;
  }

  React.useEffect( () => {
    if (password.length == 0){
      setPassError(false);
    }
    else if (checkPassword(password)){
      setPassError(false);
    }
    else{
      setPassError(true);
    }
  }, [password]);

  React.useEffect( () => {
    if (confirmPassword.length == 0){
      setConfirmError(false);
    }
    else if (password === confirmPassword){
      setConfirmError(false);
    }
    else{
      setConfirmError(true);
    }
  }, [confirmPassword]);
  
  
  function nextPhase(){
    setPhase(prevPhase => prevPhase + 1);
  }

  function getQuestion(event){
    event.preventDefault();
    getRecovery({
      variables: {
        email: email
      }
    })
  }
  
  function sendAnswer(event){
    event.preventDefault();
    verifyData({
      variables: {
        email: email,
        recoverAnswer: answer
      }
    })
  }

  function sendNewPassword(event){
    event.preventDefault();
    recoverPassword({
      variables: {
        email: email,
        newPassword: password
      }
    })
  }
  return(
    <PageContainer>
      <Title>
        Recupero password
      </Title>
      <CustomForm>
        {phase >= 1 && <div className="w-full"><SectionTitle>Inserisci la mail collegata all'account.</SectionTitle>
        <FormField 
          name="Email" 
          value={email}
          handler={(event) => setEmail(event.target.value)}
          width={"100%;"}
        />
          {phase == 1 && <MainButton fullButton={true} active={email} text="Recupera domanda" onClickFunction={getQuestion} />}
        </div>}
        {phase >= 2 && <div className="w-full">
          <SectionTitle>Inserisci la risposta di recupero</SectionTitle>
          <SectionQuestion><span className="dom">Domanda:</span> <b>{question}</b></SectionQuestion>
          <FormField 
            name="Risposta" 
            value={answer}
            handler={(event) => setAnswer(event.target.value)}
            width={"100%;"}
          />
          {phase == 2 && <MainButton fullButton={true} active={answer} text="Invia risposta" onClickFunction={sendAnswer} />}
          </div>}

        {phase >= 3 && <div className="w-full">
          <SectionTitle> Inserisci la nuova password</SectionTitle>
          <FormField 
            type="password"
            name="Password" 
            value={password}
            handler={(event) => setPassword(event.target.value)}
            width={"100%;"}
            error={passwordError}
            errorMessage={"La password non rispetta i criteri."}
          />
          <FormField 
            type="password"
            name="Conferma password" 
            value={confirmPassword}
            handler={(event) => setConfirmPassword(event.target.value)}
            width={"100%;"}
            error={confirmPassError}
            errorMessage={"Le password non combaciano."}
          />
          {phase == 3 && <MainButton fullButton={true} active={password && confirmPassword && (!passwordError && !confirmPassError)} text="Salva password" onClickFunction={sendNewPassword} />}

          </div>}
      </CustomForm>
      {correctEmail && <CorrectPopUp text="Email corretta."/>}
      {errorEmail && <ErrorPopUp text="Nessun account con questa email."/>}
      {correctAnswer && <CorrectPopUp text="Risposta corretta."/>}
      {errorAnswer && <ErrorPopUp text="Risposta errata."/>}
      {correctNewPassword && <CorrectPopUp text="Password modificata."/>}
      {errorNewPassword && <ErrorPopUp text="Errore nella modifica."/>}
    </PageContainer>

  )
}