import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";

//Screens
import Dashboard from "../../screens/drawer/dashboard";
import Gadgets from "../../screens/drawer/stackCateg/gadgets";
import Books from "../../screens/drawer/stackCateg/books";
import Furniture from "../../screens/drawer/stackCateg/furniture";
import Clothing from "../../screens/drawer/stackCateg/clothing";
import Ads from "../../screens/drawer/dashboard/ads";
import Site from "../../screens/drawer/dashboard/ads/webView";
import Details from "../../screens/drawer/stackCateg/detailsScreen";

// Search
import Search from "../../screens/drawer/dashboard/search";

const StackDash = createStackNavigator(
  {
    Dashboard: {
      screen: Dashboard
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
    Site: {
      screen: Site
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
      header: null
    },
    mode: "screen"
  }
);

export default StackDash;
