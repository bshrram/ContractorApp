/* this is a screen to create new customer, it can be acessed by the button in top of HomeScreen */
import React from 'react';
import { View, Button, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Formik } from 'formik';
import { Text } from 'react-native-elements';
import { handleTextInput, withNextInputAutoFocusForm, withNextInputAutoFocusInput } from "react-native-formik";
import { compose } from "recompose";
import { TextField } from "react-native-material-textfield";
import * as Yup from "yup";

const FormikInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(TextField);
const InputsContainer = withNextInputAutoFocusForm(View);

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required(),
  email: Yup.string()
    .required()
    .email("that's not an email"),
  phone: Yup.string()
    .required()
});
export default class NewCustomerScreen extends React.Component {
  static navigationOptions = {
    title: 'New Customer',
  };
  render() {
    return (
      <Formik
        onSubmit={values => this.props.navigation.navigate('Sketch', { values })}
        validationSchema={validationSchema}
      >
        {props => (
          <ScrollView style={{ padding: 20, flex: 1 }}>
            <KeyboardAvoidingView behavior="padding">
              <InputsContainer>
                <FormikInput label="Name" name="name" type="name" />
                <FormikInput label="Email" name="email" type="email" />
                <FormikInput label="Phone" name="phone" type="phone" />
                <FormikInput label="Notes" name="notes" type="notes" />
                <Text></Text>
                <Button onPress={props.submitForm} title="Draw" />
                <View style={{ height: 100 }} />
              </InputsContainer>
            </KeyboardAvoidingView>
          </ScrollView>
        )}
      </Formik>
    )
  }
}