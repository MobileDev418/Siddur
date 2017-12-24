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

export default class FoodBrachot extends Component
 {
	constructor(props) {
		super(props);
		var dsbm = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		var dsam = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

		this.state = {
			hebrewDate: "",
			hebrewEvent: "",
			dataSourceBeforeMeal: dsbm.cloneWithRows([
						{icon: 'pan-tool', text: "Washing the Hands", id:"washing_hands"},
						{icon: 'cloud', text: "Blessing on Bread", id:"blessing_bread"},
						{icon: 'grain', text: "Blessing on Grain Foods", id:"blessing_grain"},
						{icon: 'local-drink', text: "Blessing on Wine", id:"blessing_win"},
						{icon: 'nature', text: "Blessing on Fruit of the Tree", id:"blessing_tree"},
						{icon: 'language', text: "Blessing on Fruit of the Ground", id:"blessing_ground"},
						{icon: 'opacity', text: "Blessing on General Foods & Drinks", id:"blessing_general"}]),
			dataSourceAfterMeal: dsam.cloneWithRows([
						{icon: 'restaurant', text: "Birkat Hamazon", id:"birkat_hamazon"},
						{icon: 'fiber-smart-record', text: "Mei-ein Shalosh", id:"meiein_shalosh"},
						{icon: 'cloud-off', text: "Borei Nefashot", id:"borei_nefashot"}])
		};
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
							FOOD BRACHOT
						</Text>
					</View>
				</View>
				<View style={styles.foodBrachotContent}>
					<View>
						<SearchBar placeholder='Search for Brachot on Food'/>
					</View>
					<View>
						<Text style={styles.subTitleText}>
							Blessings Before a Meal
						</Text>
						<ListView style={styles.tableList}
						dataSource={this.state.dataSourceBeforeMeal}
						renderRow={this.renderRow.bind(this)}/>
					</View>
					<View>
						<Text style={styles.subTitleText}>
							Blessings After a Meal
						</Text>
						<ListView style={styles.tableList}
						dataSource={this.state.dataSourceAfterMeal}
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
			case 'washing_hands':
				Actions.selected_prayers({'category':'18', 'categoryTitle':'Washing the Hands'});
				break;
			case 'blessing_bread':
				Actions.selected_prayers({'category':'19', 'categoryTitle':'Blessing on Bread'});
				break;
			case 'blessing_grain':
				Actions.selected_prayers({'category':'20', 'categoryTitle':'Blessing on Grain Foods'});
				break;
			case 'blessing_win':
				Actions.selected_prayers({'category':'21', 'categoryTitle':'Blessing on Wine'});
				break;
			case 'blessing_tree':
				Actions.selected_prayers({'category':'22', 'categoryTitle':'Blessing on Fruit of the Tree'});
				break;
			case 'blessing_ground':
				Actions.selected_prayers({'category':'23', 'categoryTitle':'Blessing on Fruit of the Ground'});
				break;
			case 'blessing_general':
				Actions.selected_prayers({'category':'24', 'categoryTitle':'Blessing on General Foods & Drinks'});
				break;
			case 'birkat_hamazon':
				Actions.selected_prayers({'category':'25', 'categoryTitle':'Birkat Hamazon'});
				break;
			case 'meiein_shalosh':
				Actions.selected_prayers({'category':'26', 'categoryTitle':'Mei-ein Shalosh'});
				break;
			case 'borei_nefashot':
				Actions.selected_prayers({'category':'27', 'categoryTitle':'Borei Nefashot'});
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