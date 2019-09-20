import React, { Component } from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { FluidNavigator, Transition } from "react-navigation-fluid-transitions";

//Screens
import Home from "../drawer";
import Language from "../../screens/switch/language";
import Preload from "../../screens/switch/preload";
import Login from "../../screens/switch/login";
import Cadastro from "../../screens/switch/cadastro";
import ForgotPass from "../../screens/switch/forgotpass";

const SwitchMenu = FluidNavigator(
  {
    Preload: {
      screen: Preload
    },
    Language: {
      screen: Language
    },
    Login: {
      screen: Login
    },
    Cadastro: {
      screen: Cadastro
    },
    ForgotPass: {
      screen: ForgotPass
    },
    Home: {
      screen: Home
    }
  },
  {
    mode: "screen",
    initialRouteName: "Home",
    defaultNavigationOptions: {
      header: null
    }
  }
);

export default createAppContainer(SwitchMenu);
