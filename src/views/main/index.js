import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableHighlight,
	ActivityIndicator,
	Image,
	ListView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default class Main extends Component {
	constructor(props) {
		super(props);
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

		this.state = {
			hebrewDate: "",
			hebrewEvent: "",
			dataSource: ds.cloneWithRows([{icon: 'wb-sunny', text: "Shacharit", id:"shacharit"},
						{icon: 'wb-sunny', text: "Mincha", id:"mincha"},
						{icon: 'wb-sunny', text: "Arvit", id:"arvit"},
						{icon: 'hotel', text: "Bedtime Shema", id:"bedtime_shema"},
						{icon: 'restaurant', text: "Food Brachot", id:"food_brachot"},
						{icon: 'format-quote', text: "Selected Prayers", id:"selected_prayers"},
						{icon: 'format-quote', text: "Bookmarked Prayers", id:"bookmarked_prayers"},
						{icon: 'access-time', text: "Zmanim & Minyanim", id:"zmanim_minyanim"},
						{icon: 'date-range', text: "Luach & Calendar Events", id:"luach_calendar_events"},
						{icon: 'settings', text: "Settings", id:"settings"}])
		};

	}

	getDate() {
		var today = new Date();
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var dayString = days[parseInt(today.getDay())];
		var monthString = months[parseInt(today.getMonth())];
		var date = dayString + " " + today.getDate() + " " + monthString + ", " + today.getFullYear();
		return date;
	}

	getHebrewDate() {
		var today = new Date();
		var parameter = {
			cfg: 'json',
			gy: today.getFullYear(),
			gm: today.getMonth() + 1,
			gd: today.getDate(),
			g2h: 1
		}
		var querystring = Object.keys(parameter)
			.map(key => key + '=' + encodeURIComponent(parameter[key]))
			.join('&');
		querystring = 'http://www.hebcal.com/converter/?' + querystring;
		console.log(querystring);
		fetch(querystring)
			.then(response => response.json())
			.then(json => this.gotHebrewDate(json))
			.catch(error =>
				this.setState({
					hebrewDate: 'Error!' + error

		}));
	}

	gotHebrewDate(response) {
		console.log(response);
		if (response.error == null) {
			this.setState({hebrewDate:response.hd + " Of " + response.hm + ", " + response.hy,
							hebrewEvent:((response.events != null) ? response.events : "")});

		}
	}

	componentWillMount() {
		this.getHebrewDate();
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.text}>
						SHALOM!
					</Text>
					<Text style={styles.dateText}>
						{this.getDate()}
					</Text>
					<Text style={styles.hdateText}>
						{this.state.hebrewDate}
					</Text>
					<Text style={styles.hdateText}>
						{this.state.hebrewEvent}
					</Text>
				</View>
				<View style={styles.tableContents}>
					<Text style={styles.titleTableContents}>
						Table of Contents
					</Text>
					<ListView style={styles.tableList}
						dataSource={this.state.dataSource}
						renderRow={this.renderRow.bind(this)}/>
				</View>
				<View style={styles.footer}>
				</View>
			</View>
		);
	}

	renderRow(rowData, sectionID, rowID) {
		return (
			<TouchableHighlight onPress={() => this.rowPressed(rowData.id)}
				underlayColor='#dddddd'>
				<View>
					<View style={styles.rowContainer}>
						{/*<Image style={styles.content_icon} source={require("../../assets/img/icon_main.png" )} />*/}
						<Icon name={rowData.icon} color="black" size={24} style={styles.content_icon}/>
						<Text style={styles.content_text}>{rowData.text}</Text>
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
		);
	}

	rowPressed(content_id) {
		switch (content_id) {
			case 'bookmarked_prayers':
				Actions.selected_prayers({'category':'bookmark', 'categoryTitle':'Bookmarked Prayers'});
				break;
			case 'food_brachot':
				Actions.food_brachot();
				break;
			case 'selected_prayers':
				Actions.selected_prayers({'category':'7', 'categoryTitle':'Selected Prayers'});
				break;
			case 'zmanim_minyanim':
				Actions.zmanim_minyanim();
				break;
			case 'luach_calendar_events':
				Actions.calendar_events();
				break;
			case 'settings':
				Actions.settings();
				break;
			case 'shacharit':
				Actions.selected_prayers({'category':'1', 'categoryTitle':'Shacharit'});
				break;	
			case 'mincha':
				Actions.selected_prayers({'category':'4', 'categoryTitle':'Mincha'});
				break;	
			case 'bedtime_shema':
				Actions.selected_prayers({'category':'8', 'categoryTitle':'Bedtime Shema'});
				break;	
			case 'arvit':
				Actions.selected_prayers({'category':'6', 'categoryTitle':'Arvit'});
				break;	
			default:
				Actions.prayer();
		}
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	text: {
		color: 'white',
		fontSize: 30,
		fontWeight: 'bold',
		fontFamily: 'Abel',
		marginTop: 30,
		alignSelf: 'center'
	},
	dateText: {
		color: 'white',
		fontSize: 22,
		fontFamily: 'Abel',
		alignSelf: 'center'
	},
	hdateText: {
		color: 'white',
		fontSize: 18,
		fontFamily: 'Abel',
		alignSelf: 'center',
		fontWeight: 'bold'
	},
	header: {
		backgroundColor: '#00A4D3',
		height: 150
	},
	footer: {
		//flex: 1,
		backgroundColor: '#00A4D3',
		height: 60,
	},
	tableContents: {
		flex: 1,
		backgroundColor: 'white',
	},
	titleTableContents: {
		fontSize: 20,
		fontFamily: 'Abel',
		fontWeight: 'bold',
		color: '#006E8C',
		marginTop: 10,
		marginLeft: 10
	},
	tableList: {
		marginLeft: 35,
		marginTop: 10
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
	content_text: {
		flex: 1,
		fontFamily: 'Abel',
		marginTop: 10
	},
}); 
