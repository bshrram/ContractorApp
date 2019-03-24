/* this is the Details screen of customer, it gets id as a param */
import React from 'react';
import { Alert,ActivityIndicator, View, ScrollView, Image } from 'react-native';
import { Text } from 'react-native-elements'
const config = require ('../config.json')
const backendApi= config.backendApi;


const customersApi = backendApi+'/api/customers';

export default class DetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }
    static navigationOptions = {
        title: 'Details',
    };


    // fetch customer details from the server
    componentDidMount() {
        const { navigation } = this.props;
        const customerId = navigation.getParam('customerId', 'NO-ID');
        return fetch(customersApi + '/' + customerId)
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                }, function () {

                });

            })
            .catch((error) => {
                if (error){
                    console.error(error);
                    Alert.alert('No connection!')
                }
                
            });
    }
    render() {
        const customer = this.state.dataSource;
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }
        console.log(customer);
        return (
            <ScrollView>
            <View style={{flex:1, padding:20}}>
                <Text h4>Name:</Text>
                <Text>{customer.name + '\n'}</Text>
                <Text h4>Email:</Text>
                <Text>{customer.email + '\n'}</Text>
                <Text h4>Phone:</Text>
                <Text>{customer.phone + '\n'}</Text>
                <Text h4>Notes:</Text>
                <Text>{customer.notes}</Text>
                <Text h4>{'\n'}Sketch:</Text>
                <Image style={{height:280}} source={{ uri: customer.sketch }} />
            </View>
            </ScrollView>
        )


    }
}