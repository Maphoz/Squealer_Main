import styled from "styled-components"
import tw from "twin.macro";
import { mainColor } from "../const.js";
import { useNavigate } from "react-router-dom";
import React from "react"
import {slide as Menu} from 'react-burger-menu'
import './Header.css'
import hamburger_icon from "../images/hamburgerIcon.png"
import logo from "../images/squealer_logo.png"
import cross_icon from "../images/cancel.png"
import channel from "../images/channel_outlined.png"
import vip from "../images/vipIcon.png"
import add from "../images/addIcon.png"
import trends from "../images/trending.png"
import star from "../images/manager.png"
import { useGlobalState } from "../GlobalStateContext.jsx";
import MainButton from "./MainButton.jsx";
import channels from "../images/canali_navbar.png"

const HeaderContainer = styled.div`
  display: none;
  width: 100%;
  height: 45px;
  color: black;
  align-items: center;
  justify-content: center;
  background: white;
  margin-bottom: 5px;
  z-index: 50;

  .customMenu{
    background: white;
    color: black;
    top: 0;
    left: 0;
    overflow-y: hidden;
  }

  @media (max-width: 576px){
    display: flex;
  }

  box-shadow: -1px 0px 1px 1px #dddddd;
`

const HeaderOption = styled.div`
  ${tw`
      px-6
  `}
  color: black;
  font-size: 20px;
  font-weight: 600;
  position: absolute;
  top: 15px;
  left: 35px;
`

const Options = styled.div`
  ${tw`
      flex
      flex-col
      py-8
  `}

  margin-top: 80px;
`

const OptionContainer = styled.div`
  padding: 10px 0px;
  ${props => props.active ? `border-bottom: 2px solid ${mainColor};` : 'border-bottom: 2px solid black;'}
  display: flex;
  align-items: center;
  justify-content: start;
  ${props => props.active ? `color: ${mainColor};` : 'color: black;'}
  font-size: 18px;
  margin-bottom: 20px;

  img{
    width: 22px;
    height: 22px;
    margin-right: 20px;
    margin-left: 25px
  }

  span{
    margin-left: 10px;
  }

  .color{
    color: ${mainColor};
  }

  .addIcon{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 17px;
  }
`

const IconContainer = styled.div`
  width: 45px;
  height: 45px;
  position: absolute;
  right: 10px;
`

const ButtonContainer = styled.div`
  ${tw`
      w-full
      h-full
      justify-center
      items-center
  `}
`
const ResponsiveAppearDiv = styled.div`
  ${tw`
      w-full
      h-full
  `}
  display: none;
  @media(max-width:576px){
    display: block;

  }
`

export default function Header(props){
  const navigate = useNavigate();
  const {menuPage} = props;

  const {state} = useGlobalState();
  function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = React.useState(null);
  
    React.useEffect(() => {
      let lastScrollY = window.pageYOffset;
  
      const updateScrollDirection = () => {
        const scrollY = window.pageYOffset;
        const direction = scrollY > lastScrollY ? "down" : "up";
        if (direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)) {
          setScrollDirection(direction);
        }
        lastScrollY = scrollY > 0 ? scrollY : 0;
      };
      window.addEventListener("scroll", updateScrollDirection); // add event listener
      return () => {
        window.removeEventListener("scroll", updateScrollDirection); // clean up
      }
    }, [scrollDirection]);
  
    return scrollDirection;
  };
  
  const scrollDirection = useScrollDirection();
    
  return (
    <HeaderContainer className={`sticky ${ scrollDirection === "down" ? "-top-24" : "top-0"} transition-all duration-500`}>
      <Menu width={"75%"}customCrossIcon={ <img id="cross" src={cross_icon} /> } customBurgerIcon={ <img src={hamburger_icon} />} className="customMenu">
        <HeaderOption id="headerMenu">
          MENU
        </HeaderOption>
        {!state.unregisteredUser && <Options>
          <OptionContainer active={menuPage == "trends" ? "true" : ''} onClick={ () => navigate('/trends')}>
            <img src={trends} />
            <span>Trends</span>
          </OptionContainer>
          <OptionContainer active={menuPage == "canali" ? "true" : ''} onClick={ () => navigate('/channels')}>
            <img src={channels} />
            <span >Canali</span>
          </OptionContainer>
          <OptionContainer active={menuPage == "createChannel" ? "true" : ''} onClick={ () => navigate('/createChannel')}>
            <img src={channel} />
            <span >Crea canale</span>
          </OptionContainer>
          <OptionContainer active={menuPage == "buyChars" ? "true" : ''} onClick={ () => navigate('/buyChars')}>
            <img className="addIcon" src={add} />
            <span>Acquista caratteri</span>
          </OptionContainer>
          <OptionContainer active={menuPage == "vip" ? "true" : ''} onClick={ () => navigate('/vipSubscription')}>
            <img src={vip} />
            <span>Diventa VIP</span>
          </OptionContainer>
          <OptionContainer active={menuPage == "smm" ? "true" : ''} onClick={ () => navigate('/smmPick')}>
            <img src={star} />
            <span>Gestione SMM</span>
          </OptionContainer>
        </Options>}
        {state.unregisteredUser && 
        <ResponsiveAppearDiv>
        <ButtonContainer style={{display: 'flex'}}>
          <MainButton fs={"20px;"} text="Registrati" fullButton={true} active={"true"} onClickFunction={ () => navigate('/registration')} />
          </ButtonContainer>
          </ResponsiveAppearDiv>
        }
      </Menu>
      <IconContainer onClick={() => navigate('/home')}>
        <img src={logo} />
      </IconContainer>
    </HeaderContainer>
  );
}