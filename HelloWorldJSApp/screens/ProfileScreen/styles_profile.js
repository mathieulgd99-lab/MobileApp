// styles.js
import { StyleSheet } from "react-native";
import {Dimensions} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const styles_profile = StyleSheet.create({container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },

  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 16,
  },

  text: {
    color: 'white',
  },

  filters: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    marginRight: 8,
  },

  active: {
    backgroundColor: '#ff9800',
  },

  filterText: {
    color: 'white',
    fontSize: 13,
  },

  list: {
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  dayText: {
    color: 'white',
    fontSize: 12,
  },

  activeDay: {
    borderWidth: 2,
    borderColor: '#ff9800',
    borderRadius: 20,
  },
});

  
  export default styles_profile;