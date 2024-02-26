import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Navbar from "../components/Navbar";
import SquealFeed from "../components/SquealFeed";
import Trending from "./Trending";
import BuyCharsComponent from "../components/BuyCharsComponent";
import Header from "../components/Header";
import { ResponsiveDisappearDiv } from "./HomePage";
import { useGlobalState } from "../GlobalStateContext";
export const PageContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`


export default function BuyCharsPage(){
  const {state} = useGlobalState();
  return(
    <div>
      <Header menuPage={"buyChars"}/>
      <PageContainer>
        <Navbar currentPage={"buyChars"}/>
        <BuyCharsComponent />
        <ResponsiveDisappearDiv>
          <Trending unregisteredUser={state.unregisteredUser}/>
        </ResponsiveDisappearDiv>
      </PageContainer>
    </div>
  )
}