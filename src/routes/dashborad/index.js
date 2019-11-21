import React, { Component } from "react";
import {
  createStackNavigator,
} from "react-navigation";

//Screens
import Dashboard from "../../screens/drawer/dashboard";
import Gadgets from "../../screens/drawer/stackCateg/gadgets";
import Books from "../../screens/drawer/stackCateg/books";
import Furniture from "../../screens/drawer/stackCateg/furniture";
import Clothing from "../../screens/drawer/stackCateg/clothing";
import Ads from "../../screens/drawer/dashboard/ads";
import Details from "../../screens/drawer/stackCateg/detailsScreen";
import Preview from "../../screens/drawer/stackCateg/detailsScreen/Preview";

//Transitions
import {
  fadeIn,
  fadeOut
} from "react-navigation-transitions";

// Search
import Search from "../../screens/drawer/dashboard/search";

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  // Custom transitions go there
  if (
    prevScene &&
    prevScene.route.routeName === "Details" &&
    nextScene.route.routeName === "Preview"
  ) {
    return fadeIn(750);
  } else if (
    prevScene &&
    prevScene.route.routeName === "Preview" &&
    nextScene.route.routeName === "Details"
  ) {
    return fadeOut(500);
  } else {
    return null;
  }
};

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
    Details: {
      screen: Details
    },
    Search: {
      screen: Search
    },
    Preview: {
      screen: Preview,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    },
    mode: "screen",
    transitionConfig: nav => handleCustomTransition(nav)
  }
);

export default StackDash;
