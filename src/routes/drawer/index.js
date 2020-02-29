import React, { Component } from "react";
import { HeaderBackButton } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';

//Screens
import Perfil from "../../screens/drawer/perfil";
import StackDash from "../../routes/dashborad";
import Settings from "../../screens/drawer/settings";
import ItemsForSale from "../../screens/drawer/itemsForSale";
import SellScreen from "../../screens/drawer/sellScreen";
import BuyScreen from "../../screens/drawer/buyScreen";

//Messages
import Messages from "../../screens/drawer/messages";
import MessageDetail from "../../screens/drawer/messages/messageScreen";
import MessageItem from "../../screens/drawer/messages/messagesItem";

const DrawerMenu = createStackNavigator(
  {
    StackDash: {
      screen: StackDash
    },
    Perfil: {
      screen: Perfil
    },
    Settings: {
      screen: Settings
    },
    ItemsForSale: {
      screen: ItemsForSale
    },
    SellScreen: {
      screen: SellScreen
    },
    BuyScreen: {
      screen: BuyScreen
    },
    Messages: {
      screen: Messages
    },
    MessageDetail: {
      screen: MessageDetail
    },
    MessageItem: {
      screen: MessageItem
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    },
    mode: "screen"
  }
);

export default DrawerMenu;
