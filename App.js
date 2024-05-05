import { ImageBackground, ScrollView, Text, StyleSheet, View } from 'react-native';
import { Icon, Portal, Modal, FAB, Card, Divider, Button, PaperProvider, BottomNavigation, TextInput } from 'react-native-paper';
import { useFonts } from 'expo-font';
import * as rssParser from 'react-native-rss-parser';
import { useState } from 'react';
import './RSSEntry'
import RSSEntry from "./RSSEntry";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator,  } from "react-native-paper/react-navigation";

export default function App() {
  const Tab = createMaterialBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const [fontsLoaded] = useFonts({'Beth Ellen' : require('./assets/fonts/BethEllen-Regular.ttf'),});
  const [idCounter, setidCounter] = useState(0);
  const feedURL = 'https://www.patreon.com/rss/theofficialpodcast?auth=x7Nf0Tjv_e2cTYJkH-tAPi55FQe8EHMV'
  const [modalVisible, setModalVisible] = useState(false);
  const [inputURL, setInputURL] = useState("");
  const [rssTitle, setRSSTitle] = useState('Hold yer horses!')
  const [rssImage, setRSSImage] = useState(null)
  const [rssLastUpdated, setRSSLastUpdated] = useState(null)
  const [rssItems, setRSSItems] = useState([])
  const modalShow = () => setModalVisible(true);
  const modalHide = () => setModalVisible(false);
  const [URLs, setURLs] = useState([]);
  const [RSSs, setRSSs] = useState([]);
  const handleButton = () => {
    modalHide();
    setURLs([...URLs, inputURL])
  };
  const handleURL = url => {
    modalHide();
    fetch(url)
      .then((response) => response.text())
      .then((responseData) => rssParser.parse(responseData))
      .then((rss) =>
      setRSSs([...RSSs,
      {key: idCounter, title: rss.title, items: rss.items, image: rss.image}]));
    setidCounter(idCounter + 1);
  };
  const handleItemPress = key => {
    setRSSImage(RSSs.find(obj => obj.key == key));

  }

  const MainRoute = () => {
      return(
        <View>

          <FeedRoute/>
        </View>
      )
    }
    ;

  const ItemRoute = () =>
    <View>
      <ImageBackground source={rssImage}>
      </ImageBackground>
    </View>;

  const FeedRoute = () =>
    <View style={styles.mainContainer} id='deck'>
      <ScrollView>
      {
        RSSs.map(function(rss){
          return(
            <RSSEntry title={rss.title} items={rss.items} image={rss.image}/>
          )
        })
      }
      </ScrollView>
      <FAB
        icon='plus'
        style={styles.fab}
        onPress={() => modalShow()}
      />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => modalHide()} contentContainerStyle={styles.modal}>
          <Text>Input your rss feed link, yo</Text>
          <TextInput
            label='URL'
            value={inputURL}
            onChangeText={inputURL => setInputURL(inputURL)}
          />
          <Button onPress={() =>handleURL(inputURL)}>Add Feed</Button>
        </Modal>
      </Portal>
    </View>;

  const LibraryRoute = () => <Text>Library</Text>;
  const SettingsRoute = () => <Text>Settings</Text>;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'feed', title: 'Feed', focusedIcon: 'rss-box'},
    { key: 'library', title: 'Library', focusedIcon: 'bookshelf' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    feed: FeedRoute,
    library: LibraryRoute,
    settings: SettingsRoute,
  });
  
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Stack.Screen name='Main' component={FeedRoute} options={{title: 'Feed'}}/>
          <Stack.Screen name='ItemPage' component={ItemRoute}/>
        </Tab.Navigator>
      </NavigationContainer>

    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    alignSelf:'flex-start',
    fontFamily:'Beth Ellen',
    fontSize: 30,
    paddingLeft: 20
  },
  item: {
    marginHorizontal: 50,
    marginTop: 20
  },
  mainContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignItems: 'center'
  },
  menuContainer: {
    height: "10%",
  },
  buttonStyle: {
    alignContent: 'center',
  },
  persTitle: {
    paddingTop: 40,
    alignItems: 'center',
    width: '100%'
  },
  modal:{
    backgroundColor: 'white',
    padding: 20,
    margin: 50
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }
});
