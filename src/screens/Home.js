import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import Footer from '../common/Footer';
import SearchBar from '../common/SearchBar'; // adjust path if needed

// Import only 2 images
import stationImg1 from '../../assets/station1.jpg';
import stationImg2 from '../../assets/station2.jpg';

const Home = ({ navigation }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stationImages = [stationImg1, stationImg2];
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (text) => {
    setSearchQuery(text);
  };
  
  useEffect(() => {
    axios
      .get('http://10.1.17.148:5000/api/stations')
      .then((response) => {
        const stationsWithImage = response.data.map((station) => ({
          ...station,
          randomImage: stationImages[Math.floor(Math.random() * stationImages.length)],
        }));
        setStations(stationsWithImage);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch stations');
        setLoading(false);
      });
  }, []);

  const renderStation = ({ item }) => (
    <View style={styles.stationCard}>
      <Text style={styles.stationName}>{item.name}</Text>
      <Text style={styles.stationAddress}>{item.address}</Text>
      <Text style={styles.stationLocation}>{item.location}</Text>
      <Image source={item.randomImage} style={styles.stationImage} />
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BookSlot', { stationId: item._id })}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Welcome to Home</Text>
      {/* <Text style={styles.subtitle}>You have successfully logged in!</Text> */}
      <SearchBar searchQuery={searchQuery} onChange={handleSearch} />

      <View style={styles.listWrapper}>
        <FlatList
          data={stations.filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.address.toLowerCase().includes(searchQuery.toLowerCase())
          )}          
          renderItem={renderStation}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.stationList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Footer navigation={navigation} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 80,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  listWrapper: {
    flex: 1,
  },
  stationCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  stationImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop:-20,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  stationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  stationAddress: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  stationLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2DBE7C',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  stationList: {
    paddingBottom: 20,
  },
});
