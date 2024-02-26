import tw from "twin.macro"
import styled from "styled-components"
import { greyColor, mainColor } from "./const"

export const CenterPageContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  width: 50%;
  padding-inline: 20px;

  @media (max-width:576px){
    width: 100%;
    margin-top: 0px;
  }

  .coloredText{
    color: ${mainColor};
  }

  .bold{
    font-weight: 600;
  }

  a{
    cursor: pointer;
  }
`

export const CenterTitle = styled.div`
font-size: 30px;
font-weight: 600;
margin-bottom: 40px;
text-align: center;

@media (max-width:576px){
  width: 100%;
  margin-bottom: 20px;
}
`

export const InfoTextContainer = styled.span`
  font-size: 16px;
  margin-bottom: 15px;

  .red{
    color: red;
  }
`

export const SectionDescription = styled.span`
  width: 100%;  
  font-size: 18px;
  margin-bottom: 15px;
  justify-content: center;
  text-align: center;
  display: flex;
  color: ${mainColor};
  font-weight: 600;
  border: 1px solid ${mainColor};
  border-radius: 15px;
  padding: 3px 30px;

  .red{
    color: red;
  }

  @media(max-width:576px){
    font-size: 16px;
  }
`

export const NoItems = styled.div`
  @keyframes appear{
    0%{
      transform: TranslateY(20px);
      opacity: 0;
    }
    100%{
      transform: TranslateY(0px);
      opacity: 1;
    }
  }

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
      w-80
      flex-col
      text-white
      font-semibold
      justify-center
      items-center
  `}


  animation: appear 0.5s ease-in-out;

  span {
    font-size: 14px;
  }

  img{
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
    animation: shake 0.5s ease-in-out 0.5s;
  }

  @media(max-width:576px){
    width: 100%;
    margin-top: 50%;
  }
`

export const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  width: 80%;
  background: black;
  padding: 10px 30px;
  border-radius: 15px;
  text-align: center;

`
/*
  <NoItems>
    <img src={roundAlert} />
    <MessageContainer>
      <span>Sembra che tu non abbia registrato acquisti o vendite! Hai comprato o venduto qualcosa?</span>
    </MessageContainer>
    <MainButton active={true} text="Aggiungi" onClickFunction={() => {navigate('/nuovoOggetto');}}/>
  </NoItems>

  */