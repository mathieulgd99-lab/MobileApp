### SETUP

Run the following commands :


if old npm version :

```sh
sudo apt remove -y nodejs libnode-dev
sudo apt purge -y nodejs libnode-dev
sudo apt autoremove -y
```

Init project :
```sh
npx create-expo-app HelloWorldApp
```

Then : 

```sh
npx expo start 
# You need to install Expo Go on your cellphone and scan the QR generated
# You need to be on the same wifi on your computer and cellphone
```

Shake your phone to have the developper menu



Navigation :

```sh
npm install expo
npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
# To select differents pages/windows at the bottom
npm install @react-navigation/bottom-tabs
# To select differents pages/windows at the top
npm install @react-navigation/material-top-tabs react-native-tab-view
```

Install svg :
```sh
# To represent differents zones of the gym
npm install @react-navigation/material-top-tabs react-native-tab-view
```