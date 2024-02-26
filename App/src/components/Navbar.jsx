import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import message_icon from "../images/message_icon_outlined.png"
import search_icon from "../images/search.png"
import home_icon from "../images/home_outlined.png"
import user_icon from "../images/user_outlined.png"
import notification_icon from "../images/bell_outlined.png"
import message from "../images/message_icon.png"
import home from "../images/home.png"
import user from "../images/user.png"
import notification from "../images/bell.png"
import squealer_icon from "../images/squealer_logo.png"
import { useNavigate } from "react-router-dom";
import channel from "../images/channel_outlined.png"
import addIcon from "../images/addIcon.png"
import { greyColor, mainColor } from "../const";
import vip from "../images/vipIcon.png"
import { useGlobalState } from "../GlobalStateContext";
import { ResponsiveDisappearDiv } from "../main_pages/HomePage";
import MainButton from "./MainButton";
import manager from "../images/manager.png"
import trends from "../images/trending.png"
import channels from "../images/canali_navbar.png"

const StyledNavbar = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  background: white;

  @media (max-width: 768px) {
    margin-left: 5%;
  }

  @media (max-width: 576px) {
    box-shadow: 1px  0px 1px 1px #dddddd;
    width: 100%;
    position: fixed; /* Make the navbar fixed */
    bottom: 0px; /* Stick it to the bottom */
    z-index: 1000;
    margin: 0;
    padding: 0; /* Remove padding to let it adapt to content */
    height: auto; /* Set height to auto to accommodate content */
  }
`;

const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;

  @media (max-width: 576px) {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto; /* Set height to auto to accommodate content */
    justify-content: space-around;
    
    .noMobile{
      display: none;
    }
  }
`;

const StyledLink = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  margin-bottom: 5px;

  img {
    height: 30px;
    width: 30px;
    margin-right: 15px;
  }

  .text{
    font-size: 20px;
    ${props => props.selected && 'font-weight: 600;'}
  }

  @media (max-width: 768px) {
    .text{
      display: none;
    }
  };

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    padding: 12px 10px 8px 10px;
    margin: 0;
    ${props => props.selected && `background: white;`}
    
    img{
      width: 28px;
      height: 28px;
      margin-bottom: 0px;
      margin-right: 0px;
    }

    .text{
      display: none;
  
    };
  }

  border-radius: 30px;
  &:hover{
    background: ${mainColor}66;
  }

  ${props => props.selected && `background: ${mainColor}66;`}
`

const SquealerIcon = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;

  &:hover{
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    margin-bottom: 10px;
  };
  
  @media (max-width: 576px) {
    display: none;
    width: 0;
    height: 0;
    margin: 0;
  };
`

const AddCharacters = styled.div`
  background: ${mainColor};
  border-radius: 25px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  font-size: 18px;
  transition: all 0.5s ease;
  margin-top: 20px;

  img{
    width: 30px;
    height: 30px;
  }

  span{
    margin-right: 5px;
    font-weight: 600;
  }

  &:hover{
    cursor: pointer;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    
    span{
      display: none;
    }

    img{
      width: 25px;
      height: 25px;
    }
  }
  
  @media (max-width: 576px) {
    display: none;
  }
`


const ButtonContainer = styled.div`
  ${tw`
      flex
      w-full
      justify-center
  `}
  margin-top: 100px;
`

export default function Navbar({currentPage}){
  const navigate = useNavigate();
  const { state } = useGlobalState();

  return(
    <StyledNavbar>
      <SquealerIcon className="squealerLogo" onClick={() => navigate('/home')}>
        <img src={squealer_icon} />
      </SquealerIcon>
      {!state.unregisteredUser && <NavContainer>
        <StyledLink className="link" selected={currentPage == "home"} onClick={() => navigate('/home')}>
          <img src={currentPage == "home" ? home : home_icon} />
          <span className="text">Home</span>
        </StyledLink>
        <StyledLink className="link" selected={currentPage == "notifications"} onClick={() => navigate('/notifications')}>
          <img src={currentPage == "notifications" ? notification : notification_icon} />
          <span className="text">Notifiche</span>
        </StyledLink>
        <StyledLink className="link" selected={currentPage == "search"} onClick={() => navigate('/search')}>
          <img src={search_icon} />
          <span className="text">Cerca</span>
        </StyledLink>
        <StyledLink className="link noMobile" selected={currentPage == "trends"} onClick={() => navigate('/trends')}>
          <img src={trends} />
          <span className="text">Trends</span>
        </StyledLink>
        <StyledLink className="link noMobile" selected={currentPage == "canali"} onClick={() => navigate('/channels')}>
          <img src={channels} />
          <span className="text">Canali</span>
        </StyledLink>
        <StyledLink className="link" selected={currentPage == "messages"} onClick={() => navigate('/messages')}>
          <img src={currentPage == "messages" ? message : message_icon} />
          <span className="text">Messaggi</span>
        </StyledLink>
        <StyledLink className="link" onClick={() => {navigate('/profile')}} selected={currentPage == "profile"}>
          <img src={currentPage == "profile" ? user : user_icon} />
          <span className="text">Profilo</span>
        </StyledLink>
        <StyledLink className="link noMobile" onClick={() => {navigate('/createChannel')}} selected={currentPage == "createChannel"}>
          <img src={channel} />
          <span className="text">Crea Canale</span>
        </StyledLink>
        <StyledLink className="link noMobile" onClick={() => {navigate('/vipSubscription')}} selected={currentPage == "vipCreation"}>
          <img src={vip} />
          <span className="text">Diventa VIP</span>
        </StyledLink>
        <StyledLink className="link noMobile" onClick={() => {navigate('/smmPick')}} selected={currentPage == "smm"}>
          <img src={manager} />
          <span className="text">Gestione SMM</span>
        </StyledLink>
      </NavContainer>}
      {!state.unregisteredUser && <AddCharacters onClick={() => {navigate('/buyChars')}}>
        <span>Acquista caratteri</span>
        <img src={addIcon} alt="Icona aggiungi caratteri"/>
      </AddCharacters>}
      {state.unregisteredUser && 
      <ResponsiveDisappearDiv>
      <ButtonContainer>
          <MainButton fs="22px;" text="Registrati!" active={true} fullButton={true} onClickFunction={() => {navigate('/registration')}}/>

        </ButtonContainer>
        </ResponsiveDisappearDiv>
        }
    
    </StyledNavbar>
  )
}