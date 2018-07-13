import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, ListView, AsyncStorage } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import { NavigationActions } from 'react-navigation';
import Button from 'apsl-react-native-button';
import {SimpleLineIcons} from '@expo/vector-icons';
import NavigationBar from 'react-native-navbar';
import {Font} from 'expo'
import { setCustomText } from 'react-native-global-props';
import * as firebase from "firebase";
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, {DURATION} from 'react-native-easy-toast'

import Expo from 'expo';

const dismissKeyboard = require('dismissKeyboard')
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


class Main extends React.Component {
    static route={
        navigationBar: {
            title: 'Main page'
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            num: '',
            fontLoaded: false,
            isLoading: true
        }
    }

    componentDidMount() {
        const _this = this
        this.setGlobalFontStyle()        
        this.props.loadStorage('setting', (res) => {
            if(res == 'error'){
                _this.props.resetGoalNumber(4, false)  
            }
            else{
                console.log(res.userid);
                _this.props.setLevel(res.level)
                _this.props.setComplexity(res.complexity)       
                _this.props.resetGoalNumber(res.level, res.complexity)  
            }            
        })
        this.props.loadStorage('account', (res) => {
            if(res !== 'error' && res.userId.length > 0){                
                _this.signIn(res)
            } 
            else{
                this.setState({isLoading: false})
            }
        })
    }

    async signIn(res) {
        const email = res.username + '@litiyan.com'
        const pwd = 'passwordof' + res.username
        let user = await firebase.auth().signInWithEmailAndPassword(email, pwd);
        this.props.getUserData(user.uid, (data) => {
            data['userId'] = user.uid
            this.props.setUserInfo(data)
            this.props.saveStorage('account', data, (res) => {
            })
            this.setState({isLoading: false})
        })        
    }

    async setGlobalFontStyle() {
        await Font.loadAsync({
            'gotham': require('../res/fonts/gotham.ttf'),
            'gotham_bold': require('../res/fonts/gotham_bold.ttf'),
        });        
        const customTextProps = { 
            style: { 
                fontFamily: 'gotham'
            }
        }
        setCustomText(customTextProps);
        this.setState({fontLoaded: true})
    }

    onChanged(data) {
        this.props.resetGoalNumber(data.level, data.isComplex)    
        this.setState({num: ''}) 
    }

    onDeleted() {
        const {level, complexity} = this.props
        this.refs.toast.show('Your account has been deleted successfully', DURATION.LENGTH_LONG);
        this.props.resetGoalNumber(level, complexity)   
        this.setState({num: ''}) 
    }

    showTrophyList() {
        this.props.navigation.navigate('trophylist', {})
    }

    onChangeText(Text) {
        if(this.state.num.length > Text.length){
            this.setState({num: Text})
            return
        }
        let lastText = Text.substr(Text.length - 1, 1)
        if(this.props.complexity){
            this.setState({num: Text})
        }
        else if(this.state.num.indexOf(lastText) < 0){
            this.setState({num: Text})
        }
    }
    
