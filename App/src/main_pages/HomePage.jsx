import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Navbar from "../components/Navbar";
import SquealFeed from "../components/SquealFeed";
import Trending from "./Trending";
import { useGlobalState } from "../GlobalStateContext";
import Header from "../components/Header";
import newPost from "../images/newPost.png"
import { mainColor } from "../const";
import { useNavigate } from "react-router-dom";

export const PageContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  overflow: hidden;
`

export const ResponsiveDisappearDiv = styled.div`
  @media (max-width: 576px) {
    display: none;
  }
`
const NewSquealContainer = styled.div`
  display: none;
  position: fixed;
  bottom: 80px;
  right: 20px;
  border-radius: 50%;
  padding: 12px;
  background: ${mainColor};
  img{
    width: 30px;
    height: 30px;
  }

  @media (max-width: 576px) {
    display: flex;
  }
`

export default function HomePage(){
  const {state, dispatch} = useGlobalState();
  const navigate = useNavigate();

  return(
    <div>
      <Header />
      <PageContainer>
        <Navbar currentPage={"home"} unregisteredUser={state.unregisteredUser}/>
        <SquealFeed unregisteredUser={state.unregisteredUser}/>
        <ResponsiveDisappearDiv>
          <Trending unregisteredUser={state.unregisteredUser}/>
        </ResponsiveDisappearDiv>
        {!state.unregisteredUser && <NewSquealContainer onClick={() => navigate('/newSqueal')}>
          <img src={newPost} alt="Crea squeal"/>
        </NewSquealContainer> }
      </PageContainer>
    </div>
  )
}