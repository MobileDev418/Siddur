import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableHighlight,
	ActivityIndicator,
	Image,
	ScrollView
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import ActionSheet from 'react-native-actionsheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Environment from '../../config/environment';
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

const buttons = ['Cancel', 'Individual Mode', 'Minyan Mode'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 3;

var storage = new Storage({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    sync : {
    }
})

var bookmarked = [];

export default class Prayer extends Component
 {
	constructor(props) {
		super(props);
		this.state = {
			bookmarked: false,
			englishContent: "Loading...",
			categoryTitle: props.categoryTitle,
		};
		if (props.prayers_id > 0) {
			//this.setState({categoryTitle: "Loading..."});
		}
	}

	componentDidMount() {
		storage.load({
		    key: 'bookmarked',
		    autoSync: true,
		    syncInBackground: true
		}).then(ret => {
		    bookmarked = ret;
		    console.log("load bookmark " + bookmarked[this.props.prayers_id]);
		    this.setState({bookmarked:bookmarked[this.props.prayers_id]});
		    
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

	_renderDotIndicator() {
		return (
			<PagerDotIndicator
				pageCount={3}
			/>
		);
	}
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableHighlight onPress={this.onMenuPress} style={[styles.menuButton, styles.leftMenuButton]} underlayColor='white'>
						<Icon name="keyboard-backspace" color="white" size={24} />
					</TouchableHighlight>
					<View style={styles.prayerTitle}>
						<Text style={styles.prayerTitleText}>
							{this.state.categoryTitle} {this.state.bookmarked}
						</Text>
					</View>
					<TouchableHighlight onPress={this.onBookmarkPress.bind(this)} style={[styles.menuButton, styles.centerMenuButton]} underlayColor='white'>
						{this.state.bookmarked ? 
							<Icon name="bookmark" color="white" size={24} /> :
							<Icon name="bookmark-border" color="white" size={24} />
						}
					</TouchableHighlight>
					<TouchableHighlight onPress={this.onModePress.bind(this)} style={[styles.menuButton, styles.rightMenuButton]} underlayColor='white'>
						<Icon name="person" color="white" size={24} />
					</TouchableHighlight>
				</View>
				<View style={styles.prayerContent}>
					<IndicatorViewPager
					style={{flex: 1}}
					indicator={this._renderDotIndicator()}
					>
						<View style={{backgroundColor:'lightgrey'}}>
							<ScrollView>
							<Text style={styles.prayerContentText}>
								{this.state.englishContent}
							</Text>
							</ScrollView>
						</View>
						<View style={{backgroundColor:'whitesmoke'}}>
							<ScrollView>
							<Text style={styles.prayerContentText}>
								{this.state.transliteratedContent}
							</Text>
							</ScrollView>
						</View>
						<View style={{backgroundColor:'grey'}}>
							<ScrollView>
							<Text style={styles.prayerContentHebrewText}>
								{this.state.hebrewContent}
							</Text>
							</ScrollView>
						</View>
					</IndicatorViewPager>
				</View>
				<ActionSheet 
					ref={(o) => this.ActionSheet = o}
					title="Prayer Mode"
					options={buttons}
					cancelButtonIndex={CANCEL_INDEX}
					destructiveButtonIndex={DESTRUCTIVE_INDEX}
					onPress={this.onUpdateModePress.bind(this)}
				/>
			</View>
		);
	}

	onMenuPress() {
		Actions.pop({refresh:{refreshed:true}});
	}

	onBookmarkPress() {
		this.setState({bookmarked: !this.state.bookmarked});
		bookmarked[this.props.prayers_id] = !this.state.bookmarked;
		this.saveBookmark();
	}

	onModePress() {
		this.ActionSheet.show();
	}

	onUpdateModePress(index) {
    }

    componentWillMount() {
    	console.log(this.props.category);
		this.getPrayerContent();
	}

    getPrayerContent() {
    	if (this.props.prayers_id > 0) {
	    	fetch(Environment.BASE_URL + "/get_prayers_content_by_id?prayers_id=" + this.props.prayers_id)
				.then(response => response.json())
				.then(json => this.gotPrayerContent(json))
				.catch(error =>
					this.setState({
						englishContent: 'Internet Connection Problem:' + error

			}));
		// } else {
	 //    	fetch(Environment.BASE_URL + "/get_first_prayers_content_by_category?category=" + this.props.category)
		// 		.then(response => response.json())
		// 		.then(json => this.gotPrayerContent(json))
		// 		.catch(error =>
		// 			this.setState({
		// 				englishContent: 'Internet Connection Problem:' + error

		// 	}));
		}
    }

    gotPrayerContent(response) {
		console.log(response);
		if (response.error == null) {
			var content_english = "", content_transliterated = "", content_hebrew = "";
			for (i = 0; i < response.length; i++) {
			    content_english += response[i].instructions + "\r\n\r\n";
			    content_transliterated += response[i].instructions + "\r\n\r\n";
			    content_hebrew += response[i].instructions + "\r\n\r\n";

			    content_english += response[i].english + "\r\n\r\n";
			    content_transliterated += response[i].transliterated + "\r\n\r\n";
			    content_hebrew += response[i].hebrew + "\r\n\r\n";
			}
			this.setState({englishContent:content_english});
			this.setState({transliteratedContent:content_transliterated});
			this.setState({hebrewContent:content_hebrew});
		}
    }

    saveBookmark() {
    	console.log("bookmarked " + bookmarked[this.props.prayers_id]);
		storage.save({
			    key: 'bookmarked',   // Note: Do not use underscore("_") in key!
			    rawData: bookmarked,
			    expires: null
			});
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	prayerTitle: {
		marginTop: 33,
		flex: 1,
		flexDirection: 'column',
	},
	prayerTitleText: {
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
		width: 24,
		height: 24,
	},
	prayerContent: {
		flex: 1,
		backgroundColor: 'white',
		marginTop: 5,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 5
	},
	prayerContentText: {
		fontSize: 16,
		fontFamily: 'Abel',
		marginTop: 5,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 5
	},
	prayerContentHebrewText: {
		fontSize: 16,
		fontFamily: 'Abel',
		writingDirection:"rtl",
		marginTop: 5,
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 5
	}
});

