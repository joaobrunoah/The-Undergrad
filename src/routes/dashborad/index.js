import React, { Component } from "react";
import {
  createStackNavigator,
} from "react-navigation-stack";

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
import Messages from "../../screens/drawer/messages";

const StackDash = createStackNavigator(
  {
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        header: false
      }
    },
    Gadgets: {
      screen: Gadgets
    },
    Books: {
      screen: Books
    },
    Furniture: {
      screen: Furniture
    },
    Clothing: {
      screen: Clothing
    },
    Ads: {
      screen: Ads
    },
    Details: {
      screen: Details
    },
    Search: {
      screen: Search
    }
  },
  {
    defaultNavigationOptions: {
      header: false
    },
    mode: "screen"
  }
);

export default StackDash;
