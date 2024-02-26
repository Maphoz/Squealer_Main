import React, { Fragment } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Navbar from "../components/Navbar";
import SquealFeed from "../components/SquealFeed";
import Trending from "./Trending";
import BuyCharsComponent from "../components/BuyCharsComponent";
import Header from "../components/Header";
import { ResponsiveDisappearDiv } from "./HomePage";
import { useGlobalState } from "../GlobalStateContext";
import { CenterPageContainer, CenterTitle, MessageContainer, NoItems, SectionDescription } from "../constStyles";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { greyColor, mainColor } from "../const";
import { DotLoader } from "react-spinners";
import star from "../images/rating.png"
import { Dialog, Transition } from "@headlessui/react";
import CorrectPopUp from "../components/CorrectMessage";
import ErrorPopUp from "../components/ErrorMessage";
import MainButton from "../components/MainButton";
import star_outlined from "../images/rating_outlined.png"
import roundAlert from "../images/alertIcon.png"
import { useNavigate } from "react-router-dom";
import manager from "../images/manager.png"


export const PageContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

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
    social_media_manager_id
  }
  }
}
`;

export const GET_SMMS = gql`
query getSmms{
  getSmms{
    _id
    nome
    cognome
    username
    email
    rating
    price
    profileImage
    assistedList
    bio
    reviews{
      rating
    }
  }
}
`

const SEND_REQUEST = gql`
  mutation sendSmmRequest($smmId: String!){
    sendSmmRequest(smmId: $smmId)
  }
`

const GET_SMM = gql`
  query getSmmFromClient($smmId: String!){
    getSmmFromClient(smmId: $smmId){
      _id
      nome
      cognome
      username
      email
      rating
      price
      profileImage
      assistedList
      bio
      reviews{
        rating
        senderId
        text
      }
    }
  }
`

const ADD_REVIEW = gql`
  mutation addReview($smmId: String!, $review: NewReview!){
    addReview(smmId: $smmId, review: $review){
      rating
      senderId
      text
    }
  }
`

const FIRE_SMM = gql`
  mutation removeSmmWithId($smmId: String!){
    removeSmmWithId(smmId: $smmId){
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
      social_media_manager_id
    }
  }
`

const DELETE_REQUEST = gql`
  mutation deleteSmmRequest{
    deleteSmmRequest
  }
`

const CHECK_REQUEST = gql`
  query{
    checkSmmRequest
  }
`

const SmmContainer = styled.div`
  ${tw`
    w-full
    flex
    flex-col
    items-center
    pb-12
  `}

`
const SingleSmm = styled.div`
  ${tw`
    flex
    items-center
    pl-4
    pr-6
    py-4
    mb-4
    justify-between
  `}
  width: 60%;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 2px #00000044;

  @media(max-width: 576px){
    width: 95%;
    padding-right: 10px;
  }

  &:hover{
    box-shadow: 0px 0px 5px 2px ${mainColor}88;
    cursor: pointer;
  }
`

const SmmInfo = styled.div`
  ${tw`
      flex
      items-start
  `}
`

const SmmImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;

  @media(max-width: 576px){
    width: 45px;
    height: 45px;
  }
`
const SmmText = styled.div`
  ${tw`
      flex
      flex-col
      items-start
  `}
`

const SmmNameRating = styled.div`
  ${tw`
      flex
      items-center
  `}

  @media(max-width:576px){
    max-width: 160px;
  }
`
const SmmBio = styled.div`
  width: 230px;
  font-size: 16px;
  @media(max-width:576px){
    width: 160px;
    font-size: 14px;
  }

`

const SmmName = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;

  max-width: 250px;
  @media(max-width:576px){
    max-width: 100px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 14px;
  }
`
const SmmRating = styled.div`
  display: flex;
  align-items: center;
  color: ${mainColor};
  font-size: 16px;
  margin-left: 5px;
`

const DotContainer = styled.div`
  ${tw`
      flex
      justify-center
      mt-10
      p-8
      w-full
  `}
`

const SmmIcon = styled.img`
  width: 15px;
  height: 15px;

`

const SmmPrice = styled.div`
  font-size: 16px;
  font-weight: bold;

  @media(max-width: 576px){
    .willDisappear{
      display: none
    }
  }
`

const MySmmContainer = styled.div`
  padding-left: 20%;
  width: 80%;

  @media(max-width: 576px){
    padding-left: 5%;
    width: 95%;
  }
`
const ProfileContainer = styled.div`
  ${tw`
      flex
      items-start
      mb-8
  `}
`
const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;

  @media(max-width: 576px){
    width: 70px;
    height: 70px;
  }
  margin-right: 20px;
`
const SmmDesc = styled.div`
  ${tw`
      flex
      flex-col
      items-start
  `}
`

