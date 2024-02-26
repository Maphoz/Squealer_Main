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
import TrendsFeed from "../components/TrendsFeed";

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

export default function TrendsPage(){
  const {state, dispatch} = useGlobalState();

  return(
    <div>
      <Header menuPage={"trends"}/>
      <PageContainer>
        <Navbar currentPage={"trends"} unregisteredUser={state.unregisteredUser}/>
        <TrendsFeed unregisteredUser={state.unregisteredUser}/>
        <ResponsiveDisappearDiv>
          <Trending unregisteredUser={state.unregisteredUser}/>
        </ResponsiveDisappearDiv>
      </PageContainer>
    </div>
  )
}