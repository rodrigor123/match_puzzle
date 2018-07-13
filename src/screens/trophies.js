import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, AsyncStorage, ListView, Dimensions, Image } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import NavigationBar from 'react-native-navbar';
import { FontAwesome } from '@expo/vector-icons';
import Button from 'apsl-react-native-button';
import Slider from 'react-native-slider';
import Spinner from 'react-native-loading-spinner-overlay';
import {SimpleLineIcons} from '@expo/vector-icons';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

const {height, width} = Dimensions.get('window');
const paraBackground = require('../res/images/background.jpg')
const dismissKeyboard = require('dismissKeyboard')
const PARALLAX_HIEHGT = 300
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class TrophyList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isPlayerLoading: true,
            selectedIndex: -1,
            selectedUser: {}
        }
    }

    componentDidMount() {
        const _this = this
        this.mount = true
        this.props.getTopPlayers((size) => {
            _this.mount && _this.setState({isPlayerLoading: false})
        })
    }

    componentWillUnmount() {
        this.mount = false
    }

    sendInvite() {
        alert('Comming soon!')
    }

    sortPlayers(players) {
        return JSON.stringify(players).sort(function(a, b) {
            return (a[trophy] > b[trophy]) ? 1 : ((a[trophy] < b[trophy]) ? -1 : 0);
        });
    }
    
    render() {
        var _this = this;
        const leftButtonConfig = {
            title: 'Close',
            tintColor: 'black',
            handler: function () {
                _this.props.navigation.goBack()
            },
        };
        const rightButtonConfig = {
            title: 'Invite',
            tintColor: 'black',
            handler: function () {
                _this.sendInvite()
            },
        };
        const titleConfig = {
            title: 'Top Players',
            tintColor: 'black',
            style: {
                fontSize: 30,
                fontFamily: 'gotham_bold'
            }
        };
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <Spinner visible = {this.state.isPlayerLoading} textContent="" textStyle={{color: '#111'}} />
                <View style={styles.container}>
                    <ListView 
                        enableEmptySections={true}
                        dataSource = {ds.cloneWithRows(this.props.top_players)}
                        renderRow = {(rowData, sectionID, rowID, highlightRow) => {
                            return(
                                <TouchableOpacity onPress={() => this.setState({selectedIndex: rowID, selectedUser: rowData})} key={rowID} style={[styles.listItem, {backgroundColor: this.state.selectedIndex == rowID ? '#4d79ff' : 'transparent'}]}>
                                    <View>
                                        <View style={styles.listItemLeft}>
                                            <SimpleLineIcons name='trophy' size={25} style={{ color: 'white'}} />
                                            <Text style={styles.trophy}>{rowData.trophy}</Text>
                                            <Text style={[styles.name, {color: this.props.userInfo.username == rowData.username?'yellow':'white'}]}>{rowData.username}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        {
                                            rowData.email !== undefined?
                                            <SimpleLineIcons name='envelope' size={25} style={{ color: 'white'}} />
                                            :null
                                        }
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        renderScrollComponent={props => (
                            <ParallaxScrollView
                                contentBackgroundColor='#333333'
                                parallaxHeaderHeight={PARALLAX_HIEHGT}
                                stickyHeaderHeight={ 80 }
                                backgroundSpeed={10}
                                renderBackground={() => (
                                    <View key="background" style={styles.paraBackgroundImageView}>          
                                        <Image source={require('../res/svgs/triangle.gif')} style={{width: 50, height: 50, backgroundColor: 'transparent'}}/>
                                        <Image source={paraBackground} style={[styles.paraBackgroundImage, {position: 'absolute'}]} />
                                    </View>
                                )}
                                renderFixedHeader={() => (
                                    <NavigationBar
                                        containerStyle={{backgroundColor: 'rgba(255, 255, 255, 0.85)'}}
                                        style = {styles.navBar}
                                        title = {titleConfig}
                                        leftButton = {leftButtonConfig}
                                        rightButton = {this.state.selectedUser.email == undefined ? null : rightButtonConfig}
                                    />
                                )}
                            />
                                
                        )}
                    >
                    </ListView>
                                        
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    navBar: {
        backgroundColor: 'transparent', 
        marginTop: -20,
        height: 80,
        width: width,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderColor: 'white'
    },
    name: {
        height: 40,
        fontSize: 28,
        fontFamily: 'gotham_bold',
        width: 180,
    },
    trophy: {
        height: 40,
        fontSize: 28,
        color: 'white',
        paddingLeft: 10,
        width: 80
    },
    listItem: {
        height: 70,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 30,
        paddingLeft: 20,
        paddingBottom: 5,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderColor: 'white',
        backgroundColor: '#333333'
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    paraBackgroundImageView: {
        height: PARALLAX_HIEHGT, 
        width: width, 
        backgroundColor: 'gray',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paraBackgroundImage: {
        height: PARALLAX_HIEHGT, 
        width: width, 
        position: 'absolute',
    },

    paraForegroundTitle:{
        fontSize: 30, 
        fontFamily: 'gotham_bold', 
    },
    fixedHeader: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)', 
        width: width, 
        height: 80,
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect((state) => { 
    return {
        top_players: state.top_players,
        userInfo: state.userInfo
    }
}, mapDispatchToProps)(TrophyList);