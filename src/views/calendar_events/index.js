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
import SearchBar from 'react-native-search-bar';
import Calendar from 'react-native-calendar';
import moment from 'moment';

const customDayHeadings = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const customMonthNames = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'Septempber', 'October', 'November', 'December'];
export default class CalendarEvents extends Component
 {
	constructor(props) {
		super(props);
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

		this.state = {
			currentYear: "",
			currentMonth: "",
			dataSource: ds.cloneWithRows([
						// {text: "Parashat Beha'alotcha", id:"1"},
						// {text: "Jul 6, 16 Rosh Chodesh Tammuz", id:"2"},
						// {text: "Jul 7, 16 Rosh Chodesh Tammuz", id:"3"},
						// {text: "Jul 24, 16 Fast of Tammuz", id:"4"},
						// {text: "Aug 5, 16 Rosh Chodesh Av", id:"5"},
						]),
		};
	}

	getHebrewEvents() {
		var parameter = {
			cfg: 'json',
			v: 1,
			nx: 'on',
			year: this.state.currentYear,
			month: this.state.currentMonth,
			ss: 'on',
			mf: 'on',
			c: 'on',
			m: '50', // Settings Havdala,
			s: 'on',
			maj: 'on',
			min: 'on',
			mod: 'on',
		}
		var querystring = Object.keys(parameter)
			.map(key => key + '=' + encodeURIComponent(parameter[key]))
			.join('&');
		querystring = 'http://www.hebcal.com/hebcal/?' + querystring;
		console.log(querystring);
		fetch(querystring)
			.then(response => response.json())
			.then(json => this.gotHebrewEvents(json))
			.catch(error =>
				this.setState({
					hebrewEvents: 'Error!' + error

		}));
	}

	gotHebrewEvents(response) {
		console.log(response);
		if (response.error == null) {
			var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
	    	this.setState({dataSource: ds.cloneWithRows(response.items)});
		}
	}

	componentWillMount() {
		var today = new Date();
		this.setState({currentYear:today.getFullYear(), currentMonth:today.getMonth() + 1});
		this.state.currentYear = today.getFullYear();
		this.state.currentMonth = today.getMonth() + 1;
		this.getHebrewEvents();
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableHighlight onPress={this.onMenuPress} style={[styles.menuButton, styles.leftMenuButton]} underlayColor='white'>
						<Icon name="menu" color="white" size={24} />
					</TouchableHighlight>
					<View style={styles.foodBrachotTitle}>
						<Text style={styles.foodBrachotTitleText}>
							{'      '}LUACH & CALENDAR EVENTS
						</Text>
					</View>
					<TouchableHighlight onPress={this.onMenuPress} style={[styles.menuButton, styles.rightMenuButton]} underlayColor='white'>
						<Icon name="date-range" color="white" size={24} />
					</TouchableHighlight>
				</View>
				<View style={styles.foodBrachotContent}>
					<View>
						<SearchBar placeholder='Search for Calendar Events'/>
					</View>
					<View>
						<Calendar
							ref="calendar"
							scrollEnabled={true}              // False disables swiping. Default: True
							showControls={false}               // False hides prev/next buttons. Default: False
							titleFormat={'MMMM YYYY'}         // Format for displaying current month. Default: 'MMMM YYYY'
							dayHeadings={customDayHeadings}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
							monthNames={customMonthNames}                // Defaults to english names of months
							prevButtonText={'<'}           // Text for previous button. Default: 'Prev'
							nextButtonText={'>'}           // Text for next button. Default: 'Next'
							onDateSelect={(date) => this.onDateSelect(date)} // Callback after date selection
							// onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
							// onTouchNext={this.onTouchNext}    // Callback for next touch event
							//onSwipePrev={this.onSwipeMonth.bind(this)}    // Callback for back swipe event
							//onSwipeNext={this.onSwipeMonth.bind(this)}    // Callback for forward swipe event
							// eventDates={['2015-07-01']}       // Optional array of moment() parseable dates that will show an event indicator
							// today={'2016-16-05'}              // Defaults to today
							//startDate={'2015-08-01'}          // The first month that will display. Default: current month
							//selectedDate={'2015-08-15'}       // Day to be selected
							customStyle={{
										calendarContainer: {backgroundColor: 'white'},
										day: {fontSize: 15, textAlign: 'center', fontFamily:'Abel'}, 
										title: {fontFamily:'Abel', color:'#006E8C', fontSize:20},
										controlButtonText: {fontFamily:'Abel', fontSize:20},
										dayHeading: {fontFamily:'Abel'},
										selectedDayCircle: {backgroundColor: '#2196F3'}
										}} // Customize any pre-defined styles
							weekStart={0} // Day on which week starts 0 - Sunday, 1 - Monday, 2 - Tuesday, etc, Default: 1
						/>
					</View>
					<View style={styles.eventListContainer}>
						<ListView style={styles.tableList}
						dataSource={this.state.dataSource}
						renderRow={this.renderRow.bind(this)}/>
					</View>
				</View>
			</View>
		);
	}

	onDateSelect(date) {
		this.setState({currentYear:moment(date).format('YYYY'), currentMonth:moment(date).format('MM')});
		this.state.currentYear = moment(date).format('YYYY');
		this.state.currentMonth = moment(date).format('MM');
		this.getHebrewEvents();
	}

	onMenuPress() {
		Actions.pop();
	}

	renderRow(rowData, sectionID, rowID) {
		return (
			<TouchableHighlight onPress={() => this.rowPressed(rowData.id)}
				underlayColor='#dddddd'>
				<View>
					<View style={styles.rowContainer}>
						<Text style={styles.content_date}>{rowData.date}</Text>
						<Text style={styles.content_text}>{rowData.title}</Text>
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
		marginRight: 24,
	},
	foodBrachotTitleText: {
		color: 'white',
		fontSize: 16,
		fontFamily: 'Abel',
		alignSelf: 'center',
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
	},
	prayerContentText: {
		fontSize: 16,
		fontFamily: 'Abel'
	},
	subTitleText: {
		fontSize: 20,
		fontFamily: 'Abel',
		fontWeight: 'bold',
		color: '#006E8C',
		marginTop: 10,
		marginLeft: 10
	},
	eventListContainer: {
		flex:1,
		marginBottom: 5
	},
	tableList: {
		marginLeft: 10,
		marginTop: 10,
		marginBottom: 10,
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
	content_date: {
		fontFamily: 'Abel',
		width: 100,
		marginTop: 10
	},
	content_text: {
		fontFamily: 'Abel',
		marginTop: 10
	},

});