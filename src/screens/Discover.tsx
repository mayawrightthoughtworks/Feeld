import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { NavigationParams } from 'react-navigation';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../store/types';
import { discoverFetchProfiles } from '../store/discover/actions';
import { Routes } from '../navigation/routes';
import { Profile } from '../interface/types';

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

  const Item = ({ title, onPress }: { title: string; onPress: () => any }) => (

    //This is where the profile items are displayed 
    <Pressable style={styles.item} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text>hello</Text>
    </Pressable>
  );

  const renderItem = ({ item }: { item: Profile }) => (
    <Item
      title={
        item.associated
          ? `${item.info.name} & ${item.associated?.name}`
          : item.info.name
      }
      onPress={() =>
        item.associated
          ? navigation.navigate('Root', {
              screen: Routes.PartnerProfile,
              params: { profile: item.associated },
            })
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
