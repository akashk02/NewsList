import React from 'react';
import {View, SafeAreaView} from 'react-native';

import NewsList from './js/NewsList';

import fontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import featherIcon from 'react-native-vector-icons/Feather';

import {Colors} from 'react-native-paper';

fontAwesomeIcon.loadFont();
featherIcon.loadFont();
const App = () => (
  <SafeAreaView style={{flex: 1, backgroundColor: Colors.grey800}}>
    <View style={{flex: 1}}>
      <NewsList />
    </View>
  </SafeAreaView>
);

export default App;
