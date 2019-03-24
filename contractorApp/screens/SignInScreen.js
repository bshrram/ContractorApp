import React from 'react';
import {Alert, ScrollView, KeyboardAvoidingView, View, AsyncStorage } from 'react-native'
import { Button } from "react-native-elements";
import { Formik } from 'formik';
import { handleTextInput, withNextInputAutoFocusForm, withNextInputAutoFocusInput } from "react-native-formik";
import { compose } from "recompose";
import { TextField } from "react-native-material-textfield";
import axios from 'axios';
import * as Yup from "yup";

const config = require ('../config.json')
const backendApi= config.backendApi;



const FormikInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(TextField);
const InputsContainer = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required(),
  password: Yup.string()
    .required()
});

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <Formik
        onSubmit={values => this._signInAsync(values)}
        validationSchema={validationSchema}
      >
        {props => (
          <ScrollView>
            <KeyboardAvoidingView
              behavior='padding'
              keyboardVerticalOffset={100}
            >
              <InputsContainer style={{ padding: 10, paddingVertical: 20 }}>
                <FormikInput label="username" name="username" type="username" />
                <FormikInput label="password" name="password" type="password" />
                <Button
                  buttonStyle={{ marginTop: 20 }}
                  backgroundColor="#03A9F4"
                  title="SIGN IN"
                  onPress={props.submitForm}
                />
                <View style={{ height: 100 }}></View>
              </InputsContainer>
            </KeyboardAvoidingView>
          </ScrollView>
        )}
      </Formik>

    );
  }

  _signInAsync = async (values) => {
    axios.post(backendApi + '/api/contractors/login', { ...values })
      .then(function (response) {
        Alert.alert('Welcome contractor!')
        return response.data;
      })
      .then((res) => {
        AsyncStorage.setItem('userToken', res.id);
        this.props.navigation.navigate('Main');
      })
      .catch(error => {
        console.log(error);
        Alert.alert('Error')
      })

  };
}
