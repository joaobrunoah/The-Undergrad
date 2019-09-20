import React, { Component } from "react";
import { HeaderBackButton , createStackNavigator } from "react-navigation";

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
    Site: {
      screen: Site,
      navigationOptions: ({ navigation}) => ({
        headerLeft:(<HeaderBackButton tintColor="#737373" onPress={() => navigation.goBack()}/>),
        title: "The Undergrad",
        headerTitleStyle: {
          color: "#737373"
        },
        headerTintColor: "#737373",
        headerStyle: {
          color: "#000",
          backgroundColor: "#DDD",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
  
          elevation: 4
        }
      }),
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
