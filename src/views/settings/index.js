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
	Switch,
	ScrollView
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchBar from 'react-native-search-bar';
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ModalPicker from 'react-native-modal-picker';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    sync : {
    }
})

var settings = {
	language: 'Loading...',
	silentMode: true,
	nusach: '',
	defaultMode: 'Loading...',
	pasuk: 'Loading...',
	prayerForTheSick: 'Loading...',
	purimDate: 'Loading...',
	font: 'Abel',
	theme: 'Loading...',
	sunset: true,
	timeOffset: 'Loading...'
};

let index = 0;
const fontList = [
    { key: index++, label: 'Abel' },
    { key: index++, label: 'Arial' },
    { key: index++, label: 'ArialHebrew' },
    { key: index++, label: 'Courier' },
    { key: index++, label: 'Georgia' },
    { key: index++, label: 'Helvetica' },
    { key: index++, label: 'Helvetica Neue' },
    { key: index++, label: 'Times New Roman' },
    { key: index++, label: 'Verdana' },
];


const langButtons = ['Cancel', 'English', 'Hebrew'];
const modeButtons = ['Cancel', 'Individual Mode', 'Minyan Mode'];
const purimButtons = ['Cancel', 'Both', '14 Adar', 'Shushan Purim'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 4;

export default class Settings extends Component
{
	constructor(props) {
		super(props);

		var dsgp = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		var dssp = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		var dsas = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

		this.state = {
			hebrewDate: "",
			hebrewEvent: "",
			dataSourceGeneralPreferences: dsgp.cloneWithRows([
						{text: "Language", id:"language", value:settings.language},
						{text: "Silent Mode", id:"silentMode", value:settings.silentMode},
						]),
			dataSourceSiddurPreferences: dssp.cloneWithRows([
						{text: "Choose Nusach", id:"nusach", value:settings.nusach},
						{text: "Choose Default Mode", id:"defaultMode", value:settings.defaultMode},
						{text: "Enter Your Pasuk", id:"pasuk", value:settings.pasuk},
						{text: "Prayer for the Sick", id:"prayerForTheSick", value:settings.prayerForTheSick},
						{text: "Purim Date", id:"purimDate", value:settings.purimDate},
						]),
			dataSourceAppearanceSettings: dsas.cloneWithRows([
						{text: "Choose Font", id:"font", value:settings.font},
						{text: "Choose Theme", id:"theme", value:settings.theme},
						{text: "Sunset", id:"sunset", value:settings.sunset},
						{text: "Fixed time and Offset", id:"timeOffset", value:settings.timeOffset},
						]),
			useCurrentLocation: true,
			use24HourFormat: true,
		};
	}

	saveSettings() {
		storage.save({
			    key: 'Settings',   // Note: Do not use underscore("_") in key!
			    rawData: settings,
			    expires: null
			});
	}

	refreshSettings() {
		var dsgp = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		var dssp = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		var dsas = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

		this.setState({
			dataSourceGeneralPreferences: dsgp.cloneWithRows([
						{text: "Language", id:"language", value:settings.language},
						{text: "Silent Mode", id:"silentMode", value:settings.silentMode},
						]),
			dataSourceSiddurPreferences: dssp.cloneWithRows([
						{text: "Choose Nusach", id:"nusach", value:settings.nusach},
						{text: "Choose Default Mode", id:"defaultMode", value:settings.defaultMode},
						{text: "Enter Your Pasuk", id:"pasuk", value:settings.pasuk},
						{text: "Prayer for the Sick", id:"prayerForTheSick", value:settings.prayerForTheSick},
						{text: "Purim Date", id:"purimDate", value:settings.purimDate},
						]),
			dataSourceAppearanceSettings: dsas.cloneWithRows([
						{text: "Choose Font", id:"font", value:settings.font},
						{text: "Choose Theme", id:"theme", value:settings.theme},
						{text: "Sunset", id:"sunset", value:settings.sunset},
						{text: "Fixed time and Offset", id:"timeOffset", value:settings.timeOffset},
						]),
			useCurrentLocation: true,
			use24HourFormat: true,
		});
	}

	componentDidMount() {
		storage.load({
		    key: 'Settings',
		    autoSync: true,
		    syncInBackground: true
		}).then(ret => {
		    settings = ret;
		    this.refreshSettings();
		}).catch(err => {
		    switch (err.name) {
		        case 'NotFoundError':
					storage.save({
					    key: 'Settings',   // Note: Do not use underscore("_") in key!
					    rawData: settings,
					    expires: null
					});
				    this.refreshSettings();
		            break;
		        case 'ExpiredError':
		            console.log('ExpiredError');
		            break;
		    }
		});
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
							SETTINGS
						</Text>
					</View>
				</View>
				<View style={styles.foodBrachotContent}>
					<ScrollView>
					<View>
						<Text style={styles.subTitleText}>
							General Preferences
						</Text>
						<ListView style={styles.tableList}
						dataSource={this.state.dataSourceGeneralPreferences}
						renderRow={this.renderRow.bind(this)}/>
					</View>
					<View>
						<Text style={styles.subTitleText}>
							Siddur Preferences
						</Text>
						<ListView style={styles.tableList}
						dataSource={this.state.dataSourceSiddurPreferences}
						renderRow={this.renderRow.bind(this)}/>
					</View>
					<View>
						<Text style={styles.subTitleText}>
							Appearance Settings
						</Text>
						<ListView style={styles.tableList}
						dataSource={this.state.dataSourceAppearanceSettings}
						renderRow={this.renderRow.bind(this)}/>
					</View>
					</ScrollView>
				</View>
				<ActionSheet 
					ref={(o) => this.languageActionSheet = o}
					title="Language"
					options={langButtons}
					cancelButtonIndex={CANCEL_INDEX}
					destructiveButtonIndex={DESTRUCTIVE_INDEX}
					onPress={this.onLanguagePress.bind(this)}
				/>
				<ActionSheet
					ref={(o) => this.modeActionSheet = o}
					title="Default Mode"
					options={modeButtons}
					cancelButtonIndex={CANCEL_INDEX}
					destructiveButtonIndex={DESTRUCTIVE_INDEX}
					onPress={this.onModePress.bind(this)}
				/>
				<ActionSheet
					ref={(o) => this.purimActionSheet = o}
					title="Purim Date"
					options={purimButtons}
					cancelButtonIndex={CANCEL_INDEX}
					destructiveButtonIndex={DESTRUCTIVE_INDEX}
					onPress={this.onPurimPress.bind(this)}
				/>
			</View>
		);
	}

	onMenuPress() {
		Actions.pop();
	}

	onLanguagePress(language) {
		if (language != 1 && language != 2)
			return;
		settings.language = (language == 1 ? 'English' : 'Hebrew' );
		this.saveSettings();
		this.refreshSettings();
	}

	onModePress(defaultMode) {
		if (defaultMode != 1 && defaultMode != 2)
			return;
		settings.defaultMode = (defaultMode == 1 ? 'Individual Mode' : 'Minyan Mode' );;
		this.saveSettings();
		this.refreshSettings();
	}

	onPurimPress(purimDate) {
		switch (purimDate) {
			case 1:
				settings.purimDate = 'Both';
				break;
			case 2:
				settings.purimDate = '14 Adar';
				break;
			case 3:
				settings.purimDate = 'Shushan Purim';
				break;
			default:
				return;
		}
		this.saveSettings();
		this.refreshSettings();
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
							? <Switch style={{marginBottom:0}} value={(rowData.id == 'silentMode') ? settings.silentMode : settings.sunset} onValueChange={(value) => this.switchChanged(value, rowData.id)}/>
							: (rowData.id == 'font') ? 
								<ModalPicker
				                    data={fontList}
				                    initValue={settings.font}
				                    onChange={(option)=>this.fontChanged(option)} />
				                : (rowData.id == 'prayerForTheSick') ?
				                	<TextInput
										style={styles.textinput}
										onChangeText={(text) => this.prayerChanged(text)}
										value={rowData.value}
										/>
									: (rowData.id == 'pasuk') ?
					                	<TextInput
											style={styles.textinput}
											onChangeText={(text) => this.pasukChanged(text)}
											value={rowData.value}
											/>
										: <Text style={styles.content_value}>{rowData.value}</Text>
						}
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
		);
	}

	rowPressed(content_id) {
		switch (content_id) {
			case 'language':
				this.languageActionSheet.show();
				break;
			case 'defaultMode':
				this.modeActionSheet.show();
				break;
			case 'purimDate':
				this.purimActionSheet.show();
				break;
		}
	}

	switchChanged(value, swtich_id) {
		if (swtich_id == 'silentMode') {
			settings.silentMode = value;
		} else {
			settings.sunset = value;
		}
		this.saveSettings();
		this.refreshSettings();
	}

	fontChanged(font) {
		settings.font = font.label;
		this.saveSettings();
	}

	prayerChanged(name) {
		settings.prayerForTheSick = name;
		this.saveSettings();
		this.refreshSettings();
	}

	pasukChanged(name) {
		settings.pasuk = name;
		this.saveSettings();
		this.refreshSettings();
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
	textinput: {
		fontFamily: 'Abel',
		color: 'grey',
		marginTop: 10,
		marginBottom: 10,
		textAlign: 'right',
		width: 150,
		borderWidth: 0,
		fontSize: 14,
	}
});