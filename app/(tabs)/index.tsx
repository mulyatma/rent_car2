import { SearchBar } from 'react-native-elements';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CarCard from '@/components/ui/CardCar';
import { Platform, StatusBar } from 'react-native';
import React from 'react';

interface Car {
  _id: string;
  img: string;
  nameCar: string;
  transmission: string;
  passenger: number;
  oil: string;
  driver?: boolean;
  price: number;
}

export default function HomeScreen() {
  const heroImage = require("../../assets/images/heroImage.png");
  const [search, setSearch] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [cars, setCars] = useState<Car[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const userImage: string =
    'https://res.cloudinary.com/dnlogcrtc/image/upload/v1719605309/dummy_profile_xhc9th.png';

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://be-rent-car.vercel.app/cars');
        const data: Car[] = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    const retrieveData = async () => {
      try {
        const valueName = await AsyncStorage.getItem('@myApp:name');
        const valueToken = await AsyncStorage.getItem('@myApp:token');
        if (valueToken) {
          setUserName(valueName || '');
          setToken(valueToken);
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    fetchData();
    retrieveData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@myApp:name');
      await AsyncStorage.removeItem('@myApp:token');
      setUserName('');
      setToken('');
      setIsModalVisible(false);
      navigation.navigate('login' as never); // Pastikan nama route benar
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Hai!! {userName ? userName : 'User'}
          </Text>
          {token ? (
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Image source={{ uri: userImage }} style={styles.userImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('login' as never)}>
              <Text style={styles.loginButton}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
        <SearchBar
          platform='default'
          placeholder="Cari Mobil"
          onChangeText={setSearch}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput} />
        <View>
          <View style={styles.heroWrapper}>
            <View style={styles.hero}>
              <Image source={heroImage} style={styles.heroImage} />
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => navigation.navigate('explore' as never)}
              >
                <Text style={styles.heroButtonText}>Sewa Sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.popularCarsContainer}>
            <Text style={styles.popularCarsText}>Mobil Populer</Text>
            <TouchableOpacity onPress={() => navigation.navigate('explore' as never)}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={cars}
            renderItem={({ item }) => <CarCard car={item} />}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carListContainer}
          />
        </View>
        <Modal
          animationType="slide"
          transparent
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Yakin ingin keluar?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonLogout]}
                  onPress={handleLogout}
                >
                  <Text style={styles.textStyle}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
  },
  welcomeText: {
    fontSize: 20,
    color: '#000',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  loginButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  searchContainer: {
    marginHorizontal: 10,
    marginBottom: 16,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchInputContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  searchInput: {
    color: '#000',
  },
  heroWrapper: {
    marginHorizontal: 20,
  },
  hero: {
    backgroundColor: '#fff',
    width: '100%',
    height: 212,
    position: 'relative',
    borderRadius: 10,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  heroButton: {
    position: 'absolute',
    bottom: 40, // Adjust according to image
    left: 30,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  heroButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popularCarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  popularCarsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllText: {
    fontSize: 18,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  carListContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: '#000'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonLogout: {
    backgroundColor: '#f44336',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
