import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image
} from 'react-native';
import { NavigationParams } from 'react-navigation';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../store/types';
import { discoverFetchProfiles } from '../store/discover/actions';
import { Routes } from '../navigation/routes';
import { Profile } from '../interface/types';
import { Photo } from '../interface/types';



const mapStateToProps = (state: RootState) => ({
  fetchingProfiles: state.discover.fetchingProfiles,
  profiles: state.discover.profiles,
});

const mapDispatchToProps = {
  fetchProfiles: discoverFetchProfiles,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: NavigationParams;
};

function Discover({
  navigation,
  fetchingProfiles,
  fetchProfiles,
  profiles,
}: Props) {
  useEffect(() => {
    if (profiles.length < 1) {
      fetchProfiles();
    }
  }, []);

  const Item = ({ name, age, gender, sexuality, about, desires, interests, profilePic, associatedName, associatedAge, associatedGender, associatedSexuality, onPress }: { name: string; age: number; gender: string; sexuality: string; about: string; desires: String[]; interests: String[]; profilePic: Photo[]; associatedName: string; associatedAge: number; associatedGender: string; associatedSexuality: string; onPress: () => any }) => (
    

    // This is where the pink rectangle card is 
    <Pressable style={styles.item} onPress={onPress}>
      <Text style={styles.title}>{name}</Text>
      <Image source={profilePic}/>
      <Text>{age}</Text>
      <Text>{gender}</Text>
      <Text>{sexuality}</Text>
      <Text>{about}</Text>
      <Text>{desires}</Text>
      <Text>{interests}</Text>
      <Text>{associatedName}</Text>
    </Pressable>
  );



  const renderItem = ({ item }: { item: Profile }) => (
    <Item

    profilePic = {item.photos[0]}




    // only pressable if there is a partner
    onPress={() =>
      item.associated
        ? navigation.navigate('Root', {
            screen: Routes.PartnerProfile,
            params: { profile: item.associated },
          })
        : null
    }





    //Profiles
      name={`${item.info.name}`}
      age={`${item.info.age}`}
      gender={`${item.info.gender}`}
      sexuality={`${item.info.sexuality}`}
      about={`${item.info.about}`}
      desires={`${item.info.desires}`}
      interests={`${item.info.interests}`}

    //Associated Profile  
      associatedName={
        item.associated
          ?`${item.associated?.name}`
          : null
      }
      associatedAge={
        item.associated
          ?`${item.associated?.name}`
          : null
      }
      associatedGender={
        item.associated
          ?`${item.associated?.gender}`
          : null
      }
      associatedSexuality={
        item.associated
          ?`${item.associated?.sexuality}`
          : null
      }
    />
  );

  return fetchingProfiles ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      data={profiles}
      renderItem={renderItem}
      keyExtractor={profile => profile.id}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 24,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default connector(Discover);
