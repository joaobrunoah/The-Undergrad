import {Dimensions, StyleSheet} from 'react-native';
const {width} = Dimensions.get('window');
const vw = width/100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stats: {
    flex: 2,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsItems: {
    alignItems: 'center',
  },
  giantCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50*vw,
    height: 50*vw,
    borderColor: '#b3b3b3',
    borderRadius: 50*vw,
    borderWidth: 2,
    margin: 10,
  },
  mediumCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 45*vw,
    height: 45*vw,
    borderColor: '#b3b3b3',
    borderRadius: 45*vw,
    borderWidth: 1.5,
  },
  userCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40*vw,
    height: 40*vw,
    borderColor: '#CCC',
    borderRadius: 40*vw,
    backgroundColor: '#CCC',
  },
  itemsForSale: {
    marginTop: 40,
    height: 30,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#737373',
    borderRadius: 15,
  },
  lookingFor: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  lookingForButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '85%',
    height: 60,
    backgroundColor: '#737373',
    borderRadius: 10,
  },

  // Modal Styles
  modal: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    width: '80%',
    height: 250,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtons: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    minWidth: 150,
    backgroundColor: '#737373',
    borderRadius: 10,
  },
  ImgOptionsModalButtons:{
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 250,
    backgroundColor: '#737373',
    borderRadius: 10,
  },
  modalText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default styles;
