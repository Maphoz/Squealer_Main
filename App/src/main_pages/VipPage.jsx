import React, { Fragment } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Navbar from "../components/Navbar";
import Trending from "./Trending";
import { greyColor, mainColor } from "../const";
import MainButton from "../components/MainButton"
import { Dialog, Transition } from "@headlessui/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import CorrectPopUp from "../components/CorrectMessage";
import ErrorPopUp from "../components/ErrorMessage";
import { ResponsiveDisappearDiv } from "./HomePage";
import Header from "../components/Header";
import { actionTypes, useGlobalState } from "../GlobalStateContext";
import vip from "../images/vipIcon.png"

export const PageContainer = styled.div`
  display: flex;
`

const VipPageContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
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
  padding-bottom: 100px;
  line-height: 1.3;
`

const PageTitleContainer = styled.div`
  ${tw`
      w-full
      flex
      justify-center
  `}

  font-size: 30px;
  font-weight: 600;
  margin-bottom: 40px;

  @media (max-width:576px){
    width: 100%;
    margin-bottom: 20px;
  }
`

const VipInfoTextContainer = styled.span`
  font-size: 16px;
  margin-bottom: 30px;
`

const AlreadyVip = styled.div`
  ${tw`
      w-full
      flex
      flex-col
      items-center
  `}
`

const StyledButton = styled.button`
  color: white;
  ${tw`
    px-2
    mt-4
  `}
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background-color: red;
  margin-bottom: 15px;
  margin-right: 0px;

  &:hover {
    color: red;
    background-color: white;
    transition: 0.3s ease-in-out;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 10px;
  }

  @media (max-width: 576px) {
    font-size: 14px;
    margin-bottom: 5px;
  }

  border: 1px solid red;
`

const AlreadyVipContainer = styled.span`
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
  text-align: center;
`

const VipIcon = styled.div`
  ${tw`
      w-full
      flex
      justify-center
      mb-3
  `}
  img{
    width: 50px;
    height: 50px;
  }

  @media(max-width:576px){
    img
    {width: 40px;
    height: 40px;}
  }
`


const VipInfoList = styled.ul`
  list-style-type:disc;
  margin-bottom: 20px;
  padding-left: 30px;
`

const VipInfoItem = styled.li`
  margin-bottom: 10px;
`

const VipCard = styled.div`
${tw`
    flex
    justify-center
    w-full
    py-2
`}

.centerDiv{
  border: 2px solid ${mainColor};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 50%;
  padding: 15px 0px;
}

@media(max-width: 576px){
  .centerDiv{
    max-width: 75%;
  }
}

.smallTitle{
  font-size: 25px;
  font-weight: 700;
  padding-inline: 15px;
  color: ${mainColor};
  text-align: center;
}

.paymentCost{
  font-size: 25px;
  font-weight: 700;
  padding-inline: 15px;
  color:${mainColor};
  margin-bottom: 10px;
}

.tariffa{
  font-size: 14px;
  margin-bottom: 10px;
}

