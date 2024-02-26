import React from "react";
import {Routes, Route} from "react-router-dom"
import LoginPage from "./main_pages/LoginPage";
import ProfilePage from "./main_pages/Profile";
import RegistrationPage from "./main_pages/RegistrationPage";
import HomePage from "./main_pages/HomePage";
import Search from "./main_pages/Search";
import CreateChannel from "./main_pages/CreateChannel";
import NotificationsPage from "./main_pages/NotificationsPage";
import ChannelShower from "./main_pages/ChannelShower";
import ProfileShower from "./main_pages/ProfileShower";
import VipPage from "./main_pages/VipPage";
import BuyCharsPage from "./main_pages/BuyCharsPage";
import NewSquealPage from "./main_pages/NewSquealPage";
import TrendsPage from "./main_pages/TrendsPage";
import MessagesPage from "./main_pages/Messages";
import cookies from "./utlis/cookie"
import SmmPage from "./main_pages/SmmPage";
import RecoveryPassword from "./main_pages/RecoveryPassword";
import ChannelPage from "./main_pages/ChannelPage";

export default function App(){
  const [unregisteredUser, setUnregistered] = React.useState(cookies.get('accessToken') == null);

  return(
    <Routes>
      <Route
        path="/"
        element={
          <LoginPage/>
        }
      />
      <Route
        path="/recoverPassword"
        element={
          <RecoveryPassword/>
        }
      />
      <Route
        path="/newSqueal"
        element={
          <NewSquealPage unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/smmPick"
        element={
          <SmmPage unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/trends"
        element={
          <TrendsPage unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/messages"
        element={
          <MessagesPage unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/vipSubscription"
        element={
          <VipPage unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/buyChars"
        element={
          <BuyCharsPage unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/profile"
        element={
          <ProfilePage unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/registration"
        element={
          <RegistrationPage />
        }
      />
      <Route
        path="/home"
        element={
          <HomePage unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/notifications"
        element={
          <NotificationsPage unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/search"
        element={
          <Search unregisteredUser={unregisteredUser}/>
        }
       />
       <Route
        path="/createChannel"
        element={
          <CreateChannel unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/profileShower/:username"
        element={
          <ProfileShower unregisteredUser={unregisteredUser}/>
        }
      />
      <Route
        path="/channelShower/:channelName"
        element={
          <ChannelShower unregisteredUser={unregisteredUser}/>
        } 
      />

      <Route  
        path="/channels"
        element={
          <ChannelPage unregisteredUser={unregisteredUser}/>
        }
      />
    </Routes>
  )
}