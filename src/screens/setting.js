import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, AsyncStorage, ScrollView, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import NavigationBar from 'react-native-navbar';
import { FontAwesome } from '@expo/vector-icons';
import Button from 'apsl-react-native-button';
import Slider from 'react-native-slider';
import Swipeable from 'react-native-swipeable';
import {SimpleLineIcons} from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay';

const dismissKeyboard = require('dismissKeyboard')
class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            level: this.props.level,
            complexity: this.props.isComplex,
            hideEmailAction: true,
            email: this.props.userInfo.email
        }
    }

    saveSettings() {
        const _this = this
        this.props.setLevel(this.state.level)
        this.props.setComplexity(this.state.complexity)  

        if(this.state.email !== this.props.userInfo.email){
            let userData = this.props.userInfo
            userData['email'] = this.state.email
            this.props.updateEmail(userData)
        }

        let data = {
            level: this.state.level,
            complexity: this.state.complexity
        }
        this.props.saveStorage('setting', data, (res) => {
            this.props.navigation.goBack()
            this.props.navigation.state.params.onChanged({level: this.state.level, isComplex: this.state.complexity});
        })

        
    }

    onDeleteUser() {
        const _this = this
        Alert.alert(
            'Warnning',
            'Your trophy will be formatted. Are you sure you want to delete this account?',
            [
                {text: 'Yes', onPress: () => {
                    _this.setState({isDeleting: true})
                    _this.props.deleteAccount(_this.props.userInfo, (res) => {
                        _this.setState({isDeleting: false})
                        _this.props.formatKeyStorage('account')
                        _this.props.setUserInfo({userId: '', trophy: 0, username: '', email: ''})
                        _this.props.navigation.goBack()
                        _this.props.navigation.state.params.onDeleted({});
                    })                    
                }},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
        )
    }

    onEditEmail() {
        const _this = this
        this.swipable.recenter()
        setTimeout(function() {
            _this.scrollView.scrollToEnd({animated: true})
        }, 1000)        
        this.setState({hideEmailAction: false})
    }
    
    render() {
        var _this = this;
        const leftButtonConfig = {
            title: 'Back',
            tintColor: 'white',
            handler: function () {
                _this.props.navigation.goBack()
            },
        };
        const rightButtonConfig = {
            title: 'Save',
            tintColor: 'white',
            handler: function () {
                _this.saveSettings()
            },
        };
        const titleConfig = {
            title: 'Settings',
            tintColor: 'black',
            style: {
                fontSize: 30,
                fontFamily: 'gotham_bold'
            }
        };
        const nameActions = [
            <TouchableOpacity onPress={() => this.onDeleteUser()} style={styles.deleteUser}>
                <SimpleLineIcons name='trash' size={25} style={{ color: 'white'}} />
                <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>,
        ];
        const emailActions = [
            <TouchableOpacity onPress={() => this.onEditEmail()} style={styles.deleteUser}>
                <SimpleLineIcons name='pencil' size={25} style={{ color: 'white'}} />
                <Text style={styles.actionText}>Update</Text>
            </TouchableOpacity>,
        ];
        return (
            <View style={{flex: 1}}>
                <Spinner visible = {this.state.isDeleting} textContent="" textStyle={{color: '#111'}} />
                <NavigationBar
                    style = {styles.navBar}
                    title = {titleConfig}
                    rightButton = {rightButtonConfig}
                    leftButton = {leftButtonConfig}
                />
                <KeyboardAwareScrollView 
                    style={styles.container} 
                    ref={(ref) => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{
                        _this.setState({scrollHeight: contentHeight})
                    }}
                >
                    <View style={styles.levelView}>
                        <Text style={[styles.labelText, {textAlign: 'center'}]}>The length of the digit number: {this.state.level}</Text>
                        <Slider
                            style={styles.slider}
                            trackStyle={customStyles.track}
                            thumbStyle={customStyles.thumb}
                            minimumTrackTintColor='#ec4c46'
                            minimumValue={4}
                            maximumValue={6}
                            value={this.state.level}
                            step={1}
                            onValueChange={(value) => this.setState({level: value})}
                        />
                    </View>
                    <View style={styles.complexityView}>
                        <View><Text style={styles.labelText}>Complexity:</Text></View>
                        <View style={{justifyContent: 'center'}}>
                            <Switch
                                onValueChange={(value) => this.setState({complexity: value})}
                                value={this.state.complexity}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.midText, {width: 200, paddingBottom: 40, paddingLeft: 20}]}>
                        {
                            this.state.complexity?
                                'All of digits can be duplicated like 2566.'
                            :
                                'All of digits are different each other like 1234'
                        }
                        </Text>
                    </View>
                    {
                        this.props.userInfo.username == ''?
                        null:
                        <View>
                            <View>
                                <View style={styles.section}>
                                    <Text style={styles.bigText}>USERNAME</Text>
                                </View>
                                <Swipeable style={styles.section} rightButtons={nameActions} rightButtonWidth={150}>
                                    <Text style={styles.midText}>{this.props.userInfo.username}</Text>
                                </Swipeable>
                            </View>
                            <View>
                                <View style={[styles.section, styles.emailSection]}>
                                    <Text style={styles.bigText}>EMAIL</Text>
                                    <TouchableOpacity onPress={() => this.onEditEmail()}>
                                        <SimpleLineIcons name='pencil' size={25} style={{ color: 'black'}} />
                                    </TouchableOpacity>
                                </View>
                                <Swipeable style={styles.section} onRef={(ref) => this.swipable = ref} rightButtons={emailActions} rightButtonWidth={150}>
                                    <TextInput
                                        style = {[styles.midText, {color: this.state.hideEmailAction ? 'lightgray' : 'blue'}]}
                                        maxLength={40}
                                        placeholder='Input your email here'
                                        editable={!this.state.hideEmailAction}
                                        keyboardType='email-address'
                                        underlineColorAndroid='transparent'
                                        onChangeText = {(Text) => this.setState({email: Text})}
                                        value = {this.state.email}
                                    />
                                </Swipeable>
                                <View style={styles.section}>
                                    <Text style={styles.bigText}></Text>
                                </View>
                                <Collapsible collapsed={this.state.hideEmailAction}>
                                    <Text style={[styles.midText, styles.notifyText]}>The updated email will be saved once you clicked "Save" button on the top-right of this screen</Text>
                                </Collapsible>
                            </View>
                        </View>
                    }                    
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
var customStyles = StyleSheet.create({
  track: {
    height: 18,
    borderRadius: 1,
    backgroundColor: '#d5d8e8',
  },
  thumb: {
    width: 20,
    height: 30,
    borderRadius: 1,
    backgroundColor: '#838486',
  }
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
    },
    navBar: {
        backgroundColor: '#00b3b3',
        marginTop: -20,
        height: 80,
        paddingTop: 20,
    },
    slider: {
        width: 250
    },
    labelText: {
        fontSize: 30,
        color: 'black',
    },
    levelView: {
        alignItems: 'center',
        paddingTop: 20
    },
    complexityView: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingTop: 30,
        borderTopWidth: 1,
        borderColor: 'gray',
        paddingLeft: 20,
        paddingRight: 20,        
        marginTop: 20
    },
    section: {
        paddingLeft: 20,
        borderTopWidth: 1,
        borderColor: 'gray',
    },
    emailSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20
    },
    bigText: {
        paddingTop: 10,
        fontSize: 30,
        color: 'black',
    },
    midText: {
        fontSize: 24,
        color: 'lightgray',
        paddingTop: 30,
        paddingBottom: 20,
        fontFamily: 'gotham'
    },
    deleteUser: {
        backgroundColor: '#ec4c46',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        flex: 1,
        flexDirection: 'row'
    },
    actionText: {
        fontSize: 20,
        color: 'white',
        alignItems: 'center'
    },
    notifyText: {
        color: 'black', 
        paddingLeft: 20, 
        paddingTop: 10
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect((state) => { 
    return {
        level: state.level,
        isComplex: state.isComplex,
        type: state.gameType,
        userInfo: state.userInfo
    }
}, mapDispatchToProps)(Setting);