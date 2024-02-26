import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { mainColor } from "../const";

const ButtonStyled = styled.div`
  ${props => props.active ? `color: ${mainColor};` : 'color: grey;'}
  ${props => props.active ? `border: 1px solid ${mainColor};` : 'border: 1px solid grey;'}
  ${tw`
    px-2
  `}
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
  ${props => props.active && 'cursor: pointer;'}
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.fs ? `font-size: ${props.fs}` : 'font-size: 18px;'}
  ${props => props.height && `height: ${props.height};`}
  ${props => props.mb ? `margin-bottom: ${props.mb}` : 'margin-bottom: 15px;'}
  ${props => props.mr ? `margin-right: ${props.mr}` : 'margin-right: 0px;'}

  ${props => props.width && `width: ${props.width};`}

  ${props => props.active && `
    &:hover{
      background: ${mainColor};
      color: white;
      transition: 0.3s ease-in-out;
    }
  `}
`;

const FullButton = styled.div`
  color: white;

  ${tw`
    px-2
  `}
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
  ${props => props.active && 'cursor: pointer;'}
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.fs ? `font-size: ${props.fs}` : 'font-size: 18px;'}
  ${props => props.active ? `background-color: ${mainColor};` : `background-color: grey;`}
  ${props => props.mb ? `margin-bottom: ${props.mb}` : 'margin-bottom: 15px;'}
  ${props => props.mr ? `margin-right: ${props.mr}` : 'margin-right: 0px;'}

  ${props => props.active && `
    &:hover {
      color: ${mainColor};
      background-color: white;
      transition: 0.3s ease-in-out;
    }
  `}
  border: 1px solid ${mainColor};

  ${props => props.width && `width: ${props.width};`}
  ${props => props.height && `height: ${props.height};`}

`


export default function MainButton(props){
  const {onClickFunction, text, width, fullButton, height, active, mb, mr, type, fs} = props;

  return(
    fullButton ? 
      (<FullButton fs={fs} type={type || null} onClick={onClickFunction} width={width} height={height} active={active} mb={mb} mr={mr}>
      {active ? 
      <button>{text}</button> : 
      <button disabled>{text}</button>}
    </FullButton>) :
      (<ButtonStyled fs={fs} type={type || null} onClick={onClickFunction} width={width} height={height} active={active} mb={mb} mr={mr}>
      {active ? 
      <button>{text}</button> : 
      <button disabled>{text}</button>}
    </ButtonStyled>)
  )
}