import 'react-native-gesture-handler';
import { Image, ImageBackground, ScrollView, Text, StyleSheet, View } from 'react-native';
import { Icon, Portal, Modal, FAB, Card, Divider, Button, PaperProvider, BottomNavigation, TextInput } from 'react-native-paper';
import { useFonts } from 'expo-font';
import * as rssParser from 'react-native-rss-parser';
import { useEffect, useState } from 'react';
import './Components/RSSEntry'
import './Components/MusicPlayer'
import RSSEntry from "./Components/RSSEntry";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator,  } from "react-native-paper/react-navigation";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Markdown from 'react-native-markdown-display';
import { Audio } from 'expo-av'
import MusicPlayer from "./Components/MusicPlayer";

export default function App() {
  const Tab = createMaterialBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();
  const [fontsLoaded] = useFonts({'Beth Ellen' : require('./assets/fonts/BethEllen-Regular.ttf'),});
  const [idCounter, setidCounter] = useState(0);
  const feedURL = 'https://www.patreon.com/rss/theofficialpodcast?auth=x7Nf0Tjv_e2cTYJkH-tAPi55FQe8EHMV'
  const [modalVisible, setModalVisible] = useState(false);
  const [inputURL, setInputURL] = useState("");
  const [rssTitle, setRSSTitle] = useState('Hold yer horses!')
  const [rssImage, setRSSImage] = useState(null)
  const [rssLastUpdated, setRSSLastUpdated] = useState(null)
  const [rssItems, setRSSItems] = useState([])
  const [sound, setSound] = useState();
  const modalShow = () => setModalVisible(true);
  const modalHide = () => setModalVisible(false);
  const [URLs, setURLs] = useState([]);
  const [RSSs, setRSSs] = useState([]);
  const [nowPlaying, setNowPlaying] = useState('');
  const [NPImage, setNPImage] = useState();

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

  async function playSound(url) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync({uri: url}
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
    ? () => {
      console.log('Unloading Sound');
      sound.unloadAsync();
      }
    : undefined;
  }, [sound]);

  function ItemRoute({route, navigation}){
    const {title, items, image} = route.params;
    function handleItemPress(item){
      setNowPlaying(item.title)
      setNPImage(item["itunes"].image)
      playSound(item["enclosures"][0].url)
    }
    return(
        <View>
          <ImageBackground source={image} blurRadius={10}>
            <Text style={styles.itemTitle}>{title}</Text>
            <ScrollView>
              {
                items.map(function(item) {
                  return (
                    <Card>
                      <Card.Title title={item.title}/>
                      <Card.Content>
                        <Text>
                          {item.description}
                        </Text>
                      </Card.Content>
                      <Card.Actions>
                        <Button onPress={() => handleItemPress(item)}>Play</Button>
                      </Card.Actions>
                    </Card>
                  )
                })
              }
            </ScrollView>
          </ImageBackground>
          </View>
    )
  }

  function displayLogo(){
    return (
        <Image source={{uri: './dog.jpg'}}/>
    )
  }

  function Feed({navigation}){
    return(
      <View style={styles.mainContainer} id='deck'>
        <ScrollView>
          {
            RSSs.map(function(rss){
              return(
                <RSSEntry title={rss.title} items={rss.items} image={rss.image} onPress={() => navigation.push('ItemPage', {title: rss.title, items: rss.items, image: rss.image})}/>
              )})
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
      </View>
    )
  }
  function FeedRoute({navigation}) {
    return(
        <Stack.Navigator
          screenOptions={{headerShown: false}}>
          <Stack.Screen name='FeedPage' component={Feed} />
          <Stack.Screen name='ItemPage' component={ItemRoute}/>
        </Stack.Navigator>
    )
  };

  const LibraryRoute = () => <Text>Library</Text>;
  const SettingsRoute = () => <Text>Settings</Text>;

  
  return (
    <PaperProvider>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name='Main' component={FeedRoute} options={{title:'Feed'}}/>
        </Drawer.Navigator>
      </NavigationContainer>
      <MusicPlayer title={nowPlaying} image={NPImage ? NPImage : './dog.jpg'} sound={sound}/>

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
  },
  itemTitle: {
    height: '10%',
    color: 'white',
    fontSize: 25,
    paddingTop: 30,
    fontFamily: 'AlNile-Bold',
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  itemCard: {
    height: '50%',
    width: '50%'
  },
  itemDescription: {
    fontSize: 10,
    color: 'black'
  }
});
