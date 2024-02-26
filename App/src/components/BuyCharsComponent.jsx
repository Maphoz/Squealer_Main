import React, { Fragment } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { CenterPageContainer, CenterTitle, InfoTextContainer } from "../constStyles";
import { useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import MainButton from "./MainButton";
import { greyColor, mainColor } from "../const";
import { Dialog, Transition } from "@headlessui/react";
import CorrectPopUp from "./CorrectMessage";
import ErrorPopUp from "./ErrorMessage";
import { actionTypes, useGlobalState } from "../GlobalStateContext";

export const GET_MY_ACCOUNT = gql`
query getMyAccount{
  getMyAccount{
     __typename
  ... on BasicUser {
    _id
    email
    username
    nome
    cognome
    userType
    caratteri_giornalieri_rimanenti
    caratteri_settimanali_rimanenti
    caratteri_mensili_rimanenti
    caratteri_giornalieri
    caratteri_settimanali
    caratteri_mensili
    caratteri_acquistabili_rimanenti
    profileImage
    friends
    popularityIndex
    channels
    bio
    squeals 
    history{
      id
      type
    }
  }
  }
}
`;

const CharRemainingContainer = styled.div`
  font-size: 18px;
  font-weight: 600px;
  margin-bottom: 10px;
`
const CardContainer = styled.div`
  ${tw`
      flex
      flex-row
      justify-around
      items-center
      px-2
      mt-4
  `}

  @media(max-width: 576px){
    flex-direction: column;
    padding-inline: 10%;
  }
  padding-bottom: 70px;
`

const VipCard = styled.div`
  ${tw`
      flex
      justify-center
      w-full
      m-2
      py-2
  `}

  border: 2px solid ${mainColor};
  border-radius: 5px;

  .centerDiv{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .smallTitle{
    font-size: 1.4em;
    font-weight: 700;
    padding-inline: 5px;
    color: ${mainColor};
  }

  .paymentCost{
    font-size: 1.8em;
    font-weight: 700;
    padding-inline: 15px;
    color:${mainColor};
    margin-bottom: 10px;
  }

  .tariffa{
    font-size: 12px;
    margin-bottom: 20px;
  }

  .greyDescription{
    font-size: 16px;
    color: ${greyColor};
    margin-bottom: 30px;
    padding-inline: 10px;
    text-align: center;
  }

  @media(max-width:576px){
    width: 250px;
    
    .smallTitle{
      font-size: 1.3em;
      font-weight: 700;
      padding-inline: 5px;
      color: ${mainColor};
    }
  
    .paymentCost{
      font-size: 1.6em;
      font-weight: 700;
      padding-inline: 15px;
      color:${mainColor};
      margin-bottom: 10px;
    }
  
    .tariffa{
      font-size: 12px;
      margin-bottom: 20px;
    }
  
    .greyDescription{
      font-size: 14px;
      color: ${greyColor};
      margin-bottom: 30px;
      padding-inline: 10px;
      text-align: center;
    }
  }
`

const InputRow = styled.div`
  ${tw`
      flex
      items-start
  `}  
  font-size: 18px;
  span{
    margin-right: 10px;
  }

  @media(max-width: 576px){
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
`

const InputDiv = styled.div`
  ${props => props.charerror && 'color: red'};

  input{
    ${props => props.charerror ? `border: 2px solid red;` : `border: 2px solid lightgrey;`}
    border-radius: 5px;
    padding-left: 10px;
  }

  input:focus{
    ${props => props.charerror ? `border: 2px solid red;` : `border: 2px solid #8FDB8F;`}
    ${props => props.charerror ? `box-shadow: 0px 0px 1px 1px red;` : `box-shadow: 0px 0px 1px 1px #8FDB8F;`}
    outline: none;
  }  
`

const ErrorMessage = styled.div`
  font-size: 12px;
  color: red;
`

const BUY_CHARS = gql`
  mutation addChars($chars: Float!, $period: String!){
    addChars(chars: $chars, period: $period){
      _id
      email
      username
      nome
      cognome
      userType
      caratteri_giornalieri
      caratteri_settimanali
      caratteri_mensili
      caratteri_giornalieri_rimanenti
      caratteri_settimanali_rimanenti
      caratteri_mensili_rimanenti
      caratteri_acquistabili_rimanenti
      profileImage
      friends
      popularityIndex
      channels
      bio
      squeals 
      history{
        id
        type
      }
    }
  }
