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
	Switch
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchBar from 'react-native-search-bar';

export default class ZMSettings extends Component
 {
	constructor(props) {
		super(props);
		var dsbm = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		var dsam = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

		this.state = {
			hebrewDate: "",
			hebrewEvent: "",
			dataSourceLocationSettings: dsbm.cloneWithRows([
						{text: "Use Current Location", id:"use_location", value:true},
						{text: "Set a Location", id:"set_location", value:""}
						]),
			dataSourceTimesCalendar: dsam.cloneWithRows([
						{text: "Use 24 Hour Format", id:"birkat_hamazon", value:true},
						{text: "Candle Lighting Time (in minutes)", id:"meiein_shalosh", value:18},
						{text: "Havdala", id:"borei_nefashot", value:"Three Small Stars"},
						{text: "Dawn - Alot Hashachar (in minutes)", id:"borei_nefashot", value:72},
						{text: "Sunrise & Sunset", id:"borei_nefashot", value:"Level Region"},
						{text: "General Shita", id:"borei_nefashot", value:"Magen Avraham"},
						{text: "Nightfall (Tzet HaKochavim)", id:"borei_nefashot", value:""},
						{text: "Change Date With", id:"borei_nefashot", value:"10 min after Sunset"},
						]),
			useCurrentLocation: true,
			use24HourFormat: true,
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableHighlight onPress={this.onMenuPress} style={[styles.menuButton, styles.leftMenuButton]} underlayColor='white'>
						<Icon name="keyboard-backspace" color="white" size={24} />
					</TouchableHighlight>
					<View style={styles.foodBrachotTitle}>
						<Text style={styles.foodBrachotTitleText}>
							ZMANIM & MINYANIM SETTINGS
						</Text>
					</View>
				</View>
				<View style={styles.foodBrachotContent}>
					<View>
						<Text style={styles.subTitleText}>
							Location Settings
						</Text>
						<ListView style={styles.tableList}
						dataSource={this.state.dataSourceLocationSettings}
						renderRow={this.renderRow.bind(this)}/>
					</View>
					<View>
						<Text style={styles.subTitleText}>
							Times & Calendar Settings
						</Text>
						<ListView style={styles.tableList}
						dataSource={this.state.dataSourceTimesCalendar}
						renderRow={this.renderRow.bind(this)}/>
					</View>
				</View>
			</View>
		);
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
						<Text style={styles.content_text}>{rowData.text}</Text>
						{
							(rowData.value === true || rowData.value === false) 
							? <Switch style={{marginBottom:0}}value={true}/>
							: <Text style={styles.content_value}>{rowData.value}</Text>
						}
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
		);
	}

	rowPressed(content_id) {
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
		marginRight: 10
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
		marginTop: 10,
		marginBottom: 10
	},
	content_value: {
		fontFamily: 'Abel',
		marginTop: 10,
		marginBottom: 10,
		color: 'grey'
	},
});