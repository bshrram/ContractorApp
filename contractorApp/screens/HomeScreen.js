import React from 'react';
import {Alert, AsyncStorage, Button, RefreshControl, StyleSheet, FlatList, ActivityIndicator, View } from 'react-native';
import { ListItem } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale';
import axios from 'axios';
import { Icon } from 'react-native-elements';
const config = require('../config.json')
const backendApi = config.backendApi;

const customersApi = backendApi + '/api/customers';

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: true, refreshing: false }
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Home',
      headerRight: (
        <Icon
          raised
          name="add"
          color='#00aced'
          onPress={() => navigation.navigate('NewCustomer')}
          title="add"
        />
      )
    }
  };


  // refresh data on pull
  _onRefresh = () => {
    this.setState({ refreshing: true });
    return fetch(customersApi)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
          refreshing: false
        }, function () {

        });

      })
      .catch((error) => {
        console.error(error);
      });
  }
  // fetch data on mount the component
  async componentDidMount() {
    try {
      const response = await fetch(customersApi);
      const responseJson = await response.json();
      this.setState({
        isLoading: false,
        dataSource: responseJson,
      }, function () {
      });
    }
    catch (error) {
      if (error) {
        Alert.alert("No Connection!");
        console.log(error)
      }
    }
  }

  _signOutAsync = async () => {
    const value = await AsyncStorage.getItem('userToken');
    axios.post(backendApi + '/api/contractors/logout?access_token=' + value)
      .then(response => {
        AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
      })
      .catch(error => {
        if (error.response) {
          AsyncStorage.clear();
          this.props.navigation.navigate('Auth');
          console.log(error);

        }
        else {
          console.log(error);
          Alert.alert("Error!");
        }
      })
  };


  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Button title="sign me out" onPress={this._signOutAsync} />
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
              <ListItem
                Component={TouchableScale}
                onPress={() =>
                  this.props.navigation.navigate('Details', {
                    customerId: item.id
                  })
                }
                friction={90}
                tension={100}
                activeScale={0.95}
                containerStyle={{ backgroundColor: "orange" }}
                titleStyle={{ color: 'white', fontWeight: 'bold' }}
                subtitleStyle={{ color: 'white' }}
                title={item.name}

              />
            </View>
          )}
          numColumns={2}

          keyExtractor={({ id }, index) => id}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
