// styles.js
import { StyleSheet } from "react-native";

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


});

export default styles;