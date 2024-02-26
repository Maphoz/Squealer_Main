import React from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import SquealFeed from "../components/SquealFeed";
import { gql, useMutation, useQuery } from "@apollo/client";
import user_icon from "../images/user.png"
import channel_icon from "../images/channel.jpeg"
import MainButton from "../components/MainButton";
import CorrectPopUp from "../components/CorrectMessage";
import ErrorPopUp from "../components/ErrorMessage";
import { Tab } from "@headlessui/react"
import './NotificationsPage.css'
import { formatTimeDifference, greyColor, mainColor } from "../const";
import tw from "twin.macro";
import Trending from "./Trending";
import Header from "../components/Header";
import { ResponsiveDisappearDiv } from "./HomePage";
import { actionTypes, useGlobalState } from "../GlobalStateContext";
import { DotLoader } from "react-spinners";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const GET_NOTIFICATIONS = gql`
  query getNotifications{
    getNotifications{
      relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`

const ACCEPT_FRIEND = gql`
  mutation acceptFriendRequest($notificationId: String!){
    acceptFriendRequest(notificationId: $notificationId){
     relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`

const REFUSE_FRIEND = gql`
  mutation refuseFriendRequest($notificationId: String!){
    refuseFriendRequest(notificationId: $notificationId){
      relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`

const ACCEPT_CHANNEL = gql`
  mutation acceptChannelRequest($notificationId: String!){
    acceptChannelRequest(notificationId: $notificationId){
      relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`

const REFUSE_CHANNEL = gql`
  mutation refuseChannelRequest($notificationId: String!){
    refuseChannelRequest(notificationId: $notificationId){
      relationalNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
      interactiveNotifications{
        _id
        notificationText
        active
        createdAt
        senderType
        notificationType
      }
    }
  }
`

const NotificationsContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  width: 50%;
  padding-left: 40px;
  padding-right: 40px;

  @media(max-width: 576px){
    width: 100%;
    padding-inline: 10px;
    margin-top: 10px;
  }
`

const Title = styled.div`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 40px;
  text-align: center;

  @media(max-width: 576px){
    margin-bottom: 20px;
  }
`

const SingleNotification= styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0px 15px 40px;
  align-items: start;

  img{
    width: 25px;
    height: 25px;
    margin-right: 20px;
  }

  @media(max-width:576px){
    margin: 5px 0px 10px 10px;
  }
`

const NotificationTextContainer = styled.div`
  ${tw`
      flex
      flex-col
      justify-start
  `}
  line-height: 1.1;

  .dateText{
    color: ${greyColor};
    font-size: 0.9em;
  }
`


const FriendReqContainer = styled.div`
  padding: 0px 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-left: 10px;

`


