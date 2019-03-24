import React from 'react';
import { Alert,TouchableOpacity, View, Button, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import * as firebase from 'firebase';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob'
import RNRestart from 'react-native-restart';

const configapi = require('../config.json')
const backendApi = configapi.backendApi;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBjNJCo63-Ylni83YnDn6kHX3if8yxV4uU",
  authDomain: "contractorapp-a17a1.firebaseapp.com",
  databaseURL: "https://contractorapp-a17a1.firebaseio.com",
  projectId: "contractorapp-a17a1",
  storageBucket: "contractorapp-a17a1.appspot.com",
  messagingSenderId: "862634192397"
};
firebase.initializeApp(config);


export default class SketchScreen extends React.Component {
  static navigationOptions = {
    title: 'Draw',
  };
  state = {
    drawnImage: ''
  }

  updateState = () => {
    this.canvas.getBase64('jpg', false, true, false, false, (err, result) => {
      const resultImage = result
      this.setState({ drawnImage: resultImage })
    })
  }
  clear = () => {
    this.canvas.clear()
    this.setState({ drawnImage: '' })
  }

  render() {
    const { navigation } = this.props;
    const values = navigation.getParam('values', null)
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.rows}>
            <TouchableOpacity onPress={() => this.clear()} style={styles.functionButton}>
              <Text style={{ color: 'white' }}>Clear</Text>
            </TouchableOpacity>
          </View>
          <SketchCanvas
            ref={ref => (this.canvas = ref)}
            style={styles.SketchCanvas}
            strokeColor={'#FF0000'}
            strokeWidth={10}
            onStrokeEnd={this.updateState}
          />
        </View>
        <Button
          style={styles.button}
          title="SUBMIT"
          onPress={() => this._onSubmit(values, this.state.drawnImage)}
        />
        {this._maybeRenderUploadingOverlay()}
      </View>
    )
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  // post the new costumer details to the server
  _onSubmit = async (values, uri) => {
    try {
      this.setState({ uploading: true });
      const refstate=this;
      uploadUrl = await uploadImageAsync(values, uri);
      axios.post(backendApi + '/api/customers',
        { ...values, ...{ sketch: uploadUrl } })
        .then(function (response) {
          refstate.setState({ uploading: false });
          Alert.alert('Submitted successfully!')
          setTimeout(RNRestart.Restart(), 2000)
        })
        .catch(error => {
          console.log(error);
          Alert.alert('Error');
        })
    } catch (e) {
      this.setState({ uploading: false });
      console.log(e);
      Alert.alert('Upload failed, sorry :(');
      setTimeout(RNRestart.Restart(), 2000);  
    }
  };
}

// this function convert base64 image to blob then upload it to firebase storage
async function uploadImageAsync(values, uri) {
  const Blob = RNFetchBlob.polyfill.Blob
  const fs = RNFetchBlob.fs
  window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
  window.Blob = Blob

  let uploadBlob = null
  const d = new Date();
  const imageRef = firebase.storage().ref('posts').child(values.name + ' ' + d + ".jpg")
  let mime = 'image/jpg'
  const blob = await Blob.build(uri, { type: `${mime};BASE64` });
  uploadBlob = blob;
  const snapshot = await imageRef.put(blob, { contentType: mime });
  uploadBlob.close();
  return await snapshot.ref.getDownloadURL();
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  functionButton: {
    marginHorizontal: 2.5, marginVertical: 8, height: 30, width: 60,
    backgroundColor: '#39579A', justifyContent: 'center', alignItems: 'center', borderRadius: 5,
  },
  SketchCanvas: {
    width: 280,
    height: 280,
    borderColor: 'black',
    marginTop: 30,
    borderWidth: 1,
    backgroundColor: '#F5FCFF'
  },
  button: {
    zIndex: 1,
    padding: 12,
    minWidth: 56,
    minHeight: 48,
  },
  rows: {
    flexDirection: 'row'
  }
});