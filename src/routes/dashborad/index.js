import React, { Component } from "react";
import { HeaderBackButton , createStackNavigator } from "react-navigation";

//Screens
import Dashboard from "../../screens/drawer/dashboard";
import Gadgets from "../../screens/drawer/stackCateg/gadgets";
import Books from "../../screens/drawer/stackCateg/books";
import Furniture from "../../screens/drawer/stackCateg/furniture";
import Clothing from "../../screens/drawer/stackCateg/clothing";
import Ads from "../../screens/drawer/dashboard/ads";
import Details from "../../screens/drawer/stackCateg/detailsScreen";

// Search
import Search from "../../screens/drawer/dashboard/search";

const StackDash = createStackNavigator(
  {
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        header: null
      },
    },
    Gadgets: {
      screen: Gadgets,
      navigationOptions: {
        header: null
      },
    },
    Books: {
      screen: Books,
      navigationOptions: {
        header: null
      },
    },
    Furniture: {
      screen: Furniture,
      navigationOptions: {
        header: null
      },
    },
    Clothing: {
      screen: Clothing,
      navigationOptions: {
        header: null
      },
    },
    Ads: {
      screen: Ads,
      navigationOptions: {
        header: null
      }
    },
    Details: {
      screen: Details,
      navigationOptions: {
        header: null
      },
    },
    Search: {
      screen: Search,
      navigationOptions: {
        header: null
      },
    }
  },
  {
    // defaultNavigationOptions: {
    //   header: null
    // },
    mode: "screen"
  }
);

export default StackDash;
