import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, ListView, TextInput, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import NavigationBar from 'react-native-navbar';
import { FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import Button from 'apsl-react-native-button';
import * as firebase from "firebase";
import * as Global from '../libs/constants'
import { KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const dismissKeyboard = require('dismissKeyboard')
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class Check extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            register: false,
            username: '',
        }
    }

    componentDidMount() {
        dismissKeyboard()
        if(!this.props.success && this.getLeftTimes() == 0){
            this.onFail()
        }
    }

    async onRegister(left) {
        const _this = this
        const {username} = this.state
        try {
            this.setState({isRegistering: true})
            const email = username + '@litiyan.com'
            const pwd = 'passwordof' + username
            let user = await firebase.auth()
                .createUserWithEmailAndPassword(email, pwd);    

            let userData = {
                userId: user.uid, 
                username: username, 
                trophy: _this.getPTrophy(left),
                email: this.props.userInfo.email
            }
            this.props.updateUserTrophy(userData, (res) => {
                
                _this.props.saveStorage('account', userData, (res) => {
                    //_this.setState({isRegistering: false})
                })

                _this.props.setUserInfo(userData)
                _this.props.navigation.goBack()
                _this.props.navigation.state.params.onRestart({isSuccess: true});
            })
        } catch (error) {
            _this.setState({isRegistering: false}) 
            alert(JSON.stringify(error))
        }
    }

    onReceiveTrophy(left) {
        const _this = this
        let {userInfo} = this.props
        this.setState({isReceiving: true})
        const n_trophy = userInfo.trophy + this.getPTrophy(left)       
        userInfo['trophy'] = n_trophy
        alert(n_trophy)

        this.props.updateUserTrophy(userInfo, (res) => {            
            _this.props.saveStorage('account', userInfo, (res) => {
            })
            _this.props.setUserInfo(userInfo)
            _this.props.navigation.goBack()
            _this.props.navigation.state.params.onRestart({isSuccess: true});
        })
    }

    getPTrophy(left) {
        return this.props.level * 3 + left * 2
    }

    getMTrophy() {        
        return 0 - this.props.level * 4
    }

    onFail() {
        const _this = this
        const {userInfo} = this.props
        const n_trophy = userInfo.trophy + this.getMTrophy()
        userInfo['trophy'] = n_trophy

        this.props.updateUserTrophy(userInfo, (res) => {            
            _this.props.saveStorage('account', userInfo, (res) => {
                //
            })
            _this.props.setUserInfo(userInfo)
        })
    }

    getLeftTimes() {
        return this.props.level * 2 - 1 - this.props.times
    }


    render() {
        var _this = this;
        let left = this.getLeftTimes()
        const { navigate } = this.props.navigation;
        const titleButtonConfig = (
            <View style={{alignItems: 'center', flexDirection: 'row', height: 120, paddingTop: 30}}>
                <Text style={[styles.back, {color: left < this.props.level?'#ff3333':'#3333ff'}]}>{left} times left</Text>
            </View>
        )
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    style = {styles.navBar}
                    title = {this.props.success || left == 0?null:titleButtonConfig}
                />                
                <View style={styles.container}>
                    <KeyboardAwareScrollView>
                    {
                        this.props.success?
                            <View style={styles.infoView}>
                                <Text style={styles.numberText}>{this.props.navigation.state.params.number}</Text>
                                <Text style={styles.welcomeText}>Congratulations!</Text>
                                <Text style={styles.welcomeText}>You've guessed it</Text>
                                <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 10}}>
                                    <SimpleLineIcons name='trophy' size={32} style={{ color: 'white'}} />
                                    <Text style={styles.welcomeText}>{this.getPTrophy(left)}</Text>
                                </View>
                            </View>
                        :left == 0?
                            <View style={styles.infoView}>
                                <View style={styles.infoView}>
                                    <Text style={[styles.welcomeText, {color: '#666666'}]}>You are failed!</Text>
                                    <Text style={[styles.welcomeText, {fontSize: 28}]}>The goal number was</Text>
                                    <Text style={styles.welcomeText}>{this.props.goal}</Text>
                                    <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 10}}>
                                        <SimpleLineIcons name='trophy' size={32} style={{ color: 'white'}} />
                                        <Text style={styles.welcomeText}>{this.getMTrophy()}</Text>
                                    </View>
                                </View>
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
                            </View>
                        :
                            <View style={styles.infoView}>
                                <Text style={styles.numberText}>{this.props.navigation.state.params.number}</Text>
                                <Text style={styles.welcomeText}>{Global.notifyText[this.props.yNumber]}</Text>
                                <Text style={styles.welcomeText}>Y {this.props.yNumber}, N {this.props.nNumber}</Text>
                                <View>
                                    <Text style={styles.text}>'Y' means the number of the correct digits you guessed for both of the position and digit. </Text>
                                    <Text style={styles.text}>'N' means the number of the correct digits you guessed for the position only. </Text>
                                </View>
                            </View>

                    }
                    <View style={{alignItems: 'center'}}>
                        {
                            this.state.register?
                                <TextInput
                                    style = {styles.textInput}
                                    maxLength={20}
                                    placeholder='Username'
                                    underlineColorAndroid='transparent'
                                    onChangeText = {(Text) => this.setState({username: Text})}
                                    value = {this.state.username}
                                />
                            :
                            null
                        }
                        {
                            this.props.success && this.props.userInfo.username.length != 0?
                            <View>
                            <Button 
                                style = {styles.receiveButton}
                                textStyle = {{color: 'red'}}
                                isDisabled = {this.state.isReceiving}
                                isLoading = {this.state.isReceiving}
                                activityIndicatorColor = 'red'
                                onPress = {() => {
                                    this.onReceiveTrophy(left)
                                }}>
                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style = {[styles.buttonText, {color: 'red', fontFamily: 'gotham_bold'}]}>RECEIVE</Text>
                                </View>
                            </Button>
                            </View>
                            :this.props.success?
                            <View>
                                <Button 
                                    style = {styles.registerButton}
                                    textStyle = {{color: 'blue'}}
                                    isDisabled = {this.state.isRegistering}
                                    isLoading = {this.state.isRegistering}
                                    activityIndicatorColor = 'blue'
                                    onPress = {() => {
                                        if(this.state.username == '') this.setState({register: true})
                                        else this.onRegister(left)
                                    }}>
                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                        <Text style = {styles.buttonText}>Register</Text>
                                    </View>
                                </Button>
                                <Button 
                                    style = {styles.unregisterButton}
                                    textStyle = {{color: 'blue'}}
                                    isDisabled = {this.state.isLoading}
                                    isLoading = {this.state.isLoading}
                                    activityIndicatorColor = 'blue'
                                    onPress = {() => {
                                        this.props.navigation.goBack()
                                        this.props.navigation.state.params.onRestart({isSuccess: true});
                                    }}>
                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                        <Text style = {styles.buttonText}>Don't Register</Text>
                                    </View>
                                </Button>
                            </View>
                            :left == 0?
                            <View>
                                <Button 
                                    style = {styles.tryButton}
                                    textStyle = {{color: 'blue'}}
                                    isDisabled = {this.state.isLoading}
                                    isLoading = {this.state.isLoading}
                                    activityIndicatorColor = 'blue'
                                    onPress = {() => {
                                        this.props.navigation.goBack()
                                        this.props.navigation.state.params.onRestart({isSuccess: false});
                                    }}>
                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                        <FontAwesome name='chevron-left' size={32} style={{ color: 'blue'}} />
                                        <Text style = {[styles.buttonText, {color: 'blue'}]}>Try again</Text>
                                    </View>
                                </Button>
                            </View>
                            :
                            <View>
                                <Button 
                                    style = {styles.button}
                                    textStyle = {{color: 'white'}}
                                    isDisabled = {this.state.isLoading}
                                    isLoading = {this.state.isLoading}
                                    activityIndicatorColor = 'yellow'
                                    onPress = {() => {
                                        this.props.navigation.goBack()
                                        this.props.navigation.state.params.onRefresh({num: ''});
                                    }}>
                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                        <FontAwesome name='chevron-left' size={32} style={{ color: 'white'}} />
                                        <Text style = {styles.buttonText}>Back</Text>
                                    </View>
                                </Button>
                            </View>
                        }
                        
                    </View>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00b3b3',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    navBar: {
        backgroundColor: '#00b3b3', 
        marginTop: -20, 
        height:100
    },
    welcomeText: {
        fontSize: 36,
        fontFamily: 'gotham_bold',
        color: 'white',
        textAlign: 'center'
    },
    infoView: {
        alignItems: 'center',
    },
    numberText: {
        color: 'white',
        width: 250,
        fontSize: 60,
        fontFamily: null,
        textAlign: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 20
    },
    failText: {
        color: 'white',
        width: 200,
        fontSize: 60,
        textAlign: 'center',
        fontFamily: 'gotham_bold',
        marginBottom: 20
    },
    back: {
        fontSize: 24,
        color: 'white',
        padding: 10
    },
    text: {
        fontSize: 24,
        color: 'white',
        paddingTop: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 32,
        marginLeft: 20,
        alignItems: 'center'
    },
    
    button: {
        backgroundColor: '#666666',
        borderWidth: 0,
        height: 70,
        width: 240,
        marginTop: 20,
        borderRadius: 70
    },
    registerButton: {
        backgroundColor: '#6666FFCC',
        borderWidth: 0,
        height: 70,
        width: 280,
        marginTop: 20,
        borderRadius: 70
    },
    unregisterButton: {
        backgroundColor: '#ff3333CC',
        borderWidth: 0,
        height: 70,
        width: 280,
        marginTop: 20,
        borderRadius: 70
    },
    tryButton: {
        backgroundColor: '#2db300',
        borderWidth: 0,
        height: 70,
        width: 240,
        marginTop: 20,
        borderRadius: 70
    },
    receiveButton: {
        backgroundColor: '#66ff33',
        borderWidth: 0,
        height: 70,
        width: 240,
        marginTop: 20,
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
    textInput: {
        padding: 10,
        height: 80,
        width: 250,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        marginTop: 20
    },
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect((state) => { 
    return {
        success: state.success,
        yNumber: state.yNumber,
        nNumber: state.nNumber,
        goal: state.goal,
        times: state.times,
        level: state.level,
        history: state.history,
        userInfo: state.userInfo
    }
}, mapDispatchToProps)(Check);