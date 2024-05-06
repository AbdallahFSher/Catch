import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import * as React from 'react'

export default class RSSEntry extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={styles.mainContent}>
                    <View style={{flex: 1}}>
                        <Image style={styles.sourceImage} source={this.props.image}/>
                    </View>
                    <View style={{flex: 2, marginLeft: 10}}>
                        <Text style={styles.sourceTitle}>
                            {this.props.title}
                        </Text>
                        <Text style={styles.sourceTitle3}>
                            Items: {this.props.items.length}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    mainContent: {
        padding:0,
        marginVertical: 10,
        marginHorizontal: 0,
        height: 150,
        width: 350,
        backgroundColor: 'grey',
        opacity: '80%',
        borderWidth: 5,
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row'
    },
    sourceTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        width: '100%',
        padding: 10
    },
    sourceTitle2: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    sourceTitle3: {
        fontWeight: 'bold',
        fontSize: 15,
        width: '50%',
        paddingLeft: 10,
        paddingTop: 10,
    },
    sourceImage: {
        height: '85%',
        width: '90%',
        aspectRatio: 1,
        marginVertical: 10,
        marginLeft: 15,
        alignSelf: 'center',
        borderRadius: 10
    }
})