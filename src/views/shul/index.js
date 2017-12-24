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

var { width, height } = Dimensions.get('window');

const MAP_HEIGHT = 280;
const ASPECT_RATIO = width / MAP_HEIGHT;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


export default class Shul extends Component
{
	constructor(props) {
		super(props);
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

		this.state = {
			hebrewDate: "",
			hebrewEvent: "",
			dataSource: ds.cloneWithRows([
						{country: "Beth Gavriel", name: "E. Hamizrach", id:"1"},
						{country: "Beth Jacob Jewish Educational ...", name: "Ashkenaz", id:"2"},
						{country: "Bukharian Jewish Community ...", name: "E. Hamizrach", id:"3"},
						{country: "Chabad of Forest Hills North", name: "Arizal", id:"4"},
						{country: "Chofetz Chaim Kessel St Synagogue", name: "Ashkenaz", id:"5"},
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
		};
	}

	componentWillUnmount()
	{
		timer.clearTimeout("setCurrentLocation");
	}

	componentDidMount() 
	{
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
						<Icon name="keyboard-backspace" color="white" size={24} />
					</TouchableHighlight>
					<View style={styles.foodBrachotTitle}>
						<Text style={styles.foodBrachotTitleText}>
							BETH GAVRIEL
						</Text>
					</View>
				</View>
				<View style={styles.foodBrachotContent}>
					<View style={styles.mapViewContainer}>
						<MapView
							ref="map"
							mapType="terrain"
							style={styles.mapView}
							region={this.state.region}
							onRegionChange={this.onRegionChange.bind(this)}
						/>
					</View>
				</View>
			</View>
		);
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
						<Text style={styles.content_country_text}>{rowData.country}</Text>
						<View style={styles.content_name_container}>
							<Text style={styles.content_name_text}>{rowData.name}</Text>
						</View>
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
		);
	}

	rowPressed(content_id) {
		switch (content_id) {
			case 'food_brachot':
				Actions.food_brachot();
				break;
			default:
				Actions.prayer();
		}
	}

	onRegionChange(region) {
		this.setState({ region });
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
		backgroundColor: 'white',
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
		// flex:1,
		height: MAP_HEIGHT
	},
	mapView: {
		// flex:1,
		height: MAP_HEIGHT
	},
	tableList: {
		marginLeft: 15,
		marginTop: 5
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