`

const CardsContainer = styled.div`
  ${tw`
      w-full
  `}

  .mainCardsContainer{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .mainCard{
    display: flex;
    padding: 10px 5px 10px 15px;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 0px 0px 10px 2px lightgray;
    border-radius: 15px;
    width: 180px;
    background: #fafafa;
    margin-bottom: 15px;
  }
  
  .mainCard:hover{
    box-shadow: 0px 0px 10px 2px ${mainColor}66;
  }
  .cardInfo{
    display: flex;
    align-items: center;
  }
  .letterContainer{
    color: ${mainColor};
    background: ${mainColor}44;
    border-radius: 50%;
    margin-right: 10px;
    font-size: 20px;
    font-weight: 700;
    display: flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
  }
  .cardTitle{
    font-size: 18px;
    color: grey;
  }
  .cardValue{
    font-size: 22px;
    color: ${mainColor};
    font-weight: 600;
    margin-left: 10px;
    margin-top: -5px;
  }

  @media(max-width: 576px){
    .mainCardsContainer{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .mainCard{
      display: flex;
      padding: 10px 5px 10px 10px;
      flex-direction: column;
      align-items: flex-start;
      box-shadow: 0px 0px 10px 2px lightgray;
      border-radius: 15px;
      width: 100px;
      background: #fafafa;
      margin-bottom: 15px;
    }
    
    .mainCard:hover{
      box-shadow: 0px 0px 10px 2px ${mainColor}66;
    }
    .cardInfo{
      display: flex;
      align-items: center;
    }
    .letterContainer{
      color: ${mainColor};
      background: ${mainColor}44;
      border-radius: 50%;
      margin-right: 0px;
      font-size: 18px;
      font-weight: 700;
      display: flex;
      width: 25px;
      height: 25px;
      align-items: center;
      justify-content: center;
    }
    .cardTitle{
      font-size: 18px;
      color: grey;
    }

    .period{
      display: none;
    }
    .cardValue{
      font-size: 16px;
      color: ${mainColor};
      font-weight: 600;
      margin-left: 5px;
      margin-top: 0px;
    }
  }
`

const TitleCards = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: grey;

  @media(max-width:576px){
    font-size: 18px;
  }
`

export default function BuyCharsComponent(){
  const navigate = useNavigate();

  const {loading: loadingUser, error: errorUser, data : dataUser, refetch} = useQuery(GET_MY_ACCOUNT);
  const [addChars, {loading: loadingPurchase, error: errorPurchase, data : dataPurchase}] = useMutation(BUY_CHARS, {
    onError: () => {
      setErrorPurchase(true);
      setTimeout(() => {
        setErrorPurchase(false)
      }, 1500)
    },
    onCompleted: () => {
      setCorrectPurchase(true);
      toggleChars();
      setTimeout(() => {
        setCorrectPurchase(false)
      }, 1500)
    }
  });
  const [user, setUser] = React.useState();
  const [charsToPurchase, setChars] = React.useState(0);
  const [charError, setCharError] = React.useState(false);
  const [purchaseCorrect, setCorrectPurchase] = React.useState(false);
  const [purchaseError, setErrorPurchase] = React.useState(false);

  React.useEffect( () => {
    if(dataUser){
      setUser({...dataUser.getMyAccount})
    }
  }, [dataUser])

  React.useEffect( () => {
    if(dataPurchase){
      setUser({...dataPurchase.addChars})
    }
  }, [dataPurchase])

  function handleInput(e){
    setChars(e.target.value);
  }

  React.useEffect( () => {
    if(user){
      if(charsToPurchase > user.caratteri_acquistabili_rimanenti){
        setCharError(true);
      }
      else if(charError) setCharError(false);
  }
  }, [charsToPurchase])

  const [isOpenAdd, setIsOpenAdd] = React.useState(false);
  const [expectedCost, setCost] = React.useState();
  const [period, setPeriod] = React.useState();

  function closeAdd(){
    setIsOpenAdd(false);
  }

  function openCostVerification(cost, period){
    setCost(cost);
    setPeriod(period);
    setIsOpenAdd(true);
  }

  function buyChars(){
    addChars({
      variables: {
        chars: parseFloat(charsToPurchase),
        period: period
      }
    })
    setIsOpenAdd(false);
  }

  const {state, dispatch} = useGlobalState();

  const handleRefetched = () => {
    dispatch({
      type: actionTypes.TOGGLE_DATA_UPDATE,
      payload: 'buyCharacterData',
    });
  }
  
  const toggleChars = () => {
    dispatch({
      type: actionTypes.SET_SELECTED_TRUE,
      payload: ['homeData']
    })
  }

  React.useEffect(() => {
    if(state.dataUpdated.buyCharacterData){
      refetch();
      handleRefetched();
    }
  }, []);

  return(
    <CenterPageContainer>
      <CenterTitle>Acquista caratteri</CenterTitle>
      <InfoTextContainer>Puoi procedere ad acquistare caratteri aggiuntivi. Se sei un normale utente, hai un limite ai caratteri aggiuntivi che puoi acquistare. Se acquisti <a className="coloredText bold" onClick={() => navigate('/vipSubscription')}>l'abbonamento vip,</a> potrai acqusitare caratteri aggiuntivi illimitati. <br/>
      Per gli utenti normali, ogni mese si possono riacquistare i caratteri aggiuntivi.</InfoTextContainer>
      {user && 
        <CardsContainer>
        <TitleCards>Caratteri base</TitleCards>
        <div className="mainCardsContainer">
        <div className="mainCard">
          <div className="cardInfo">
            <div className="letterContainer">
              G
            </div>
            <div className="cardTitle">
              <span className="period">Giornalieri</span>
              <div className="cardValue">
                { user.caratteri_giornalieri }
              </div>
            </div>
          </div>
        </div>
        <div className="mainCard">
          <div className="cardInfo">
            <div className="letterContainer">
              S
            </div>
            <div className="cardTitle">
            <span className="period">Settimanali</span>
              <div className="cardValue">
                { user.caratteri_settimanali }
              </div>
            </div>
          </div>
        </div>
        <div className="mainCard">
          <div className="cardInfo">
            <div className="letterContainer">
              M
            </div>
            <div className="cardTitle">
            <span className="period">Mensili</span>
              <div className="cardValue">
                { user.caratteri_mensili }
              </div>
            </div>
          </div>
        </div>
      </div>
      </CardsContainer>
      }
      {user && 
        <CardsContainer>
          <TitleCards>Caratteri rimanenti</TitleCards>
        <div className="mainCardsContainer">
        <div className="mainCard">
          <div className="cardInfo">
            <div className="letterContainer">
              G
            </div>
            <div className="cardTitle">
            <span className="period">Giornalieri</span>
              <div className="cardValue">
                { user.caratteri_giornalieri_rimanenti }
              </div>
            </div>
          </div>
        </div>
        <div className="mainCard">
          <div className="cardInfo">
            <div className="letterContainer">
              S
            </div>
            <div className="cardTitle">
            <span className="period">Settimanali</span>
              <div className="cardValue">
                { user.caratteri_settimanali_rimanenti }
              </div>
            </div>
          </div>
        </div>
        <div className="mainCard">
          <div className="cardInfo">
            <div className="letterContainer">
              M
            </div>
            <div className="cardTitle">
            <span className="period">Mensili</span>
              <div className="cardValue">
                { user.caratteri_mensili_rimanenti }
              </div>
            </div>
          </div>
        </div>
      </div>
      </CardsContainer>
      }
      {user && user.userType == 'USER_NORMALE' &&
        <CharRemainingContainer>
          Caratteri acquistabili rimanenti: <span className="coloredText bold">{user.caratteri_acquistabili_rimanenti}</span>
        </CharRemainingContainer>
      }
      <InputRow>
        <span>Quanti caratteri vuoi acquistare?</span>
        <InputDiv charerror={charError ? "true" : ''}>
          <input 
            type="number"
            value={charsToPurchase}
            onChange={handleInput}
          />
          {charError && <ErrorMessage>
              Hai superato il numero di caratteri acquistabile
            </ErrorMessage>}
        </InputDiv>
      </InputRow>
      {user && user.userType == 'USER_NORMALE' &&
        <CardContainer>
            <VipCard>
              <div className="centerDiv"> 
                <div className="smallTitle">Giornalieri</div>
                <div className="tariffa">(0.05€/carattere)</div>
                <div className="paymentCost">Totale €{(charsToPurchase * 0.05).toFixed(2)}</div>
                <div className="greyDescription">Acquista caratteri validi oggi.</div>
                <MainButton width={"60%"} text={"Acquista"} fullButton={true} active={"true"} onClickFunction={() => openCostVerification((charsToPurchase * 0.05).toFixed(2), "giornalieri")}/>
              </div>
            </VipCard>
            <VipCard>
              <div className="centerDiv"> 
                <div className="smallTitle">Settimanali</div>
                <div className="tariffa">(0.10€/carattere)</div>
                <div className="paymentCost">Totale €{(charsToPurchase * 0.1).toFixed(2)}</div>
                <div className="greyDescription">Acquista caratteri validi questa settimana.</div>
                <MainButton width={"60%"} text={"Acquista"} fullButton={true} active={"true"} onClickFunction={() => openCostVerification((charsToPurchase * 0.1).toFixed(2), "settimanali")}/>
              </div>
            </VipCard>
            <VipCard>
              <div className="centerDiv"> 
                <div className="smallTitle">Mensili</div>
                <div className="tariffa">(0.40€/carattere)</div>
                <div className="paymentCost">Totale €{(charsToPurchase * 0.4).toFixed(2)}</div>
                <div className="greyDescription">Acquista caratteri validi questo mese.</div>
                <MainButton width={"60%"} text={"Acquista"} fullButton={true} active={"true"} onClickFunction={() => openCostVerification((charsToPurchase * 0.4).toFixed(2), "mensili")}/>
              </div>
            </VipCard>
        </CardContainer>
      }
      {user && user.userType == 'VIP' &&
        <CardContainer>
            <VipCard>
              <div className="centerDiv"> 
                <div className="smallTitle">Giornalieri</div>
                <div className="tariffa">(0.02€/carattere)</div>
                <div className="paymentCost">Totale €{(charsToPurchase * 0.02).toFixed(2)}</div>
                <div className="greyDescription">Acquista caratteri da spendere oggi.</div>
                <MainButton width={"60%"} text={"Acquista"} fullButton={true} active={"true"} onClickFunction={() => openCostVerification((charsToPurchase * 0.02).toFixed(2), "giornalieri")}/>
              </div>
            </VipCard>
            <VipCard>
              <div className="centerDiv"> 
                <div className="smallTitle">Settimanali</div>
                <div className="tariffa">(0.05€/carattere)</div>
                <div className="paymentCost">Totale €{(charsToPurchase * 0.05).toFixed(2)}</div>
                <div className="greyDescription">Acquista caratteri da spendere questa settimana.</div>
                <MainButton width={"60%"} text={"Acquista"} fullButton={true} active={"true"} onClickFunction={() => openCostVerification((charsToPurchase * 0.05).toFixed(2), "settimanali")}/>
              </div>
            </VipCard>
            <VipCard>
              <div className="centerDiv"> 
                <div className="smallTitle">Mensili</div>
                <div className="tariffa">(0.20€/carattere)</div>
                <div className="paymentCost">Totale €{(charsToPurchase * 0.2).toFixed(2)}</div>
                <div className="greyDescription">Acquista caratteri da spendere questo mese.</div>
                <MainButton width={"60%"} text={"Acquista"} fullButton={true} active={"true"} onClickFunction={() => openCostVerification((charsToPurchase * 0.2).toFixed(2), "mensili")}/>
              </div>
            </VipCard>
        </CardContainer>
      }
      {isOpenAdd && <Transition appear show={isOpenAdd} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeAdd}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>
  
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Conferma acquisto
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-md text-gray-500">
                      Sei sicuro di voler acquistare <b>{charsToPurchase}</b> caratteri {period} a <b>€{parseFloat(expectedCost).toFixed(2)}</b>?
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => buyChars()}
                    >
                      Conferma
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => closeAdd()}
                    >
                      Annulla
                    </button>
                  </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>}
        {purchaseCorrect && <CorrectPopUp text="Caratteri acquistati" />}
        {purchaseError && <ErrorPopUp text="Caratteri non acquistati" />}
    </CenterPageContainer>
  )
}