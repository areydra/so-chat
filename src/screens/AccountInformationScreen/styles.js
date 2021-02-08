import {StyleSheet} from 'react-native';
import Color from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  imageProfile: {
    height: 140,
    width: 140,
    borderRadius: 70,
    alignSelf: 'center',
    marginTop: 40,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Color.grey,
  },
  containerNameStatus: {},
  name: {
    marginTop: 10,
    paddingVertical: 5,
    fontSize: 25,
    textAlign: 'center',
    marginHorizontal: 28,
  },
  status: {
    paddingVertical: 1,
    marginTop: -10,
    textAlign: 'center',
    marginHorizontal: 28,
  },
  containerContent: {
    marginTop: 28,
    marginHorizontal: 40,
  },
  textInput: {
    marginTop: 10,
    fontSize: 18,
    color: Color.black,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Color.main,
  },
  button: {
    width: 120,
    backgroundColor: Color.main,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 40,
    paddingVertical: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: Color.white,
    fontSize: 18,
  },
  textError: {
    marginTop: 24,
    fontSize: 16,
    textAlign: 'center',
    color: Color.red,
  },
  iconAvatar: {
    width: '100%', 
    height: '100%', 
  },
  iconCamera: {
      height: 20,
      width: 20,
      bottom: 0,
      alignSelf: 'center',
      position: 'absolute',
  }
});

export default styles;