    render() {
        const titleButtonConfig = (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.navText}>{this.props.userInfo.username == ''?'Welcome':this.props.userInfo.username}</Text>
            </View>
        )
        const rightButtonConfig = (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('setting', {onChanged: (data) => this.onChanged(data), onDeleted: () => this.onDeleted()})} style={styles.rightNav}>
                <SimpleLineIcons name='settings' size={25} style={{ color: 'white'}} />
            </TouchableOpacity>
        )
        const leftButtonConfig = (
            this.props.userInfo.username == ''?
            null:
            <TouchableOpacity onPress={() => this.showTrophyList()} style={styles.leftNav}>
                <SimpleLineIcons name='trophy' size={25} style={{ color: 'white'}} />
                <Text style={styles.trophyText}>{this.props.userInfo.trophy}</Text>
            </TouchableOpacity>
        )
        if(this.state.num.length == this.props.level) dismissKeyboard()
        console.log('LITIYAN_IN_PROGRESS', this.props.inProg)
        return (
            <View style={{flex: 1}}>
                {
                    (this.state.isLoading || !this.state.fontLoaded)?
                    <View style={styles.gifContainer}>
                        <Image source={require('../res/svgs/loading.gif')} style={{width: 50, height: 50, backgroundColor: 'transparent'}}/>
                    </View>
                    :
                    <View style={{flex: 1}}>
                        <NavigationBar
                            style = {styles.navBar}
                            title = {titleButtonConfig}
                            rightButton = {rightButtonConfig}
                            leftButton = {leftButtonConfig}
                        />
                        <View style = {styles.container}>
                                <TextInput
                                    style = {styles.textInput}
                                    maxLength={this.props.level}
                                    underlineColorAndroid='transparent'
                                    keyboardType = 'numeric'
                                    onChangeText = {(Text) => this.onChangeText(Text)}
                                    value = {this.state.num}
                                />
                                {
                                    this.props.inProg?
                                        <View style={styles.scrollView}>
                                            <ListView 
                                                enableEmptySections={true}
                                                dataSource = {ds.cloneWithRows(this.props.history)}
                                                renderRow = {(rowData, sectionID, rowID) => {
                                                    return(
                                                        <View key={rowID}>
                                                            <Text style={styles.historyItem}>{rowData.number} : {rowData.state}</Text>
                                                        </View>
                                                    )
                                                }
                                            }>
                                            </ListView>
                                        </View>
                                    :
                                    <Text style={styles.text}>
                                        {
                                        'Hi, I thought a random number of ' + this.props.level + ' digits. Now you must guess the number correclty by checking '
                                        + (this.props.level * 2 - 1) + " times at maximum. Let's get started!"
                                        }
                                    </Text>
                                }
                                {
                                    this.state.num.length == this.props.level?
                                    <View>
                                        <Button 
                                            style = {styles.button}
                                            textStyle = {{color: 'white'}}
                                            isDisabled = {this.state.isLoading}
                                            isLoading = {this.state.isLoading}
                                            activityIndicatorColor = 'yellow'
                                            onPress = {() => this.checkNumber(this.state.num)}>
                                            <Text style = {styles.buttonText}>Check</Text>
                                        </Button>
                                    </View>
                                    :
                                    null
                                }                        
                        </View>
                        <Toast
                            ref="toast"
                            style={{backgroundColor:'red'}}
                            position='bottom'
                            positionValue={150}
                            fadeInDuration={750}
                            fadeOutDuration={1000}
                            opacity={0.6}
                            textStyle={{color:'white', fontSize: 20, textAlign: 'center'}}
                        />
                    </View>
                }
            </View>
        );
    }

    onRefresh(data) {
        this.setState({num: ''})
    }

    onRestart(data) {
        this.props.resetGoalNumber(this.props.level, this.props.complexity)
        this.setState({num: ''})
        if(data.isSuccess){

        }
    }

    async checkNumber(num) {
        dismissKeyboard
        const ADD_ID = '1691059890960877'
        const options = {
            permissions: ['public_profile', 'email'],
        }
        const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync(ADD_ID, options)
        alert(token)
        // const { navigate } = this.props.navigation;
        // if(JSON.stringify(this.props.history).indexOf(num) >= 0){
        //     alert('This number was already checked by you!')
        //     return
        // }
        // this.props.check(num, this.props.goal, this.props.times, this.props.history)
        // navigate('check', { onRefresh: this.onRefresh.bind(this), onRestart: this.onRestart.bind(this), number: this.state.num})
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#4d79ff',
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center'
    },
    gifContainer: {
        flex: 1, 
        backgroundColor: '#4d79ff',
        justifyContent: 'center', 
        alignItems: 'center'
    },

    backgroundImage: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'stretch', 
        alignSelf: 'stretch'
    },

    navText: {
        fontSize: 28,
        color: 'white',
        alignItems: 'center',
    },

    text: {
        fontSize: 24,
        textAlign: 'center',
        color: 'white',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 40
    },
    textInput: {
        padding: 10,
        height: 80,
        width: 250,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 60,
        color: 'white'
    },
    buttonText: {
        color: 'purple',
        fontSize: 32
    },
    
    button: {
        backgroundColor: '#66ff33',
        borderWidth: 0,
        height: 70,
        width: 240,
        marginTop: 50,
        borderRadius: 70
    },
    scrollView: {
        height: 200,
        paddingTop: 30,
        width: 260,
        backgroundColor: 'transparent'
    },
    historyItem: {
        height: 40,
        textAlign: 'center',
        fontSize: 28,
        color: 'white',
    },
    navBar: {
        backgroundColor: '#4d79ff', 
        marginTop: -20, 
        height: 80
    },
    trophyText: {
        fontSize: 24,
        color: 'white',
        paddingBottom: 0,
        paddingLeft: 5
    },
    rightNav: {
        justifyContent: 'flex-end', 
        alignItems: 'flex-end', 
        paddingRight: 10, 
        flexDirection: 'row'
    },
    leftNav: {
        flexDirection: 'row', 
        alignItems: 'flex-end',
        paddingLeft: 10, 
        justifyContent: 'flex-start'
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect((state) => { 
    return {
        level: state.level,
        complexity: state.isComplex,
        inProg: state.inProg,
        goal: state.goal,
        times: state.times,
        history: state.history,
        userInfo: state.userInfo
    }
}, mapDispatchToProps)(Main);