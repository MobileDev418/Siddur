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
import Environment from '../../config/environment';
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

var storage = new Storage({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: false,
    sync : {
    }
})

var bookmarked = [];

export default class SelectedPrayers extends Component
 {
	constructor(props) {
		super(props);
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

		this.state = {
			hebrewDate: "",
			hebrewEvent: "",
			dataSource: ds.cloneWithRows([
						{name: "Loading...", prayers_id:"loading"},
						]),
			categoryTitle: props.categoryTitle,
			originalArray: [],
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
							{this.state.categoryTitle}
						</Text>
					</View>
				</View>
				<View style={styles.foodBrachotContent}>
					<View>
						<SearchBar ref='searchBar' placeholder='Search' onChangeText={(text) => this.searchPrayers(text)}/>
					</View>
					<View>
						<ListView style={styles.tableList}
						dataSource={this.state.dataSource}
						renderRow={this.renderRow.bind(this)}/>
					</View>
				</View>
			</View>
		);
	}

	searchPrayers(text) {
		var filteredArray = this.state.originalArray;
		text = text.trim();
		if (text != "") {
			filteredArray = filteredArray.filter(function(el) {
				return el.name.indexOf(text) != -1;
			});
		}
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		this.setState({dataSource:ds.cloneWithRows(filteredArray)});
	}

	onMenuPress() {
		Actions.pop();
	}

	renderRow(rowData, sectionID, rowID) {
		return (
			<TouchableHighlight onPress={() => this.rowPressed(rowData.prayers_id)}
				underlayColor='#dddddd'>
				<View>
					<View style={styles.rowContainer}>
						<Text style={styles.content_text}>{rowData.name}</Text>
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
		);
	}

	rowPressed(content_id) {
		if (content_id == "loading")
			return;
		Actions.prayer({'prayers_id':content_id});
	}

	componentWillMount() {
    	console.log(this.props.category);
    	if (this.props.category != 'bookmark')
			this.getSubPrayers();
		else
			this.getBookmarkedPrayers();
	}

	componentWillReceiveProps() {
    	console.log(this.props.category);
    	if (this.props.category != 'bookmark')
			this.getSubPrayers();
		else
			this.getBookmarkedPrayers();
	}
	
	getSubPrayers() {
    	fetch(Environment.BASE_URL + "/get_sub_prayers_by_category?category=" + this.props.category)
			.then(response => response.json())
			.then(json => this.gotSubPrayers(json))
			.catch(error =>
				this.setState({
					categoryTitle: 'Internet Connection Problem:' + error
		}));
    }

    getBookmarkedPrayers() {
		storage.load({
		    key: 'bookmarked',
		    autoSync: false,
		    syncInBackground: false
		}).then(ret => {
		    var prayers_id_array = "";
		    for (var key in ret) {
		    	if (ret[key] == true) {
		    		prayers_id_array += key + ",";
		    	}
		    }
			console.log("loaded " + prayers_id_array);
		    fetch(Environment.BASE_URL + "/get_prayers_by_id_array?prayers_id_array=" + prayers_id_array)
				.then(response => response.json())
				.then(json => this.gotSubPrayers(json))
				.catch(error =>
					this.setState({
						categoryTitle: 'Internet Connection Problem:' + error
			}));
		    
		}).catch(err => {
		    switch (err.name) {
		        case 'NotFoundError':
					storage.save({
					    key: 'bookmarked',   // Note: Do not use underscore("_") in key!
					    rawData: bookmarked,
					    expires: null
					});
				    //this.refreshSettings();
		            break;
		        case 'ExpiredError':
		            console.log('ExpiredError');
		            break;
		    }
		});
    }

    gotSubPrayers(response) {
		console.log(response);
		if (response.error == null) {
			var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
			this.setState({dataSource:ds.cloneWithRows(response)});
			this.setState({originalArray:response});
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
	content_text: {
		flex: 1,
		fontFamily: 'Abel',
		marginTop: 10
	},

});