const NewReviewContainer = styled.div`
  ${tw`
      w-full
      my-3
  `}

`
const ReviewTitle = styled.div`
  color: ${mainColor};
  font-weight: 600;
  font-size: 20px;
`

const RatingContainer = styled.div`
  ${tw`
      flex
      my-2
      items-center
  `}

  img{
    width: 20px;
    height: 20px;
    margin-inline: 5px;
  }

  img:hover{
    cursor: pointer;
  }

`

const RatingValue = styled.div`
  font-size: 18px;
`

const ReviewText = styled.textarea`
  ${tw`
      mb-3
  `}
  height: 200px;
  width: 95%;
  border: 2px solid ${greyColor};
  border-radius: 10px;
  padding: 5px 10px;
  &:focus{
    outline: none;
    border: 2px solid ${mainColor};
    box-shadow: 0px 0px 5px 1px ${mainColor}44;
  }
`


export default function SmmPage(){
  const {state} = useGlobalState();
  const {loading: loadingUser, error: errorUser, data : dataUser, refetch: refetchUser} = useQuery(GET_MY_ACCOUNT);
  const {loading: loadingSmm, error: errorSmm, data : dataSmm, refetch: refetchSmms} = useQuery(GET_SMMS);
  const {loading: loadingCheck, error: errorCheck, data : dataCheck, refetch: refetchCheck} = useQuery(CHECK_REQUEST);
  const [sendRequest, {loading: loadingRequest, error: errorRequest, data : dataRequest}] = useMutation(SEND_REQUEST, {
    onError: () => {
      setErrorHire(true);
      setTimeout(() => {
        setErrorHire(false)
      }, 1500)
    },
    onCompleted: () => {
      setCorrectHire(true);
      refetchCheck();
      setTimeout(() => {
        setCorrectHire(false)
      }, 1500)
    }
  });
  const [fetchSmm, {loading: loadingMySmm, error: errorMySmm, data : dataMySmm}] = useLazyQuery(GET_SMM, {
    onError: (error) => {
      console.log(error)
    }
  });
  const [deleteRequest, {loading: loadingDelete, error: errorDeletion, data : dataDelete}] = useMutation(DELETE_REQUEST, {
    onError: () => {
      setErrorDelete(true);
      setTimeout(() => {
        setErrorDelete(false)
      }, 1500)
    },
    onCompleted: () => {
      setCorrectDelete(true);
      setPending(false);
      setTimeout(() => {
        setCorrectDelete(false)
      }, 1500)
    }
  });
  const [addReview, {loading: loadingReview, error: errorReviews, data : dataReview}] = useMutation(ADD_REVIEW, {
    onError: () => {
      setErrorReview(true);
      setTimeout(() => {
        setErrorReview(false)
      }, 1500)
    },
    onCompleted: () => {
      setCorrectReview(true);
      setMyReview({
        rating: rating,
        text: reviewText
      });
      setAlreadyReview(true);
      setTimeout(() => {
        setCorrectReview(false)
      }, 1500)
    }
  });
  const [fireSmm, {loading: loadingFire, error: errorFiring, data : dataFire}] = useMutation(FIRE_SMM, {
    onError: () => {
      setErrorFire(true);
      setTimeout(() => {
        setErrorFire(false)
      }, 1500)
    },
    onCompleted: () => {
      setCorrectFire(true);
      setTimeout(() => {
        setCorrectFire(false)
        window.location.reload();
      }, 1500)
    }
  });

  const [correctHire, setCorrectHire] = React.useState(false);
  const [errorHire, setErrorHire] = React.useState(false);
  const [correctDelete, setCorrectDelete] = React.useState(false);
  const [errorDelete, setErrorDelete] = React.useState(false);
  const [correctFire, setCorrectFire] = React.useState(false);
  const [errorFire, setErrorFire] = React.useState(false);
  const [correctReview, setCorrectReview] = React.useState(false);
  const [errorReview, setErrorReview] = React.useState(false);
  const [user, setUser] = React.useState();
  const [smms, setSmms] = React.useState([]);
  const [pending, setPending] = React.useState(false);
  const [mySmm, setMySmm] = React.useState();
  const [myReview, setMyReview] = React.useState();
  React.useEffect( () => {
    if(dataUser){
      setUser({...dataUser.getMyAccount})
      if(dataUser.getMyAccount.social_media_manager_id) 
        fetchSmm({
          variables: {
            smmId: dataUser.getMyAccount.social_media_manager_id
          }
        })
    }
  }, [dataUser])
  React.useEffect( () => {
    if(dataSmm){
      setSmms(dataSmm.getSmms)
    }
  }, [dataSmm])
  React.useEffect( () => {
    if(dataCheck){
      setPending(dataCheck.checkSmmRequest);
    }
  }, [dataCheck]);
  React.useEffect( () => {
    if(dataMySmm && dataMySmm.getSmmFromClient && user){
      setMySmm(dataMySmm.getSmmFromClient);
      const reviewersId = dataMySmm.getSmmFromClient.reviews.map(obj => obj.senderId);
      const index = reviewersId.indexOf(user._id)
      if(index >= 0){
        setMyReview(dataMySmm.getSmmFromClient.reviews[index]);
      }
      setAlreadyReview(index >= 0);
    }
  }, [dataMySmm, user]);

  const [alreadyReview, setAlreadyReview] = React.useState(false);

  const [isOpenHire, setOpenHire] = React.useState(false);

  const openHire  = () =>{
    setOpenHire(true);
  }

  const closeHire  = () =>{
    setOpenHire(false);
  }

  const [isOpenFire, setOpenFire] = React.useState(false);

  const openFire  = () =>{
    setOpenFire(true);
  }

  const closeFire  = () =>{
    setOpenFire(false);
  }

  const [selectedSmm, setSelectedSmm] = React.useState();

  const chooseSmm = (smm) => {
    setSelectedSmm(smm);
    openHire();
  }

  const hireSmm = () => {
    closeHire();
    sendRequest({
      variables: {
        smmId: selectedSmm._id
      }
    })
  }

  const sendDelete = () => {
    deleteRequest();
  }

  const deleteSmm = () => {
    fireSmm({
      variables: {
        smmId: mySmm._id
      }
    })
  }

  const [reviewText, setReviewText] = React.useState('');
  const [rating, setRating] = React.useState(0);

  const submitReview = () => {
    addReview({
      variables: {
        smmId: mySmm._id,
        review: {
          text: reviewText,
          rating: rating
        }
      }
    })
  }
  const navigate = useNavigate();
  return(
    <div>
      <Header menuPage={"smm"}/>
      <PageContainer>
        <Navbar currentPage={"smm"}/>
        {loadingUser && <DotContainer>
            <DotLoader loading={loadingUser} size={80} color={mainColor}/>
          </DotContainer>}
        {!loadingUser && user && user.social_media_manager_id && user.userType == 'VIP' && <CenterPageContainer>
          <CenterTitle>Gestisci SMM</CenterTitle>
          {loadingMySmm && <DotContainer>
            <DotLoader loading={loadingMySmm} size={80} color={mainColor}/>
          </DotContainer>}
          {!loadingMySmm && mySmm &&
            <MySmmContainer>
              <ProfileContainer>
                <ProfileImage src={mySmm.profileImage || manager} alt="immagine SMM"/>
                <SmmDesc>
                    <SmmNameRating>
                      <SmmName>{mySmm.nome} {mySmm.cognome}</SmmName>
                      <SmmRating><SmmIcon src={star} /><b>{mySmm.rating.toFixed(1)}</b>({mySmm.reviews.length})</SmmRating>
                    </SmmNameRating>
                    <SmmBio>{mySmm.bio}</SmmBio>
                </SmmDesc>
              </ProfileContainer>
              {!alreadyReview && <NewReviewContainer>
                  <ReviewTitle>Lascia una recensione</ReviewTitle>
                  <RatingContainer>
                    <RatingValue>Valutazione: </RatingValue>
                    <img src={rating > 0 ? star : star_outlined} onClick={() => {setRating(rating == 1 ? 0 : 1)}}/>
                    <img src={rating > 1 ? star : star_outlined} onClick={() => {setRating(2)}}/>
                    <img src={rating > 2 ? star : star_outlined} onClick={() => {setRating(3)}}/>
                    <img src={rating > 3 ? star : star_outlined} onClick={() => {setRating(4)}}/>
                    <img src={rating > 4 ? star : star_outlined} onClick={() => {setRating(5)}}/>
                  </RatingContainer>
                  <ReviewText value={reviewText} placeholder="Cosa ne pensi del tuo SMM..." onChange={(e) => setReviewText(e.target.value)}/>
                  <div className="flex justify-center w-full">
                  <MainButton text="Manda recensione" fullButton={true} active={reviewText.length > 0} onClickFunction={submitReview}/>
                  </div>
                </NewReviewContainer>}
                {alreadyReview && <NewReviewContainer>
                  <ReviewTitle>La tua recensione</ReviewTitle>
                  <RatingContainer>
                    <RatingValue>Valutazione: </RatingValue>
                    {myReview.rating > 0 && <img src={star} />}
                    {myReview.rating > 1 && <img src={star} />}
                    {myReview.rating > 2 && <img src={star} />}
                    {myReview.rating > 3 && <img src={star} />}
                    {myReview.rating > 4 && <img src={star} />}
                  </RatingContainer>
                  <ReviewText value={myReview.text} placeholder="Cosa ne pensi del tuo SMM..." disabled/>
                </NewReviewContainer>}
              <div className="flex justify-center w-full">
                <MainButton text="Annulla contratto" fullButton={false} active={"true"} onClickFunction={() => openFire()} />
              </div>
            </MySmmContainer>
          }
        </CenterPageContainer>}
        {!loadingUser && user && !user.social_media_manager_id && !pending &&  user.userType == 'VIP' && <CenterPageContainer>
          <CenterTitle>Assumi un SMM</CenterTitle>
          <SectionDescription>Assumi un SMM per accrescere il profilo.</SectionDescription>
          {smms.length > 0 && <SmmContainer>
            {smms.map( (smm, index) => (
              <SingleSmm key={index} onClick={() => chooseSmm(smm)}>
                <SmmInfo>
                  <SmmImage src={smm.profileImage || manager} alt="immagine profilo smm"/>
                  <SmmText>
                    <SmmNameRating>
                      <SmmName>{smm.nome} {smm.cognome}</SmmName>
                      <SmmRating><SmmIcon src={star} /><b>{smm.rating.toFixed(1)}</b>({smm.reviews.length})</SmmRating>
                    </SmmNameRating>
                    <SmmBio>{smm.bio}</SmmBio>
                  </SmmText>
                </SmmInfo>
                <SmmPrice>
                  €{smm.price.toFixed(2)}<span className="willDisappear">/mese</span>
                </SmmPrice>
              </SingleSmm>
            ))}
          </SmmContainer>}
        </CenterPageContainer>}
        {!loadingUser && user && !user.social_media_manager_id && pending && user.userType == 'VIP' && <CenterPageContainer>
          <CenterTitle>Richiesta in sospeso</CenterTitle>
          <SectionDescription>Attendi che l'SMM accetti la tua richiesta.</SectionDescription>
          <DotContainer>
            <DotLoader loading={pending} size={80} color={mainColor}/>
          </DotContainer>
          <div className="flex justify-center">
            <MainButton text="Annulla richiesta" fullButton={true} active={"true"} onClickFunction={sendDelete} />
          </div>
        </CenterPageContainer>}
        {!loadingUser && user && user.userType !== 'VIP' && 
          <CenterPageContainer>
            <CenterTitle> Diventa VIP!</CenterTitle>
            <div className="flex w-full justify-center">
              <NoItems>
                <img src={roundAlert} />
                <MessageContainer>
                  <span>Non puoi assumere un manager senza essere VIP. Scopri l'abbonamento.</span>
                </MessageContainer>
              </NoItems>
            </div>
            <div className="flex w-full justify-center">
              <MainButton text="Diventa VIP" fullButton={true} active={"true"} onClickFunction={() => {navigate('/vipSubscription')}}/>
            </div>
          </CenterPageContainer>}
        <ResponsiveDisappearDiv>
          <Trending unregisteredUser={state.unregisteredUser}/>
        </ResponsiveDisappearDiv>
        {isOpenHire && <Transition appear show={isOpenHire} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeHire}>
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
                    Assumi SMM
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-md text-gray-500">
                      Sei sicuro di voler assumere <b>{selectedSmm.nome} {selectedSmm.cognome}</b> a <b>€{selectedSmm.price} al mese</b>? Il social media manager può rifiutare la tua richiesta
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={hireSmm}
                    >
                      Ingaggia
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeHire}
                    >
                      Chiudi
                    </button>
                  </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>}
        {isOpenFire && <Transition appear show={isOpenFire} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeFire}>
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
                    Licenzia SMM
                  </Dialog.Title>
                  <div className="mt-2 text-center">
                    <p className="text-md text-gray-500">
                      Sei sicuro di voler rescindere il contratto con <b>{mySmm.nome} {mySmm.cognome}</b>?
                    </p>
                  </div>
                    <div className="mt-4 flex justify-center space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={deleteSmm}
                    >
                      Conferma
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeFire}
                    >
                      Chiudi
                    </button>
                  </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>}
        {correctHire && <CorrectPopUp text="Richiesta inviata!"/>}
        {errorHire && <ErrorPopUp text="Richiesta non inviata."/>}
        {correctDelete && <CorrectPopUp text="Richiesta annullata!"/>}
        {errorDelete && <ErrorPopUp text="Richiesta non annullata."/>}
        {correctFire && <CorrectPopUp text="Smm licenziato!"/>}
        {errorFire && <ErrorPopUp text="Smm non licenziato."/>}
        {correctReview && <CorrectPopUp text="Review inviata!"/>}
        {errorReview && <ErrorPopUp text="Review non inviata."/>}
      </PageContainer>
    </div>
  )
}