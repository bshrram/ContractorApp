import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import NewCustomerScreen from '../screens/NewCustomerScreen';
import SketchScreen from '../screens/SketchScreen';

export default createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen,
  NewCustomer: NewCustomerScreen,
  Sketch: SketchScreen
});




