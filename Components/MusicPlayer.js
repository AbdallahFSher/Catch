import { ProgressBar, Appbar } from 'react-native-paper';
import { Text, Image, StyleSheet } from 'react-native'
import * as React from 'react'
import { useSafeAreaInsets} from "react-native-safe-area-context";
import { Audio } from "expo-av";
export default class MusicPlayer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isPlaying: false,
            position: 0
        }
    }
    handlePlayPause = () => {
        if(this.state.isPlaying){
            this.setState({isPlaying: false});
            this.props.sound.pauseAsync();
        } else {
            this.setState({isPlaying: true});
            this.props.sound.playAsync();
        }
    }
    updatePos = () => {
        this.props.sound.getStatusAsync().then((playbackObj) => this.setState({position: playbackObj.positionMillis}));
        let hoursStr = "0";
        let minStr = "0";
        let secStr = "0";
        let hours = Number((this.state.position/3600000).toFixed(0));
        let minutes = Number((this.state.position - (hours*3600000))/60000).toFixed(0);
        let seconds = Number((this.state.position - (hours*3600000) - (minutes*60000))/1000).toFixed(0);
        if(hours < 10){
            hoursStr = hoursStr + hours;
        } else {
            hoursStr = hours;
        }
        if(minutes < 10){
            minStr = minStr + minutes;
        } else {
            minStr = minutes;
        }
        if(seconds < 10){
            secStr = secStr + seconds;
        } else {
            secStr = seconds;
        }
        return hoursStr + ":" + minStr + ":" + secStr;
    }
    render() {
        return (
            <Appbar style={styles.container}>
                <Appbar.Action icon="play-pause" onPress={() => {this.handlePlayPause()}} />
                <Text style={styles.title}>{this.props.title}</Text>
                <Text>{this.props.sound ? this.updatePos() : '0:00'}</Text>
                <Appbar.Action icon="sleep" onPress={() => {}} />
            </Appbar>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        height: 80
    },
    title: {
        fontSize: 18,
        paddingHorizontal: 20,
        color: 'black'
    },
    bottom: {
        backgroundColor: 'aquamarine',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    fab: {
        position: 'absolute',
        right: 16,
    },
    progressBar: {
        position: "absolute",
        top: 90
    }
})