import { StatusBar } from 'expo-status-bar';
import { Text, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import ReactDOM from 'react-dom'
import { Portal, Modal, FAB, Card, Divider, Button, PaperProvider, BottomNavigation, TextInput } from 'react-native-paper';
import { useFonts } from 'expo-font';
import CodePush from 'react-native-code-push'
import * as rssParser from 'react-native-rss-parser';
import { useState } from 'react';

function parse(url) {
  fetch(url)
  .then((response) => response.text())
  .then((responseData) => rssParser.parse(responseData))
  .then((rss) => generateCard(rss));
}

function generateFeed(URLs) {
  if(URLs.length > 0){
    for (let i = 0; i < URLs.length; i++) {
      const URL = URLs[i];
      parse(URL)
    }
  }
}

function generateCard(rss) {
  if(rss.title && rss.items){
    console.log(rss.title);
    console.log(rss.items.length);
    return (
      <Card mode='contained' style={styles.mainContent}>
      <Card.Title title={rss.title} titleStyle={styles.sourceTitle}/>
      <Card.Content>
        <Text variant="title" style={styles.sourceTitle3}>Items: {rss.items.length}</Text>
        <Text variant="bodyMedium"></Text>
      </Card.Content>
      <Card.Cover source={rss.image} style={styles.sourceImage}/>
      <Card.Actions>
        <Button>Delete</Button>
      </Card.Actions>
    </Card>
    );
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({'Beth Ellen' : require('./assets/fonts/BethEllen-Regular.ttf'),});
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
  

  const FeedRoute = () => 
    <View style={styles.mainContainer} id='deck'>
      {
        URLs.map(function(url) {
            fetch(url)
            .then((response) => response.text())
            .then((responseData) => rssParser.parse(responseData))
            .then((rss) => {
                return(
                  <Card mode='contained' style={styles.mainContent}>
                  <Card.Title title={rss.title} titleStyle={styles.sourceTitle}/>
                  <Card.Content>
                    <Text variant="title" style={styles.sourceTitle3}>Items: {rss.items.length}</Text>
                    <Text variant="bodyMedium"></Text>
                  </Card.Content>
                  <Card.Cover source={rss.image} style={styles.sourceImage}/>
                  <Card.Actions>
                    <Button>Delete</Button>
                  </Card.Actions>
                </Card>
                )}
              )
            }
          )
        }
      <FAB
        icon='plus'
        style={styles.fab}
        onPress={() => modalShow()}
      />
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
      <View style={styles.persTitle}>
        <Text style={{fontFamily: 'Beth Ellen', fontSize:25}}>Catch</Text>
        <Divider/>
      </View>
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => modalHide()} contentContainerStyle={styles.modal}>
          <Text>Input your rss feed link, yo</Text>
          <TextInput
            label='URL'
            value={inputURL}
            onChangeText={inputURL => setInputURL(inputURL)}
          />
          <Button onPress={() => 
            handleButton()
          }>Add Feed</Button>
        </Modal>
      </Portal>

      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />

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
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderTopColor: '#bdbdbd',
    borderBottomWidth: 0,
    borderBottomColor: '#bdbdbd'
  },
  mainContent: {
    padding:10,
    marginVertical: 50,
    marginHorizontal: 20
  },
  menuContainer: {
    height: "10%",
  },
  sourceTitle: {
    fontWeight: 'bold',
    fontSize: 20
  },
  sourceTitle2: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  sourceTitle3: {
    fontWeight: 'bold',
    fontSize: 15
  },
  sourceImage: {
    height: 140,
    width: 140,
    marginLeft: 10
  },
  buttonStyle: {
    alignContent: 'center',
  },
  persTitle: {
    paddingTop: 40,
    alignSelf: 'center'
  },
  modal:{
    backgroundColor: 'white',
    padding: 20,
    margin: 50
  }
});
