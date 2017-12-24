import React from 'react';


// 3rd party libraries
import {
  Actions,
  Router,
  Scene,
  // Reducer,
} from 'react-native-router-flux';

// Views
import MainView from './src/views/main';
import PrayerView from './src/views/prayer';
import FoodBrachotView from './src/views/food_brachot';
import SelectedPrayersView from './src/views/selected_prayers';
import ZmanimMinyanimView from './src/views/zmanim_minyanim';
import SettingsView from './src/views/settings';
import ZMSettingsView from './src/views/zmsettings';
import CalendarEventsView from './src/views/calendar_events';
import ShulView from './src/views/shul';

console.ignoredYellowBox = [
  'Warning: In next release empty section headers will be rendered.',
  'Warning: setState(...): Can only update a mounted or mounting component.',
  'Warning: You are manually calling a React.PropTypes validation',

];

const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="main" title="Main" component={MainView} initial={true} />
    <Scene key="prayer" title="Prayer" component={PrayerView} />
    <Scene key="food_brachot" title="FoodBrachot" component={FoodBrachotView} />
    <Scene key="selected_prayers" title="SelectedPrayers" component={SelectedPrayersView} />
    <Scene key="zmanim_minyanim" title="ZmanimMinyanim" component={ZmanimMinyanimView} />
    <Scene key="settings" title="Settings" component={SettingsView} />
    <Scene key="zmsettings" title="ZMSettings" component={ZMSettingsView} />
    <Scene key="calendar_events" title="CalendarEvents" component={CalendarEventsView} />
    <Scene key="shul" title="Shul" component={ShulView} />
  </Scene>
);

class siddur extends React.Component {
  render() {
    return <Router scenes={scenes} />;
  }
}

export default siddur;
