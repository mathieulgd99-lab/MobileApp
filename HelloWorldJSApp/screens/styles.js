import { StyleSheet } from 'react-native';


// React icons 
////////////////////////////////////////////////////
//////////// https://ionic.io/ionicons /////////////
/////////////////////////////////////////////////////


export default StyleSheet.create({
  container: {
    paddingTop: 24,
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingVertical: 20,
    paddingBottom: 60,
  },
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
  image_zoomed: {
    width: "100%",
    height: "85%",
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

  header : {
    backgroundColor : 'white',
    height: "5%",
    alignItems: "center",

  },

  header_grade : {
    backgroundColor : 'grey',
    color : 'white',
    width : "5%",
    textAlign: 'center',
    borderRadius: 5,
    fontSize: 18,
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
});
    