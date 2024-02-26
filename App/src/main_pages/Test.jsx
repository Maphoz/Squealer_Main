import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Navbar from "../components/Navbar";
import SquealFeed from "../components/SquealFeed";
import Trending from "./Trending";
import { useGlobalState } from "../GlobalStateContext";

const BlackContainer = styled.div`
  ${tw`
      flex
      w-full
      bg-black
  `}
  height: 100vh;
`


export default function TestPage(){
  const {state, dispatch} = useGlobalState();

  return(
    <BlackContainer>
      <Navbar currentPage={"home"} unregisteredUser={state.unregisteredUser}/>
    </BlackContainer>
  )
}