import {StyleSheet} from 'react-native';

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
    width: 150,
    height: 150,
    borderColor: '#b3b3b3',
    borderRadius: 75,
    borderWidth: 2,
    margin: 10,
  },
  mediumCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 130,
    borderColor: '#b3b3b3',
    borderRadius: 65,
    borderWidth: 1.5,
  },
  userCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderColor: '#CCC',
    borderRadius: 50,
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
    maxWidth: 150,
    width: 150,
    backgroundColor: '#737373',
    borderRadius: 10,
  },
  modalText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default styles;
