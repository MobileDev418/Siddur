import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableHighlight,
	ActivityIndicator,
	Image,
	ListView,
	Dimensions
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchBar from 'react-native-search-bar';
import MapView from 'react-native-maps';
import { SegmentedControls } from 'react-native-radio-buttons';
import timer from 'react-native-timer';
import Modal from 'react-native-simple-modal';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoder'
var DOMParser = require('xmldom').DOMParser

var { width, height } = Dimensions.get('window');

const MAP_HEIGHT = 280;
const ASPECT_RATIO = width / MAP_HEIGHT;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const MAX_MAKER_COUNT = 30;
var APIURL = "https://api.myzmanim.com/engine1.json.aspx"
var APIUSER = "0007227938"
var APIKEY = "bd9063b79893cc4d5ed383879897c7eac8709850e47ec82d4fe059e55f58f866c6b4fa9a9c7c7386"
var This;


export default class ZmanimMinyanim extends Component
{
	constructor(props) {
		super(props);
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

		this.state = {
			open: false,
			hebrewDate: "",
			hebrewEvent: "",
			mdataSource: ds.cloneWithRows([
						// {country: "Beth Gavriel", name: "E. Hamizrach", id:"1"},
						// {country: "Beth Jacob Jewish Educational ...", name: "Ashkenaz", id:"2"},
						// {country: "Bukharian Jewish Community ...", name: "E. Hamizrach", id:"3"},
						// {country: "Chabad of Forest Hills North", name: "Arizal", id:"4"},
						// {country: "Chofetz Chaim Kessel St Synagogue", name: "Ashkenaz", id:"5"},
						// {country: "Beth Gavriel", name: "E. Hamizrach", id:"1"},
						// {country: "Beth Jacob Jewish Educational ...", name: "Ashkenaz", id:"2"},
						// {country: "Bukharian Jewish Community ...", name: "E. Hamizrach", id:"3"},
						// {country: "Chabad of Forest Hills North", name: "Arizal", id:"4"},
						// {country: "Chofetz Chaim Kessel St Synagogue", name: "Ashkenaz", id:"5"},
						]),
			zdataSource: ds2.cloneWithRows([
						]),
			region: {
				latitude: LATITUDE,
				longitude: LONGITUDE,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA,
			},
			currentRegion: {
				latitude: LATITUDE,
				longitude: LONGITUDE,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA,
			},
			selectedOption: 'Zmanim',
			markers: [],
		};
	}

	componentWillUnmount()
	{
		timer.clearTimeout("setCurrentLocation");
	}

	componentDidMount() 
	{
		This = this;
		timer.setTimeout("setCurrentLocation",
			() => {
				navigator.geolocation.getCurrentPosition(
					location => {
						this.setState({ currentRegion: {
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							latitudeDelta: LATITUDE_DELTA,
							longitudeDelta: LONGITUDE_DELTA
						}});
						this.setState({ region: {
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
							latitudeDelta: LATITUDE_DELTA,
							longitudeDelta: LONGITUDE_DELTA
						}});
					},
					error => {
						this.setState({
						message: 'There was a problem with obtaining your location: ' + error
					});
				});
			},
			1000
		);
	}

	render() {
		const options = [
			"Zmanim",
			"Minyanim"
		];

		const normalStyle = {
		  color: 'white'
		};

		const selectedStyle = {
		  color: '#f80046',
		  fontWeight: 'bold'
		};

		const extractText = (option) => option.label;

		function setSelectedOption(selectedOption) {
			this.setState({
				selectedOption
			});
			console.log(selectedOption);
		}


		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableHighlight onPress={this.onMenuPress} style={[styles.menuButton, styles.leftMenuButton]} underlayColor='white'>
						<Icon name="menu" color="white" size={24} />
					</TouchableHighlight>
					<View style={styles.foodBrachotTitle}>
						<View style={styles.segmentedTitle}>
							<SegmentedControls
								optionStyle={styles.segmentedControl}
								paddingTop={5}
								paddingBottom={5}
								containerBorderWidth={0}
								containerBorderRadius={2}
								containerBorderTint={'rgba(0,0,0,0)'}
								separatorWidth={1}
								separatorTint={'#006E8C'}
								tint={'#006E8C'}
								selectedTint={'white'}
								backTint={'white'}
								options={ options }
								onSelection={ setSelectedOption.bind(this) }
								selectedOption={ this.state.selectedOption }
							/>
						</View>
					</View>
					<TouchableHighlight onPress={this.onSettingsPress} style={[styles.menuButton, styles.rightMenuButton]} underlayColor='white'>
						<Icon name="settings" color="white" size={24} />
					</TouchableHighlight>
				</View>
				{ (this.state.selectedOption == "Minyanim") ?
				<View style={styles.foodBrachotContent}>
					<View>
						<View>
							<GooglePlacesAutocomplete
							placeholder='Search for location'
							minLength={2} // minimum length of text to search
							autoFocus={false}
							listViewDisplayed='auto'    // true/false/undefined
							fetchDetails={true}
							enablePoweredByContainer = {false}
							onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
							  // console.log(data);
							  // console.log(details);
							  console.log("updateMap");
							  this.updateMap(details.geometry.location.lat, details.geometry.location.lng);
							}}
							getDefaultValue={() => {
							  return ''; // text input default value
							}}
							query={{
							  // available options: https://developers.google.com/places/web-service/autocomplete
							  key: 'AIzaSyA0N15RQLW3d7kOPPzFJNLaZQF4HLLmc4w',
							  language: 'en', // language of the results
							  types: '(cities)', // default: 'geocode'
							}}
							styles={{
							  description: {
							    fontWeight: 'bold',
							  },
							  predefinedPlacesDescription: {
							    color: '#1faadb',
							  },
							}}

							currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
							currentLocationLabel="Current location"
							nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
							GoogleReverseGeocodingQuery={{
							  // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
							}}
							GooglePlacesSearchQuery={{
							  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
							  rankby: 'distance',
							  types: 'food',
							}}


							filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

							//predefinedPlaces={[homePlace, workPlace]}
							/>

						</View>
					</View>
					<View style={styles.mapViewContainer}>
						<MapView
							ref="map"
							mapType="terrain"
							style={styles.mapView}
							region={this.state.region}
							onRegionChangeComplete={this.onRegionChange.bind(this)}
						>
							{this.state.markers.map(marker => (
								<MapView.Marker
								coordinate={marker.coordinate}
								title={marker.title}
								description={marker.description}
								key={marker.key}
								/>
								))}
						</MapView>
					</View>
					<View style={styles.minyanimListContainer}>
						<ListView style={styles.tableList}
						dataSource={this.state.mdataSource}
						renderRow={this.renderRow.bind(this)}/>
					</View>
				</View>
				:
				<View style={styles.foodBrachotContent}>
					<View>
						<GooglePlacesAutocomplete
						placeholder='Search for location'
						minLength={2} // minimum length of text to search
						autoFocus={false}
						listViewDisplayed='auto'    // true/false/undefined
						fetchDetails={true}
						enablePoweredByContainer = {false}
						onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
						  console.log(data);
						  console.log(details);
						  console.log(details.geometry.location.lat);
						  this.searchZmanim(details.geometry.location.lat, details.geometry.location.lng);
						}}
						getDefaultValue={() => {
						  return ''; // text input default value
						}}
						query={{
						  // available options: https://developers.google.com/places/web-service/autocomplete
						  key: 'AIzaSyA0N15RQLW3d7kOPPzFJNLaZQF4HLLmc4w',
						  language: 'en', // language of the results
						  types: '(cities)', // default: 'geocode'
						}}
						styles={{
						  description: {
						    fontWeight: 'bold',
						  },
						  predefinedPlacesDescription: {
						    color: '#1faadb',
						  },
						}}

						currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
						currentLocationLabel="Current location"
						nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
						GoogleReverseGeocodingQuery={{
						  // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
						}}
						GooglePlacesSearchQuery={{
						  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
						  rankby: 'distance',
						  types: 'food',
						}}


						filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

						//predefinedPlaces={[homePlace, workPlace]}
						/>

					</View>
					<View style={styles.minyanimListContainer}>
						<ListView style={styles.tableList}
						dataSource={this.state.zdataSource}
						renderRow={this.renderRowZ.bind(this)}/>
					</View>
				</View>
				}
			</View>
		);
	}

	updateMap(latitude, longitude) {
		this.refs.map.animateToRegion({"latitude":latitude, "longitude":longitude});
	}

	searchZmanim(latitude, longitude) {
		this.loadingZmanim();
		var coding = "JS";
        var params = "coding=" + coding + "&latitude=" + latitude + "&longitude=" + longitude + "&key=" + APIKEY + "&user=" + APIUSER;
        var method = "searchGps";
        var url = APIURL + "/" + method;
        this.doCall(url, params, this.findGps_callback);
	}

	doCall(endpoint, parameters, callBack) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { callBack(xmlhttp.responseText); }
        }
        xmlhttp.open("POST", endpoint, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(parameters);
    }

	findGps_callback(response) {
        var result = JSON.parse(response);
        if (result.ErrMsg) {
            //document.write("Error: " + result.ErrMsg);
            return;
        }

        var today = new Date();
        var method = "getDay";
        var url = APIURL + "/" + method;
        var params = "coding=JS&language=en&locationid=" + result.LocationID + "&inputdate=" + This.formatDate(today) + "&key=" + APIKEY + "&user=" + APIUSER;
        This.doCall(url, params, This.displayZmanim_callback);
    }

    loadingZmanim() {
    	var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    	this.setState({zdataSource: ds.cloneWithRows([
						{item: "Loading...", time: ""},
						])});
    }

    displayZmanim_callback(response) {
    	var day = JSON.parse(response);

        if (day.ErrMsg) {
//            document.write("Error: " + day.ErrMsg);
            return;
        }

		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		var zdataSource = Array();
		zdataSource.push({item:"Dawn:", time:This.formatZman(day.Zman.Dawn72)});
		zdataSource.push({item:"Earliest Talis (" + day.Place.YakirDegreesDefault + "°):", time:This.formatZman(day.Zman.YakirDefault)});
		zdataSource.push({item:"Sunrise:", time:This.formatZman(day.Zman.SunriseDefault)});
		zdataSource.push({item:"Shema MA:", time:This.formatZman(day.Zman.ShemaMA72)});
		zdataSource.push({item:"Shema Gra:", time:This.formatZman(day.Zman.ShemaGra)});
		zdataSource.push({item:"Shachris Gra:", time:This.formatZman(day.Zman.ShachrisGra)});
		zdataSource.push({item:"Midday:", time:This.formatZman(day.Zman.Midday)});
		zdataSource.push({item:"Earliest Mincha:", time:This.formatZman(day.Zman.MinchaStrict)});
		zdataSource.push({item:"Plag Hamincha:", time:This.formatZman(day.Zman.PlagGra)});
		if (!This.zmanIsNull(day.Zman.Candles)) {
			zdataSource.push({item:"Candlelighting (" + day.Place.CandlelightingMinutes + " min):", time:This.formatZman(day.Zman.Candles)});
        }
		zdataSource.push({item:"Sunset:", time:This.formatZman(day.Zman.SunsetDefault)});
		zdataSource.push({item:"Night 3 stars:", time:This.formatZman(day.Zman.NightShabbos)});
		zdataSource.push({item:"Night 72 minutes:", time:This.formatZman(day.Zman.Night72fix)});
        This.setState({zdataSource: ds.cloneWithRows(zdataSource)})
    }

    zmanIsNull(zman) { return This.formatDate(zman) == "0001-01-01"; }

    formatDate(date) {
        var newdate = new Date(date);
        var strdate = newdate.toISOString();
        strdate = strdate.substring(0, 10);
        return strdate;
    }

    formatZman(zman) {
        d = new Date(zman);
        var hr = d.getUTCHours();
        var min = d.getUTCMinutes();
        var sec = d.getUTCSeconds();
        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        var ampm = hr < 12 ? " AM" : " PM";
        if (hr == 0) hr = 12;
        if (hr > 12) hr -= 12;
        var result = hr + ":" + min
        if (sec > 0) result += ":" + sec;
        result += ampm;
        return result
    }

	onSearchMinyanim() {

	}

	onNearMePress() {
		this.setState({ region: {
					latitude: this.state.currentRegion.latitude,
					longitude: this.state.currentRegion.longitude,
					latitudeDelta: LATITUDE_DELTA,
					longitudeDelta: LONGITUDE_DELTA
				}});
	}

	onMenuPress() {
		Actions.pop();
	}

	onSettingsPress() {
		Actions.zmsettings();
	}

	renderRow(rowData, sectionID, rowID) {
		return (
			<TouchableHighlight onPress={() => this.rowPressed(rowData.id)}
				underlayColor='#dddddd'>
				<View>
					<View style={styles.rowContainer}>
						<Text style={styles.content_country_text}>{rowData.name}</Text>
						<View style={styles.content_name_container}>
							<Text style={styles.content_name_text}>{rowData.rabbie}</Text>
						</View>
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
		);
	}

	renderRowZ(rowData, sectionID, rowID) {
		return (
			<TouchableHighlight
				underlayColor='#dddddd'>
				<View>
					<View style={styles.rowContainer}>
						<Text style={styles.content_country_text}>{rowData.item}</Text>
						<View style={styles.content_name_container}>
							<Text style={styles.content_name_text}>{rowData.time}</Text>
						</View>
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
		);
	}

	rowPressed(content_id) {
		Actions.shul();
	}

	onRegionChange(region) {
		this.setState({ region });
		console.log("Region Changed");
		this.debounce(this.getMinyanim, 500);
	}

	debounce(fn, delay) {
		var timeout;

		// return function () {
		    var context = this,
		        args = arguments;

		    clearTimeout(timeout);
		    timeout = setTimeout(function () {
		        fn.apply(context, args);
		    }, delay || 250);
		// };
	}

	getMinyanim() {
		var region = this.state.region;
		console.log("Lat:" + region.latitude + " Lng:" + region.longitude);
		if (region.latitudeDelta * 69 > 20)
			return;
		console.log("Radius: " + region.latitudeDelta * 69);
		Geocoder.geocodePosition({lat:region.latitude, lng:region.longitude}).then(res => {
		    // res is an Array of geocoding object (see below)
		    console.log("Res postalCode:" + res[0].postalCode);
		    if (res.length > 0) {
		    	res = res[0];
		    	//http://godaven.com/GetResults.aspx?Page=GetProximity&Radius=0&lat=40.729375&lng=-73.847272&Search=11375
		    	var parameter = {
					Page: 'GetProximity',
					Radius: region.latitudeDelta * 69 / 2,
					lat: region.latitude,
					lng: region.longitude,
					Search: (res.postalCode) ? res.postalCode : res.locality,
				}
				var querystring = Object.keys(parameter)
					.map(key => key + '=' + encodeURIComponent(parameter[key]))
					.join('&');
				querystring = 'http://godaven.com/GetResults.aspx?' + querystring;
				console.log(querystring);
				fetch(querystring)
					.then(response => response.text())
					.then(text => this.gotMinyanim(text))
					.catch(error =>
						this.setState({
							hebrewEvents: 'Error!' + error

				}));
		    }
		})
		.catch(err => console.log(err));
	}

	gotMinyanim(text) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(text,"text/xml");
		var nameList = doc.getElementsByTagName("Name");
		var addressList = doc.getElementsByTagName("Address");
		var latList = doc.getElementsByTagName("latitude");
		var lngList = doc.getElementsByTagName("longitude");
		console.log("XML Result:" + nameList);

		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		var mdataSource = Array();
		var markers = Array();
		for (var i=0; i < nameList.length && i < MAX_MAKER_COUNT; i++) {
			mdataSource.push({
				name: nameList[i].textContent,
				rabbie: addressList[i].textContent,
			});
			markers.push({
				coordinate: {latitude:eval(latList[i].textContent), longitude:eval(lngList[i].textContent)},
				title: nameList[i].textContent,
				description: addressList[i].textContent,
				key: i,
			})
		}

		This.setState({
			markers: markers
		});

		This.setState({mdataSource: ds.cloneWithRows(mdataSource)})
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	foodBrachotTitle: {
		marginTop: 33,
		flex: 1,
		flexDirection: 'column',
	},
	foodBrachotTitleText: {
		color: 'white',
		fontSize: 16,
		fontFamily: 'Abel',
		alignSelf: 'center',
	},
	segmentedTitle: {
		alignSelf: 'center'
	},
	segmentedControl: {
		fontSize: 12,
		fontFamily: 'Abel',
		paddingLeft: 30,
		paddingRight: 30
	},
	header: {
		backgroundColor: '#00A4D3',
		flexDirection: 'row',
		height: 64,
	},
	leftMenuButton: {
		marginTop: 33,
		marginLeft: 5,
		marginRight: 5
	},
	rightMenuButton: {
		marginTop: 33,
		marginLeft: 5,
		marginRight: 5
	},
	centerMenuButton: {
		marginTop: 33,
		marginLeft: 5,
		marginRight: 0
	},
	menuButton: {
		width: 30,
		height: 30,
	},
	foodBrachotContent: {
		flex: 1,
		flexDirection: 'column',
	},
	searchContainer: {
		flexDirection: 'row',
	},
	searchBar: {
		flex:1
	},
	nearmeIconContainer: {
		width:44,
		height:44,
		backgroundColor:'#C9C9CE'
	},
	nearmeIcon: {
		marginTop: 10,
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 10
	},
	prayerContentText: {
		fontSize: 16,
		fontFamily: 'Abel'
	},
	mapViewContainer: {
		height: MAP_HEIGHT
	},
	mapView: {
		height: MAP_HEIGHT
	},
	minyanimListContainer: {
		flex:1,
		marginBottom: 5
	},
	tableList: {
		marginLeft: 15,
		marginTop: 5,
	},
	separator: {
		height: 1,
		backgroundColor: '#dddddd'
	},
	rowContainer: {
		flexDirection: 'row',
		padding: 3
	},
	content_icon: {
		marginTop: 5,
		marginRight: 10,
		marginBottom: 5,
	},
	content_country_text: {
		flex: 3,
		fontFamily: 'Abel',
		marginTop: 10,
		fontSize: 16
	},
	content_name_container: {
		alignItems: 'flex-end',
	},
	content_name_text: {
		flex: 2,
		fontFamily: 'Abel',
		marginTop: 10,
		marginRight: 10,
		fontSize: 16,
		color: 'grey'
	},

});