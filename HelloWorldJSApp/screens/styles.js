// styles.js
import { StyleSheet } from "react-native";
import {Dimensions,} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  divider: {
  height: 1,
  backgroundColor: '#2A2A2A',
  marginVertical: 24,
  },
  sectionHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},

sectionTitle: {
  color: '#aaa',
  fontSize: 13,
  marginLeft: 6,
  letterSpacing: 0.5,
},
descriptionContainer: {
  paddingHorizontal: 12, // 👈 plus étroit que le reste de l’écran
},

  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 24,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  titleContainer: {
    marginLeft: -8, 
    marginBottom: 8,
    },
  infoBlock: {
    marginBottom: 20, 
    },

  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconButton: {
    marginHorizontal: 15,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    marginBottom: 15,
    },
  linkText: {
  color: '#4EA8FF', // couleur lien
},

infoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
  paddingVertical: 6, // zone cliquable plus large
},

addressRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  paddingVertical: 6,
},


  addressText: {
    color: '#fff',
    marginLeft: 8,
    flex: 1,
    lineHeight: 22,
  },

  ///////////////////////////////////////////
  ///////////// RANKING SCREEN /////////////
  ///////////////////////////////////////////
  ranking_container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  ranking_title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 12,
  },

  // PODIUM
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  podiumLeft: { flex: 1, alignItems: 'center' },
  podiumCenter: { flex: 1.2, alignItems: 'center' },
  podiumRight: { flex: 1, alignItems: 'center' },

  podiumCol: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  first: {
    backgroundColor: '#ffd700', // gold
  },
  second: {
    backgroundColor: '#c0c0c0', // silver
  },
  third: {
    backgroundColor: '#cd7f32', // bronze
  },
  // LIST

  ranking_list: {
    paddingBottom: 40,
  },
  ranking_row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomColor: '#202020',
    borderBottomWidth: 1,
  },
  ranking_rowRank: {
    color: '#fff',
    width: 36,
    textAlign: 'center',
    fontWeight: '700',
  },
  ranking_rowInfo: {
    flex: 1,
    paddingLeft: 8,
  },
  ranking_rowName: {
    color: '#fff',
    fontSize: 16,
  },
  ranking_rowPoints: {
    color: '#ccc',
    fontSize: 14,
    width: 80,
    textAlign: 'right',
  },
  ranking_loadingText: {
    color: '#fff',
    marginTop: 12,
  },
  ranking_podiumStep: {
    width: SCREEN_WIDTH * 0.28,
    borderRadius: 8,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  ranking_userCard: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 6,
    minWidth: SCREEN_WIDTH * 0.28,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  
  ranking_userName: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  
  ranking_userPoints: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },



  ///////////////////////////////////////////
  ///////////// GRADES & BOULDERS /////////////
  ///////////////////////////////////////////
  map: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 16,
  },
  image: {
    width: 170,
    height: 250,
    borderRadius: 5,
    borderColor: '#808080',
    borderWidth: 5,
    marginHorizontal: 8,
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  grade: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
    width: 55,
    height: 30,
    borderRadius:6,
    marginHorizontal: 8,
  },
  header_grade : {
    backgroundColor : 'grey',
    color : 'white',
    width : "5%",
    textAlign: 'center',
    borderRadius: 5,
    fontSize: 18,
  },
  header : {
    backgroundColor : 'white',
    height: "5%",
    alignItems: "center",
  },
  image_zoomed: {
    width: "100%",
    height: "85%",
  },
  validationButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  
  validationIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    height: "10%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  footerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "white",
    backgroundColor: 'transparent',
    color: "white",
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color : "white",
  },

  ///////////////////////////////////////////
  ///////////// COMMENTS /////////////
  ///////////////////////////////////////////

  commentButton: {
    position: 'absolute',
    left: 16,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  commentBubble: {
    fontSize: 20,
    marginRight: 6,
  },
  commentCountBox: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  commentCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  commentRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
});

export default styles;