.greyDescription{
  font-size: 16px;
  color: ${greyColor};
  margin-bottom: 20px;
  padding-inline: 10%;
  text-align: center;
}
`

const UPGRADE_VIP = gql`
  mutation upgradeToVip{
    upgradeToVip{
      _id
      email
      username
      nome
      cognome
      userType
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

const DOWNGRADE_VIP = gql`
  mutation downgradeVip{
    downgradeVip{
      _id
      email
      username
      nome
      cognome
      userType
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

const GET_MY_PROFILE = gql`
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
`

export default function VipPage(){
  const [isOpenAdd, setIsOpenAdd] = React.useState(false);
  const {loading: loadingMyProfile, error: errorMyProfile, data: dataMyProfile, refetch: refetchProfile} = useQuery(GET_MY_PROFILE);
  const [upgradeVip, {loading: loadingVip, error: errorVip, data : dataVip}] = useMutation(UPGRADE_VIP, {
    onError: () => {
      setErrorVip(true);
      setTimeout(() => {
        setErrorVip(false)
      }, 1500)
    },
    onCompleted: () => {
      setCorrectVip(true);
      toggleVipChange();
      refetchProfile();
      setTimeout(() => {
        setCorrectVip(false)
      }, 1500)
    }
  });
  const [downgradeVip, {loading: loadingDowngraade, error: errorDowngraade, data : dataDowngraade}] = useMutation(DOWNGRADE_VIP, {
    onError: () => {
      setErrorDowngrade(true);
      setTimeout(() => {
        setErrorDowngrade(false)
      }, 1500)
    },
    onCompleted: () => {
      setCorrectDowngrade(true);
      toggleVipChange();
      refetchProfile();
      setTimeout(() => {
        setCorrectDowngrade(false)
      }, 1500)
    }
  });
  const [vipCorrect, setCorrectVip] = React.useState(false);
  const [vipError, setErrorVip] = React.useState(false);
  const [downgradeCorrect, setCorrectDowngrade] = React.useState(false);
  const [downgradeError, setErrorDowngrade] = React.useState(false);
  const [myAccount, setMyAccount] = React.useState();
  React.useEffect( ( ) => {
    if(dataMyProfile){
      setMyAccount({...dataMyProfile.getMyAccount})
    }
  }, [dataMyProfile])

  function closeAdd(){
    setIsOpenAdd(false);
  }

  function updateVip(){
    upgradeVip();
    setIsOpenAdd(false);
  }

  const [isOpenDelete, setDelete] = React.useState(false);

  function closeDelete(){
    setDelete(false);
  }

  function downgradeUser(){
    downgradeVip();
    setDelete(false);
  }

  const {state, dispatch} = useGlobalState();

  const toggleVipChange = () => {
    dispatch({
      type: actionTypes.SET_SELECTED_TRUE,
      payload: ['profileData', 'buyCharacterData', 'homeData']
    })
  }

  return(
    <div>
     <Header menuPage={"vip"}/> 
    <PageContainer>
      <Navbar currentPage={"vipCreation"}/>
      <VipPageContainer>
        <PageTitleContainer>
          <span>Diventa <span className="coloredText">VIP!</span></span>
        </PageTitleContainer>
        {myAccount && myAccount.userType !== 'VIP' && <div><VipInfoTextContainer>
          Lo status VIP ti garantisce numerosi benefici all'interno della nostra piattaforma. Grazie a questi vantaggi, potrai aumentare la tua popolarità, accrescrescere
          la tua attività e migliorare i tuoi rientri, oltre a una migliore esperienza sul social <span className="coloredText bold">Squealer!</span> Ma adesso, elenchiamo questi vantaggi:
        </VipInfoTextContainer>
        <VipInfoList>
          <VipInfoItem>
            Puoi assumere un <span className="coloredText bold">Social Media Manager,</span> un professionista che ti aiuterà nel gestire il tuo profilo, monitorando statistiche, interazioni e aiutandoti nella creazione di contenuti;
          </VipInfoItem>
          <VipInfoItem>
            Puoi acquistare caratteri aggiuntivi <span className="coloredText bold">illimitatamente e scontati</span>. Non sarai mai impossibilitato a postare nuovi Squeal, per rimanere sempre in contatto con i tuoi amici e follower;
          </VipInfoItem>
          <VipInfoItem>
            Puoi craere <span className="coloredText bold">canali personali, </span>interamente gestiti da te, permettendoti di creare un rapporto più personale con follower e amici, gestendo i membri di questi canali.
          </VipInfoItem>
        </VipInfoList>
        <VipInfoTextContainer>
          Se questi vantaggi ti hanno persuaso, scegli il piano di sotto ed entra a far parte degli utenti VIP di Squealer!
        </VipInfoTextContainer>
        <VipCard>
          <div className="centerDiv"> 
            <div className="coloredDiv"></div>
            <div className="smallTitle">Diventa VIP!</div>
            <div className="tariffa">Rinnovo automatico</div>
            <div className="paymentCost">€5 / mese</div>
            <div className="greyDescription">L'abbonamento ti permette di ottenere tutti i benefici sopra indicati</div>
            <MainButton text={"Acquista abbonamento"} fullButton={true} active={"true"} onClickFunction={() => setIsOpenAdd(true)}/>
          </div>
        </VipCard></div>}

        {myAccount && myAccount.userType === 'VIP' && <AlreadyVip>
        <VipIcon>
          <img src={vip} /> 
        </VipIcon>
        <AlreadyVipContainer>
          Congratulazioni, sei già un utente Vip!
        </AlreadyVipContainer>
        <AlreadyVipContainer>
          Vuoi annullare l'abbonamento?
        </AlreadyVipContainer>
        <StyledButton onClick={() => setDelete(true)}>Annulla abbonamento</StyledButton>
        </AlreadyVip>}

        <Transition appear show={isOpenAdd} as={Fragment}>
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
                    <p className="text-sm text-gray-500">
                      Sei sicuro di voler diventare VIP? 5€ verranno addebitati sulla carta salvata.
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => updateVip()}
                    >
                      Si
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => closeAdd()}
                    >
                      No
                    </button>
                  </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <Transition appear show={isOpenDelete} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeDelete}>
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
                    Annulla abbonamento
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-500">
                      Sei sicuro di voler annullare il tuo abbonamento VIP? Perderai tutti i privilegi annessi.
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={() => downgradeUser()}
                    >
                      Si
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => closeDelete()}
                    >
                      No
                    </button>
                  </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </VipPageContainer>
      <ResponsiveDisappearDiv>
        <Trending unregisteredUser={state.unregisteredUser}/>
      </ResponsiveDisappearDiv>

      {vipCorrect && <CorrectPopUp text="Congratulazioni! Sei diventato un VIP." />}
      {vipError && <ErrorPopUp text="Errore nell'acquisto dell'abbonamento." />}
      {downgradeCorrect && <CorrectPopUp text="Abbonamento VIP annullato." />}
      {downgradeError && <ErrorPopUp text="Errore nell'annullamento dell'abbonamento." />}
    </PageContainer>
    </div>
  )
}