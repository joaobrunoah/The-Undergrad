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
      screen: StackDash,
      navigationOptions: {
        header: false
      }
    },
    Perfil: {
      screen: Perfil,
      navigationOptions: {
        header: false
      }
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        header: false
      }
    },
    ItemsForSale: {
      screen: ItemsForSale,
      navigationOptions: {
        header: false
      }
    },
    SellScreen: {
      screen: SellScreen,
      navigationOptions: {
        header: false
      }
    },
    BuyScreen: {
      screen: BuyScreen,
      navigationOptions: {
        header: false
      }
    },
    Messages: {
      screen: Messages,
      navigationOptions: {
        header: false
      }
    },
    MessageDetail: {
      screen: MessageDetail,
      navigationOptions: {
        header: false
      }
      // navigationOptions: ({ navigation}) => ({
      //   headerLeft: () => <HeaderBackButton tintColor="#737373" onPress={() => navigation.goBack()}/>,
      //   title: "The Undergrad",
      //   headerTitleStyle: {
      //     fontSize: 26,
      //     fontFamily: "Montserrat-SemiBold",
      //     textAlign: "center",
      //     marginBottom: 10
      //   },
      //   headerStyle: {
      //     backgroundColor: "#ebebeb"
      //   }
      // })
    },
    MessageItem: {
      screen: MessageItem,
      navigationOptions: {
        header: false
      }
    }
  },
  {
    //initialRouteName: "StackDash",
  }
);

export default DrawerMenu;
