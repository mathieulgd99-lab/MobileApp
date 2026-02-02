
import { 
  ScrollView, 
  Text, 
  View,
  StyleSheet, 
  TouchableOpacity, 
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import React from "react";
import styles from "../styles";



export default function InfosScreen() {

  const callPhone = () => Linking.openURL('tel:+8402466624352');
  const openFacebook = () => Linking.openURL("https://web.facebook.com/VietClimb")
  const openInternet = () => Linking.openURL("https://vietclimb.vn/")
  const openAdress = () => Linking.openURL("https://www.google.com/maps/place/VietClimb/@21.0549222,105.8373473,17z/data=!3m1!4b1!4m6!3m5!1s0x3135aa4d44cc8725:0x7586ea6c73c21483!8m2!3d21.0549222!4d105.8399222!16s%2Fg%2F12m99cdrt?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D")
  const openInstagram = () => Linking.openURL("https://www.instagram.com/vietclimb?igsh=cDhxcHlzYzlhaGtn")

// tel adresse horaires d'ouvertures en haut 
// to do : AJOUTER PRIX 
// social media en bas 
  return (
    
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
       
      <View style={styles.titleContainer}>
        <Text style={styles.title}>General informations</Text>
      </View>

      

      {/* Adresse - prix - numéro de tel - message de la salles */}
      <View style={styles.infoBlock}>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color="#fff" />
          <Text style={styles.addressText}>
            Monday to Sunday : 10 am – 10 pm
          </Text>
        </View>

        <TouchableOpacity onPress={callPhone} style={styles.infoRow}>
          <Ionicons name="call-outline" size={18} color="#4EA8FF" />
          <Text style={[styles.addressText, styles.linkText]}>
            +84 024 6662 4352
          </Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={openAdress} style={styles.addressRow}>
          <Ionicons name="location-outline" size={20} color="#4EA8FF" />
          <Text style={[styles.addressText, styles.linkText]}>
            2 Ng. 76 An Dương, Yên Phụ, Tây Hồ, Hà Nội 100000, Vietnam
          </Text>
        </TouchableOpacity>

      
      </View>



      

      {/* Séparateur */}
      <View style={styles.divider} />

      {/* Header de section */}
      <View style={styles.sectionHeader}>
        <Ionicons name="information-circle-outline" size={16} color="#aaa" />
        <Text style={styles.sectionTitle}>Description</Text>
      </View>

      {/* Bloc texte */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
        You asked for it, so here it is — Vietclimb Hanoi has opened its doors and is ready to welcome climbers from across the city and beyond. Our brand-new bouldering gym brings the best of urban climbing to the heart of Hanoi for everyone who wants to climb, train, and hang out.

        {"\n\n"}

        Perfectly placed in central Hanoi and close to universities and outdoor crags, Vietclimb is your new go-to climbing spot. Our spacious facility features a variety of walls and routes for all levels, with problems refreshed regularly so there’s always something new to try. Whether you’re dropping in after class or planning serious training sessions, you’ll find the space and the vibe you need.
 
        {"\n\n"}
        Beginners and seasoned climbers of every age will find ways to progress and sharpen technique. Children from age 3 (when accompanied) enjoy a dedicated kids’ area designed for smaller bodies and playful learning. Free access to our walls lets you explore and improve at your own pace, and we also run year-round climbing classes and holiday camps led by experienced, qualified coaches.
        {"\n\n"}
        Our training area is packed with the tools climbers love: campus boards, a spray wall, and specialized circuits to build strength and endurance. After a session, unwind in our recovery and wellness area — a perfect place to stretch, restore and recharge.
        {"\n\n"}
        Vietclimb is more than a gym — it’s a community hub. Meet friends or make new ones in our bar-restaurant and tree-lined terrace, enjoy local dishes and homemade plates prepared with fresh, responsibly sourced ingredients, and take part in regular chill evenings and events in a friendly, neo-urban atmosphere.
        {"\n\n"}
        We can’t wait to welcome you to Vietclimb Hanoi. Come discover a new way to climb, train, and belong — see you on the wall!
        {"\n\n"}
        </Text>
      </View>


  
      {/* Séparateur */}
      <View style={styles.divider} />

      {/* Header de section */}
      <View style={styles.sectionHeader}>
        <Ionicons name="share-social-outline" size={16} color="#aaa" />
        <Text style={styles.sectionTitle}>Follow us !</Text>
      </View>

      {/* Icones  */}
      <ScrollView horizontal contentContainerStyle={styles.iconsContainer} showsHorizontalScrollIndicator={false}>

        <TouchableOpacity onPress={openFacebook} style={styles.iconButton}>
          <Ionicons name="logo-facebook" size={40} color="#1877F2" />
        </TouchableOpacity>

        <TouchableOpacity onPress={openInternet} style = {styles.iconButton}>
          <Ionicons name="globe-outline" size={40} color="#fff"/>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={openInstagram} style = {styles.iconButton}>
          <Ionicons name="logo-instagram" size={40} color="#E4405F"/>
        </TouchableOpacity>

      </ScrollView>


    </ScrollView>
  );
}
/*const styles = StyleSheet.create({
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
*/