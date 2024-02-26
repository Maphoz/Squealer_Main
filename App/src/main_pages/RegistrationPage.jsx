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
import { gql, useMutation } from "@apollo/client";
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

const CustomForm = styled.form`
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

const REGISTER_USER = gql`
  mutation createUser($createUserData: CreateUserInput!){
    createUser(createUserData: $createUserData)
  }
`

const COMPLETE_REGISTRATION = gql`
mutation registerBioAndImage($userId: String!, $file: Upload!, $bio: String!){
  registerBioAndImage(userId: $userId, file: $file, bio: $bio)
}
`

export default function RegistrationPage(){
  const maxChars = 250;
  const navigate = useNavigate();
  const [image, setImage] = React.useState();
  const [file, setFile] = React.useState();
  const [createUser, {loading, error, data}] = useMutation(REGISTER_USER, {
    onError: () => {
      setNotCreated(true);
      setUserInfo(prevUser => {
        return{
          email: "",
          password: "",
          confirmPassword: "",
          username: "",
          nome: "",
          cognome: "",
          recoveryAnswer: "",
          recoveryQuestion: "",
          typeOfUser: "USER_NORMALE"
        };
      });
      setTimeout( () => {
        setNotCreated(false);
      }, 2000)
    }
  });
  const [completeRegistration, {loadingComplete, errorComplete, dataComplete}] = useMutation(COMPLETE_REGISTRATION, {
    onError: () => {
      setNotCompleted(true);
      setBio("");
      setFile(null);
      setTimeout( () => {
        setNotCompleted(false);
      }, 2000)
    },
    onCompleted: () => {
      setCompleted(true);
      setTimeout( () => {
        setCompleted(false);
        navigate('/');
      }, 1500);
    }
  });
  const [userInfo, setUserInfo] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    nome: "",
    cognome: "",
    recoveryAnswer: "",
    recoveryQuestion: "",
    typeOfUser: "USER_NORMALE"
  });

  const [passwordError, setPassError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [confirmPassError, setConfirmError] = React.useState(false);
  const [activeButton, setActive] = React.useState(false);
  const [phase, setPhase] = React.useState("1");
  const [bio, setBio] = React.useState("");
  const [remainingChars, setRemaining] = React.useState(maxChars);
  const fileInputRef = React.useRef(null);
  const [showCam, setCam] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  const [created, setCreated] = React.useState(false);
  const [notCreated, setNotCreated] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [notCompleted, setNotCompleted] = React.useState(false);

  function handleFileUpload() {
    fileInputRef.current.click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      setFile(file);
      convertToBase64(file);
    }
  }

  function handleBio(event){
    const {value} = event.target;
    if (value.length <= maxChars){
      setBio(value);
      setRemaining(maxChars - value.length);
    }
  }

  function handleInput(event){
    const {name, value} = event.target;
    setUserInfo(prevUser => {
      return({
        ...prevUser,
        [name]: value
      })
    });
  };

  function checkPassword(str){
    const hasNumber = /\d/.test(str);
    const hasLetter = /[a-zA-Z]/.test(str);
    const hasSpecialSymbol = /[^a-zA-Z0-9]/.test(str);
    const minLength = str.length >= 8;

    return hasNumber && hasLetter && hasSpecialSymbol && minLength;
  }

  React.useEffect( () => {
    if (userInfo.password.length == 0){
      setPassError(false);
    }
    else if (checkPassword(userInfo.password)){
      setPassError(false);
    }
    else{
      setPassError(true);
    }
  }, [userInfo.password]);

  React.useEffect( () => {
    if (userInfo.confirmPassword.length == 0){
      setConfirmError(false);
    }
    else if (userInfo.password === userInfo.confirmPassword){
      setConfirmError(false);
    }
    else{
      setConfirmError(true);
    }
  }, [userInfo.confirmPassword]);

  React.useEffect( () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userInfo.email === ""){
      setEmailError(false);
    }
    else{
      setEmailError(!emailRegex.test(userInfo.email));
    }
  }, [userInfo.email]);

  React.useEffect( () => {
    if (userInfo.nome && userInfo.cognome && userInfo.password && userInfo.confirmPassword && userInfo.username && userInfo.email && userInfo.recoveryAnswer && userInfo.recoveryQuestion && (!passwordError && !emailError && !confirmPassError)){
      setActive(true);
    }
    else{
      setActive(false);
    }
  }, [userInfo.email, userInfo.cognome, userInfo.nome, userInfo.password, userInfo.confirmPassword, userInfo.username, passwordError, emailError, confirmPassError, userInfo.recoveryAnswer, userInfo.recoveryQuestion])

  React.useEffect( ( ) => {
    if(data){
      setUserId(data.createUser);
      setCreated(true);
      setTimeout( ( ) => {
        nextPhase();
      }, 1500)
    }
  }, [data])
  
  
  function nextPhase(){
    setPhase("2");
  }

  function convertToBase64(file) {
    setFile(file);

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const base64String = e.target.result;
        setImage(base64String);
      };

      reader.readAsDataURL(file);
    }
  }

  const showWebcam = () => {
    setCam(true);
  };

  const handleWebcamCaptureClose = () => {
    setCam(false);
  };

  function registerUser(){
    createUser({
      variables: {
        createUserData: {
          email: userInfo.email,
          nome: userInfo.nome,
          cognome: userInfo.cognome,
          password: userInfo.password,
          typeOfUser: userInfo.typeOfUser,
          username: userInfo.username,
          recoveryQuestion: userInfo.recoveryQuestion,
          recoveryAnswer: userInfo.recoveryAnswer
        }
      }
    })
  }

  function completeReg(){
    if(file || bio){
        completeRegistration({
          variables:{
            userId: userId,
            file: file,
            bio: bio 
          },
          context: {
            headers: {
              'Access-Control-Request-Headers': 'content-type',
              'x-apollo-operation-name': 'singleUpload',
            },
          },
        })
    }
    else{
      setCompleted(true);
      setTimeout( () => {
        setCompleted(false);
        navigate('/');
      }, 1500);
    }
  }

  return(
    phase == "1" ? (<PageContainer>
      <Title>
        Registrati
      </Title>
      <CustomForm>
        <FormRow>
          <FormField 
            name="Nome" 
            value={userInfo.nome}
            handler={handleInput}
            inputName="nome"
            width={"48%;"}
          />
          <FormField 
            name="Cognome" 
            value={userInfo.cognome}
            handler={handleInput}
            inputName="cognome"
            width={"48%;"}
          />
        </FormRow>
        <FormField 
          name="Email" 
          value={userInfo.email}
          handler={handleInput}
          inputName="email"
          width={"100%;"}
          error={emailError}
          errorMessage={"L'email non ha un formato corretto."}
        />
        <FormField 
          name="Username" 
          value={userInfo.username}
          handler={handleInput}
          inputName="username"
          width={"100%;"}
        />
        <FormField 
          type="password"
          name="Password" 
          value={userInfo.password}
          handler={handleInput}
          inputName="password"
          width={"100%;"}
          error={passwordError}
          errorMessage={"La password non rispetta i criteri."}
        />
        <FormField 
          type="password"
          name="Conferma password" 
          value={userInfo.confirmPassword}
          handler={handleInput}
          inputName="confirmPassword"
          width={"100%;"}
          error={confirmPassError}
          errorMessage={"Le password non combaciano."}
        />
        <FormField 
          type="text"
          name="Domanda di sicurezza" 
          value={userInfo.recoveryQuestion}
          handler={handleInput}
          inputName="recoveryQuestion"
          width={"100%;"}
        />
        <FormField 
          type="text"
          name="Risposta di recupero" 
          value={userInfo.recoveryAnswer}
          handler={handleInput}
          inputName="recoveryAnswer"
          width={"100%;"}
        />
        {!loading && <div style={{width: '100%'}}>
        <MainButton active={activeButton ? "true" : ''} text="Registrati e continua" fullButton="fullButton" height={"35px"} onClickFunction={registerUser} width={"100%"}/>
        <MainButton active={"true"} text="Torna al login" height={"35px"} onClickFunction={ () => {navigate('/')}} width={"100%"}/></div>}
      </CustomForm>
      {loading &&
      <DotLoader color={mainColor} loading={loading} size={80}/>}
      {
        created && <CorrectPopUp text="Profilo creato con successo"/>
      }
      {
        notCreated && <ErrorPopUp text="Profilo non creato"/>
      }
    </PageContainer>) :

    (<PageContainer>
      <Title>
        Completa profilo
      </Title>
      <CustomDiv>
        <ImageContainer>
          <img src={image || no_image} alt="immagine profilo" />
        </ImageContainer>
        <ButtonRow>
          <MainButton width="48%;" text="Selfie" fullButton={false} active={"true"} onClickFunction={showWebcam}/>
          <MainButton width="48%;" text="Carica" fullButton={true} active={"true"} onClickFunction={handleFileUpload}/>
          <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(event) => handleFileChange(event)}
        />
        </ButtonRow>
        <BiographyContainer>
          <SmallTitle>
            Descriviti in qualche parola <span className="optional">(opzionale)</span>
          </SmallTitle>
          <StyledText value={bio} onChange={handleBio}>

          </StyledText>
          {remainingChars > 0 ? <Appendix>Caratteri rimanenti: {remainingChars}</Appendix> : <Appendix className="red">Hai esaurito i caratteri per la bio!</Appendix>}
        </BiographyContainer>
        {!loadingComplete && <MainButton text="Completa registrazione" fullButton={true} active={"true"} width="100%" onClickFunction={completeReg}/>}
      </CustomDiv>
      {showCam && (
        <ImageModal onClose={handleWebcamCaptureClose}>
          <WebcamCapture onCaptureComplete={(capturedImage) => convertToBase64(capturedImage)}  onClose={handleWebcamCaptureClose}/>
        </ImageModal>
      )}
      {loadingComplete && <DotLoader loading={loadingComplete} size={80} color={mainColor}/>}
      {
        completed && <CorrectPopUp text="Profilo completato con successo"/>
      }
      {
        notCompleted && <ErrorPopUp text="Profilo non completato"/>
      }
      </PageContainer>
    )
  )
}