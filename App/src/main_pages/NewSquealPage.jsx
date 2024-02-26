import styled from "styled-components";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import NewSquealComponent from "../components/NewSqueal";

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`

const NewSquealContainer = styled.div`
  margin-top: 40px;
  width: 50%;
  padding-left: 40px;
  padding-right: 40px;
  margin-left: 10px;

  @media (max-width: 576px) {
    width: 100%;
    padding-inline: 15px;
    margin-top: 10px;
    margin-left: 0;
  }
`
export default function NewSquealPage(){
  return(
    <div>
      <Header />
      <PageContainer>
        <Navbar />
        <NewSquealContainer>
          <NewSquealComponent mapLoaded={false}/>
        </NewSquealContainer>
      </PageContainer>
    </div>
  )
}