export default function NotificationsPage(){
  const [relationNotifications, setRelational] = React.useState(false);
  const [interactionNotifications, setInteraction] = React.useState(false);
  const {loading: loadingNotifications, error, data} = useQuery(GET_NOTIFICATIONS);
  const [acceptChannel, {loading: loadingAccC, data: dataAccC, error: errorAccC}] = useMutation(ACCEPT_CHANNEL, {
    onCompleted: () => {
      setAccChannelCorrect(true);
      setTimeout( ( ) => {
        setAccChannelCorrect(false);
      }, 1500)
    },
    onError: () => {
      setAccChannelError(true);
      toggleNotification();
      setTimeout( ( ) => {
        setAccChannelError(false);
      }, 1500)
    }
  });
  const [refuseChannel, {loading: loadingRefC, data: dataRefC, error: errorRefC}] = useMutation(REFUSE_CHANNEL, {
    onCompleted: () => {
      setRefChannelCorrect(true);
      setTimeout( ( ) => {
        setRefChannelCorrect(false);
      }, 1500)
    },
    onError: () => {
      setRefChannelError(true);
      setTimeout( ( ) => {
        setRefChannelError(false);
      }, 1500)
    }
  });
  const [acceptFriend, {loading: loadingAccF, data: dataAccF, error: errorAccF}] = useMutation(ACCEPT_FRIEND, {
    onCompleted: () => {
      setAccFriendCorrect(true);
      toggleNotification();
      setTimeout( ( ) => {
        setAccFriendCorrect(false);
      }, 1500)
    },
    onError: () => {
      setAccFriendError(true);
      setTimeout( ( ) => {
        setAccFriendError(false);
      }, 1500)
    }
  });
  const [refuseFriend, {loading: loadingRefF, data: dataRefF, error: errorRefF}] = useMutation(REFUSE_FRIEND, {
    onCompleted: () => {
      setRefFriendCorrect(true);
      setTimeout( ( ) => {
        setRefFriendCorrect(false);
      }, 1500)
    },
    onError: () => {
      setRefFriendError(true);
      setTimeout( ( ) => {
        setRefFriendError(false);
      }, 1500)
    }
  });
  const [accFriendCorrect, setAccFriendCorrect] = React.useState(false);
  const [refFriendCorrect, setRefFriendCorrect] = React.useState(false);
  const [accFriendError, setAccFriendError] = React.useState(false);
  const [refFriendError, setRefFriendError] = React.useState(false);

  const [accChannelCorrect, setAccChannelCorrect] = React.useState(false);
  const [refChannelCorrect, setRefChannelCorrect] = React.useState(false);
  const [accChannelError, setAccChannelError] = React.useState(false);
  const [refChannelError, setRefChannelError] = React.useState(false);

  React.useEffect( () => {
    if(data){
      setRelational([...data.getNotifications.relationalNotifications])
      setInteraction([...data.getNotifications.interactiveNotifications])
    }
  }, [data])

  function acceptFriendRequest(id){
    acceptFriend({
      variables:{
        notificationId: id
      }
    })
  }

  function refuseFriendRequest(id){
    refuseFriend({
      variables:{
        notificationId: id
      }
    })
  }

  function acceptChannelRequest(id){
    acceptChannel({
      variables:{
        notificationId: id
      }
    })
  }

  function refuseChannelRequest(id){
    refuseChannel({
      variables:{
        notificationId: id
      }
    })
  }

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the threshold as needed
    };

    // Initial check on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const {state, dispatch} = useGlobalState();


  const toggleNotification = () => {
    dispatch({
      type: actionTypes.SET_SELECTED_TRUE,
      payload: ['profileData', 'homeData', 'feedData']
    })
  }
  

  return(
    <div>
      <Header />
    <PageContainer>
      <Navbar currentPage={"notifications"}/>
      <NotificationsContainer>
      <Title>Notifiche</Title>
      <Tab.Group>
        <Tab.List className=" customList flex rounded-xl p-1 mb-3">
          <Tab className={({ selected }) =>
                classNames(
                  'w-full tabCustomWare brWare navigationWare',
                  'focus:outline-none',
                  selected
                    ? 'warehouseTab font-medium'
                    : 'notwarehouseTab hover:text-green font-normal'
                )
              }><span className="spanContainer"><span>Relazioni <span className="disappearing">(Gruppi e amici)</span></span></span></Tab>
          <Tab className={({ selected }) =>
                classNames(
                  'w-full tabCustomWare blWare navigationWare',
                  'focus:outline-none',
                  selected
                  ? 'warehouseTab font-medium'
                  : 'notwarehouseTab hover:text-green font-normal'
                )
              }><span className="spanContainer"><span>Interazioni <span className="disappearing">personali</span></span></span></Tab>
        </Tab.List>
        <Tab.Panels className="tabPanel">
          <Tab.Panel className="individualPanel">
            {loadingNotifications && 
              <div className="flex w-full justify-center">
              <DotLoader size={80} color={mainColor} loading={loadingNotifications}/>
            </div>
            }
            {!loadingNotifications && relationNotifications && relationNotifications.map( (obj, index) => (
              <SingleNotification key={index}>
                {obj.senderType == "user" ?
                  <img src={user_icon} /> :
                  <img src={channel_icon} />
                }
                <NotificationTextContainer>
                  <span>{obj.notificationText}</span>
                  <span className="dateText">{formatTimeDifference(new Date(obj.createdAt))}</span>
                </NotificationTextContainer>
                {obj.notificationType == 'FRIEND_REQUEST' &&  obj.active && 
                  <FriendReqContainer>
                    <MainButton fs={isMobile && '12px;'} mr={'10px;'} height={"30px;"} text="Accetta" mb={'0px;'} active={true} fullButton={true} onClickFunction={() => acceptFriendRequest(obj._id)}/>
                    <MainButton fs={isMobile && '12px;'} mr={'10px;'} height={"30px;"} text="Rifiuta" mb={'0px;'} active={true} fullButton={false} onClickFunction={() => refuseFriendRequest(obj._id)}/>
                  </FriendReqContainer>
                }
                {obj.notificationType == 'CHANNEL_ADDUSER_REQUEST' &&  obj.active && 
                  <FriendReqContainer>
                    <MainButton fs={isMobile && '12px;'} mr={'10px;'} height={"30px;"} text="Ammetti" mb={'0px;'} active={true} fullButton={true} onClickFunction={() => acceptChannelRequest(obj._id)}/>
                    <MainButton fs={isMobile && '12px;'} mr={'10px;'} height={"30px;"} text="Rifiuta" mb={'0px;'} active={true} fullButton={false} onClickFunction={() => refuseChannelRequest(obj._id)}/>
                  </FriendReqContainer>
                }
              </SingleNotification>
            ))}
            {!loadingNotifications && !relationNotifications && <div>
              Non hai notifiche</div>}
          </Tab.Panel>
          <Tab.Panel className="individualPanel">
          {loadingNotifications && 
              <div className="flex w-full justify-center">
                <DotLoader size={80} color={mainColor} loading={loadingNotifications}/>
              </div>
            }
          {!loadingNotifications && interactionNotifications && interactionNotifications.map( (obj, index) => (
              <SingleNotification key={index}>
                {obj.senderType == "user" ?
                  <img src={user_icon} /> :
                  <img src={channel_icon} />
                }
                <NotificationTextContainer>
                  <span>{obj.notificationText}</span>
                  <span className="dateText">{formatTimeDifference(new Date(obj.createdAt))}</span>
                </NotificationTextContainer>
                {obj.notificationType == 'FRIEND_REQUEST' &&  obj.active && 
                  <FriendReqContainer>
                    <MainButton mr={'10px;'} height={"30px;"} text="Accetta" mb={'0px;'} active={true} fullButton={true} onClickFunction={() => acceptFriendRequest(obj._id)}/>
                    <MainButton mr={'10px;'} height={"30px;"} text="Rifiuta" mb={'0px;'} active={true} fullButton={false} onClickFunction={() => refuseFriendRequest(obj._id)}/>
                  </FriendReqContainer>
                }
                {obj.notificationType == 'CHANNEL_ADDUSER_REQUEST' &&  obj.active && 
                  <FriendReqContainer>
                    <MainButton mr={'10px;'} height={"30px;"} text="Ammetti" mb={'0px;'} active={true} fullButton={true} onClickFunction={() => acceptChannelRequest(obj._id)}/>
                    <MainButton mr={'10px;'} height={"30px;"} text="Rifiuta" mb={'0px;'} active={true} fullButton={false} onClickFunction={() => refuseChannelRequest(obj._id)}/>
                  </FriendReqContainer>
                }
              </SingleNotification>
            ))}
            {!loadingNotifications && !interactionNotifications && <div>
              Non hai notifiche</div>}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      </NotificationsContainer>
      {accFriendCorrect && <CorrectPopUp text="Amicizia accettata!"/>}
      {refFriendCorrect && <CorrectPopUp text="Amicizia rifiutata."/>}
      {accFriendError && <ErrorPopUp text="Errore: amicizia non accettata."/>}
      {refFriendError && <ErrorPopUp text="Errore: amicizia non rifiutata."/>}
      {accChannelCorrect && <CorrectPopUp text="Utente aggiunto al canale!"/>}
      {refChannelCorrect && <CorrectPopUp text="Utente non aggiunto al canale."/>}
      {accChannelError && <ErrorPopUp text="Errore: utente non aggiunto."/>}
      {refFriendError && <ErrorPopUp text="Errore: utente non rifiutato."/>}
      <ResponsiveDisappearDiv>
        <Trending />
      </ResponsiveDisappearDiv>
    </PageContainer>
    </div>
  )
}