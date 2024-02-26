import React from "react";
import FormField from "../components/FormField";
import styled from "styled-components";
import tw from "twin.macro";
import logo from "../images/squealer_logo.png"
import MainButton from "../components/MainButton";
import { useNavigate } from "react-router";
import { mainColor } from "../const";
import { DotLoader } from "react-spinners";
import { gql, useMutation } from "@apollo/client";
import cookies from "../utlis/cookie";
import CorrectPopUp from "../components/CorrectMessage";
import ErrorPopUp from "../components/ErrorMessage";
import { actionTypes, useGlobalState } from "../GlobalStateContext";


const CustomForm = styled.form`
  ${tw`
    w-full
  `}
`;

const LoadingContainer = styled.div`
  ${tw`
      w-full
      flex
      justify-center
  `}
`

const Title = styled.div`
  font-family: 'Horizon';
  color: ${mainColor};
  font-size: 60px;
  font-weight: 700;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const SubTitle = styled.div`
  color: black;
  font-size: 25px;
  font-weight: 600;
  margin-bottom: 120px;
  margin-top: -20px;

  @media (max-width: 768px) {
    margin-top: -10px;
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const PageContainer = styled.div`
  padding-inline: 20%;
  display: flex;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    padding-inline: 5%;
    flex-direction: column;
    align-items: center;
  }
`;

const LoginDiv = styled.div`
  ${tw`
    flex
    flex-col
    items-center
  `}
  width: 45%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ImageDiv = styled.div`
  margin-top: 150px;
  img {
    width: 400px;
    height: 400px;
  }

  @media (max-width: 768px) {
    order: -1;
    margin-top: 0;

    img{
      width: 200px;
      height: 200px;
    }
  }
`;

const ButtonRow = styled.div`
  ${tw`
      w-full
      flex
      justify-between
  `}
`


const ChoiceSentence = styled.div`
  color: black;
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 18px;

  .sentence{
    width: 100%;
    border-bottom: 2px solid black;
    line-height: 0.2em;
    margin: 10px 20px;
  }

  .lines{
    background: white;
    padding: 0 10px;
  }
`

const LOGIN = gql`
  mutation login($loginUserInput: LoginUserInput!){
    login(loginUserInput: $loginUserInput){
      accessToken
      user{
        _id
      }
    }
  }
`

export default function LoginPage(){
  const navigate = useNavigate();

  const [user, setUser] = React.useState({
    username: '',
    password: ''
  });
  const [loginUser, {loading, error, data}] = useMutation(LOGIN, {
    onError: (error) => {
      setNotLogged(true);
      setErrorText(error.message)
      setUser(prevUser => {
        return{
          ...prevUser,
          password: ""
        };
      });
      setTimeout( () => {
        setNotLogged(false);
      }, 2000)
    }
  });

  const [showError, setError] = React.useState(false);
  const [isLogged, setLogged] = React.useState(false);
  const [isNotLogged, setNotLogged] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");

  const {dispatch} = useGlobalState();

  const handleFreeAccess = (userId) => {
    dispatch({
      type: actionTypes.SET_REGISTERED_USER,
      payload: userId
    })
  }

  React.useEffect(() => {
    if (data && data.login) {
      const token = data.login.accessToken;
      cookies.set('accessToken', token, { path: '/' });
      setLogged(true);
      handleFreeAccess(data.login.user._id);
      setTimeout( () => {
        navigate(`/home`);
      }, 1500)
    }
  }, [data]);


  function handleInput(event){
    const {name, value} = event.target;
    setUser( prevUser => {
      return(
        {
          ...prevUser,
          [name]: value,
        }
      )
    });
    if (showError){
      setError(false);
    }
  };

  function handleSubmit(event){
    event.preventDefault();
    loginUser({
      variables: {
        loginUserInput : user
      }
    });
  }


  return(
    <PageContainer>
      <ImageDiv>
        <img src={logo} />
      </ImageDiv>
      <LoginDiv>
        <Title>
          SQUEALER
        </Title>
        <SubTitle><i>Empowering voices, inspiring change</i></SubTitle>
        <CustomForm onSubmit={handleSubmit}>
          <FormField 
            name="Email o username" 
            value={user.username}
            handler={handleInput}
            inputName="username"
            textColor={user.username && true}
            width={"100%;"}
          />
          <FormField 
            name="Password" 
            inputName="password" 
            value={user.password}
            handler={handleInput}
            textColor={user.password && true}
            type="password"
            width={"100%;"}

          />
          {!loading && <ButtonRow>
            <MainButton type={"submit"} fullButton={true} width="48%" text="Accedi" onClickFunction={handleSubmit} active={"true"}/>
            <MainButton width="48%" text="Registrati" onClickFunction={() => {navigate('/registration')}} active={"true"}/>
          </ButtonRow>}
          {loading &&
            <LoadingContainer>
              <DotLoader color={mainColor} loading={loading} size={80}/>
            </LoadingContainer>}
          <ChoiceSentence>
            <span className="sentence"><span className="lines">oppure</span></span>
          </ChoiceSentence>
          <ButtonRow>
            <MainButton width="100%" text="Continua senza accedere" active={"true"} onClickFunction={() => {navigate('/home')}}/>
          </ButtonRow>
          <ButtonRow>
            <MainButton width="100%" text="Recupera password" active={"true"} onClickFunction={() => {navigate('/recoverPassword')}}/>
          </ButtonRow>
        </CustomForm>
      {isLogged && <CorrectPopUp text="Accesso effettuato con successo"/>}
      {isNotLogged && <ErrorPopUp text={errorText} />}
      </LoginDiv>
    </PageContainer>
  )
}