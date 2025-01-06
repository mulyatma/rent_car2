/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Platform, StatusBar } from 'react-native';
import { SearchBar } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import CardCarList from '@/components/ui/CardCarList';

interface Car {
  _id: string;
  nameCar: string;
  description: string;
  transmission: string;
  passenger: number;
  oil: string;
  driver: boolean;
  price: string;
  img: string;
}

export default function ExploreScreen() {
  const [search, setSearch] = useState<string>('');
  const [drive, setDrive] = useState<boolean | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<boolean | null>(null);
  const [items, setItems] = useState<{ label: string; value: boolean | null }[]>([
    { label: 'Tanpa Sopir', value: false },
    { label: 'Dengan Sopir', value: true },
    { label: 'Tampilkan semua', value: null },
  ]);
  const [cars, setCars] = useState<Car[]>([]);

  const updateSearch = (search: string): void => {
    setSearch(search);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          drive !== null
            ? `https://be-rent-car.vercel.app/cars?driver=${drive}&nameCar=${search}`
            : `https://be-rent-car.vercel.app/cars?&nameCar=${search}`;
        const response = await fetch(url);
        const data: Car[] = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchData();
  }, [drive, search]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search..."
            onChangeText={updateSearch}
            value={search}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchInputContainer}
            inputStyle={styles.searchInput}
          />
          <DropDownPicker
            open={open}
            placeholder="Sopir"
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={(value) => setDrive(value)}
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
            dropDownStyle={styles.dropdown}
            textStyle={styles.dropdownText}
            labelStyle={styles.dropdownLabel}
            showArrowIcon={false}
            itemSeparator={true}
            placeholderStyle={{ fontWeight: 'bold' }}
          />
        </View>
        <FlatList
          data={cars}
          renderItem={({ item }) => <CardCarList car={item} />}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cartContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 16,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    flex: 1,
  },
  searchInputContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  searchInput: {
    color: '#000',
  },
  dropdownContainer: {
    width: 90,
    marginLeft: 10,
  },
  dropdown: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    borderWidth: 0,
    maxHeight: 200,
  },
  dropdownText: {
    fontSize: 14,
    textAlign: 'center',
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#000',
  },
  cartContainer: {
    paddingHorizontal: 20,
    paddingTop: 5,
  },
});
