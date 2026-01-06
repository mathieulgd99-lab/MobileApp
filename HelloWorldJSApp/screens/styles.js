// styles.js
import { StyleSheet } from "react-native";
import {Dimensions,} from 'react-native';
import { COLORS } from './colors';

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
  color: COLORS.grey,
  fontSize: 13,
  marginLeft: 6,
  letterSpacing: 0.5,
},
descriptionContainer: {
  paddingHorizontal: 12, // 👈 plus étroit que le reste de l’écran
},
descriptionText: {
  color: COLORS.white,
    fontSize: 14,
    lineHeight: 24,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  text: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 24,
  },
  
  title: {
    color: COLORS.white,
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
  color: "#4EA8FF", // couleur lien
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
    color: COLORS.white,
    marginLeft: 8,
    flex: 1,
    lineHeight: 22,
  },

 ///////////////////////////////////////////
///////////// CONNEXION SCREEN /////////////
///////////////////////////////////////////

connexion_container: {
  flex: 1,
  backgroundColor: COLORS.primaryLight,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 24,
},

// formulaire au milieu de l’écran
connexion_form: {
  width: '90%',
  backgroundColor: COLORS.background,
  borderRadius: 16,
  paddingVertical: 30,
  paddingHorizontal: 20,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 6,
},

connexion_title: {
  fontSize: 26,
  color: '#fff',
  fontWeight: '700',
  marginBottom: 20,
  textAlign: 'center',
},

// input moderne
connexion_inputText: {
  width: '100%',
  backgroundColor: '#2a2a2a',
  color: '#fff',
  paddingVertical: 12,
  paddingHorizontal: 14,
  borderRadius: 10,
  marginVertical: 8,
  borderWidth: 1,
  borderColor: '#3a3a3a',
  fontSize: 16,
},

// bouton principal
connexion_button: {
  backgroundColor: COLORS.primaryDark,
  width: '100%',
  paddingVertical: 14,
  borderRadius: 10,
  marginTop: 16,
  alignItems: 'center',
},

connexion_buttonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '600',
},

// questions en bas du formulaire
connexion_switchContainer: {
  marginTop: 18,
  alignItems: 'center',
},

connexion_switchText: {
  color: COLORS.grey,
  fontSize: 14,
},

connexion_switchButton: {
  color: COLORS.primary,
  fontSize: 16,
  marginTop: 6,
  fontWeight: '600',
},

// écran connecté
connexion_text: {
  color: COLORS.primary,
  fontSize: 20,
  fontWeight: '600',
  textAlign: 'center',
  marginBottom: 20,
},

connexion_logoutButton: {
  backgroundColor: '#e74c3c',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
},
connexion_logoutText: {
  color: COLORS.white,
  fontSize: 16,
  fontWeight: '700',
},
connexion_welcome: {
  fontSize: 28,
  color: COLORS.black,
  fontWeight: '800',
  marginBottom: 4,
  textAlign: 'center',
  letterSpacing: 0.5,
},

connexion_welcomeSub: {
  fontSize: 18,
  color: COLORS.grey,
  marginBottom: 20,
  textAlign: 'center',
  fontStyle: 'italic',
},
logo: {
  width: 140,
  height: 140,
  resizeMode: "contain",
  position: "absolute",
  top: 20,
  left: 20,
  marginBottom: 20,
},




  ///////////////////////////////////////////
  ///////////// RANKING SCREEN /////////////
  ///////////////////////////////////////////
  ranking_container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  ranking_title: {
    color: COLORS.white,
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
    backgroundColor: COLORS.background,
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
    color: COLORS.white,
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
    color: COLORS.white,
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
    color: COLORS.white,
  },
  footerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: COLORS.white,
    backgroundColor: 'transparent',
    color: COLORS.white,
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color : COLORS.white,
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
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  commentCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.black,
  },
  commentRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    alignItems: 'center',
  },

  ///////////////////////////////////////////
  ///////////// ADMIN SCREEN /////////////
  ///////////////////////////////////////////
  admin_container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  admin_title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 12,
    textAlign: 'center',
  },
  admin_form: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 12,
  },
  admin_preview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginVertical: 10,
  },
  admin_picker: {
    color: '#fff',
    backgroundColor: '#2a2a2a',
    marginVertical: 8,
  },
  admin_smallText: {
    color: '#aaa',
    marginBottom: 8,
  },


  chipContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginVertical: 10,
},

chip: {
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#ccc',
  margin: 5,
  backgroundColor: '#f6f6f6',
},

chipSelected: {
  backgroundColor: '#FF7A00', // Orange VietClimb
  borderColor: '#FF7A00',
},

chipText: {
  color: '#333',
  fontWeight: '600',
},
dropdownHeader: {
  padding: 12,
  backgroundColor: "#eee",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#ccc",
},

dropdownHeaderText: {
  fontSize: 16,
  color: "#333",
  fontWeight: "600",
},

dropdownPanel: {
  marginTop: 6,
  backgroundColor: "white",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#ccc",
  overflow: "hidden",
},

dropdownItem: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},

dropdownItemText: {
  fontSize: 16,
  color: "#444",
},

  creator_container: {
    flex: 1,
    padding: 20,
     backgroundColor: COLORS.background,
  },

  creator_title: {
    alignItems: 'center',
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.text,
    textAlign: "center",
  },

  creator_optionButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    marginVertical: 5,
  },

  creator_optionSelected: {
     backgroundColor: COLORS.primaryLight,
     borderColor: COLORS.primary,
  },

  creator_optionText: {
    fontSize: 18,
    textAlign: "center",
    color: COLORS.text,
  },

  creator_mainButton: {
     backgroundColor: COLORS.primary,
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },

  creator_mainButtonText: {
  color: COLORS.background,
    textAlign: "center",
    fontSize: 18,
  },

  creator_secondaryButton: {
     borderColor: COLORS.secondary,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },

  creator_secondaryButtonText: {
    textAlign: "center",
  color: COLORS.secondary,
  },

  creator_previewCard: {
    marginVertical: 10,
    borderWidth: 1,
  borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 5,
  },

  creator_previewTouchable: {
    position: 'relative',
    overflow: 'visible',
  },

  creator_previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },

  creator_previewTitle: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 5,
  color: COLORS.text,
  },

  creator_bigImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },

  creator_row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },

  creator_colorCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  borderColor: COLORS.primary,
  },

  creator_subtitle: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.text,
  },

  creator_dropdown: {
    marginTop: 10,
  },

  creator_dropdownLabel: {
    padding: 10,
    borderWidth: 1,
  borderColor: COLORS.primary,
    borderRadius: 10,
  color: COLORS.text,
  },

  creator_dropdownList: {
    borderWidth: 1,
  borderColor: COLORS.primary,
    borderRadius: 10,
    marginTop: 5,
  },

  creator_dropdownItem: {
    padding: 10,
  },

  creator_dropdownText: {
    fontSize: 16,
  color: COLORS.text,
  },

  creator_validateButton: {
     backgroundColor: COLORS.secondary,
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
  },

  creator_validateText: {
     color: COLORS.background,
    fontSize: 18,
    textAlign: "center",
  },
  creator_editIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
    zIndex: 9999,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  creator_tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#aaa',
    margin: 4,
  },
  
  creator_tagSelected: {
    backgroundColor: '#61dafb',
    borderColor: '#61dafb',
  },
  
  creator_tagText: {
    color: 'white',
    fontSize: 12,
  }


});

export default styles;