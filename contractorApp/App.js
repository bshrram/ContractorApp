import React from 'react';
import { StyleSheet, View,Platform } from 'react-native';

import AppNavigator from './navigation/AppNavigator';
import { Header } from 'react-native-elements';


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
      
      return (
        <View style={styles.container}>
          <Header
            centerComponent={{ text: 'Contractor App', style: { color: '#fff' } }}
            containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 24}}

          />
          <AppNavigator />
        </View>
      );
    
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
