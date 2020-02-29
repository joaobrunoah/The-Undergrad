import React, {Component} from "react";
import {ActivityIndicator, View, Text, TouchableOpacity, Alert, FlatList} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {SwipeListView} from "react-native-swipe-list-view";

// Icon
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

//API
import System from "../../../../services/api";

import Message from "../messagesItem";

// Styles
import {globalStyles} from "../../../globalStyles";

// Textos
import {textBr, textUsa} from "../../../../assets/content/mainRoute/messages";

export default function MessagesList(props) {

  this.lastMsg = (item) => {
    let obj = item.messages;
    if (obj != "undefined") {
      let last = Object.keys(obj)[Object.keys(obj).length - 1];

      return obj[last].text;
    }
  };

  this.delete = async (item) => {
    try {
      let other_user_name = await System.getUserInfo(item.key).then((user) => {
        return user.data().name
      }).catch((e) => {
        return 'unknown User'
      });
      Alert.alert(
        props.language === 'br' ? 'Você tem certeza de que deseja apagar?'
          : props.language === 'usa' ? 'Are you sure that you want to delete?'
          : 'Você tem certeza de que deseja apagar?',
        props.language === 'br' ? `Apagar as mensagens de ${other_user_name}?`
          : props.language === 'usa' ? `Delete the messages of ${other_user_name}?`
          : `Apagar as mensagens de ${other_user_name}?`,
        [
          {
            text: props.language === 'br' ? 'Cancelar' : props.language === 'usa' ? 'Cancel' : 'Cancelar',
            onPress: () => {
            },
            style: 'cancel',
          },
          {text: 'OK', onPress: async () => await System.deleteMessages(props.uid, item.key)},
        ],
        {cancelable: false},
      );
    } catch (e) {
      console.warn(e)
    }
  };

  return (
    <View style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}}>
      {props.loading
        ? <View
          style={{
            flex: 1,
            marginTop: 60,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator size="large" color="#0008"/>
        </View>
        : <SwipeListView
          style={{flex: 1}}
          // Order by last message sent
          data={props.conversas.sort((a, b) => {
            const lastTalkTime = (obj) => {
              let keys = [];
              for (let prop in obj.messages) {
                if (obj.messages.hasOwnProperty(prop)) {
                  keys.push(prop);
                }
              }
              return keys.sort().pop();
            };
            return lastTalkTime(b).localeCompare(lastTalkTime(a));
          })}
          rightOpenValue={-75}
          disableRightSwipe
          renderItem={({item}) => {
            return (<Message
              data={item}
              msg={this.lastMsg(item)}
              uid={props.uid}
            />)
          }}
          renderHiddenItem={({item}) => (
            <View style={{
              alignItems: 'center',
              backgroundColor: '#DF2020',
              flex: 1,
              flexDirection: 'row-reverse',
              paddingLeft: 15,
            }}>
              <TouchableOpacity onPress={() => {
                this.delete(item)
              }}>
                <FontAwesomeIcon name={'trash-o'} style={{color: 'white', fontWeight: 'bold', paddingRight: 7}}
                                 size={35}/>
              </TouchableOpacity>
            </View>
          )}
        />}
    </View>
  );
}
