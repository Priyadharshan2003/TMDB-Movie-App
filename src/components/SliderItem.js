import React, { useMemo, useCallback, memo } from 'react';
import {
  View, Image, Text, StyleSheet,
  useWindowDimensions, Platform,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Category from './Category';
import { getImageUrl } from '../helpers/url-helper';
import PlaceHolder from './PlaceHolder';
import Touchable from './Touchable';

const { OS } = Platform;

const IS_ANDROID = OS === 'android';

const styles = StyleSheet.create({
  backdropContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: IS_ANDROID ? 'Roboto' : undefined,
    color: '#ffffff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  titlePlaceHolder: {
    width: 250,
    height: 18,
    backgroundColor: '#1C1D24',
    borderRadius: 4,
    marginLeft: 16,
    marginBottom: 4,
  },
  categoriesPlaceHolder: {
    width: 180,
    height: 16,
    backgroundColor: '#1C1D24',
    borderRadius: 4,
    marginLeft: 16,
    marginBottom: 4,
  },
});

const BACKDROP_ASPECT_RATIO = 16 / 9;
const LINEAR_GRADIENT_COLORS = ['#14151A00', '#14151A'];

const SliderItem = memo(({ item, mediaType }) => {
  const { width } = useWindowDimensions();

  const navigation = useNavigation();

  const {
    backdrop_path: backdropPath, title, name,
    genre_ids: genreIds,
  } = item;

  const handlePress = useCallback(() => {
    navigation.navigate(mediaType === 'movie' ? 'Movie' : 'TVShow', { item });
  }, []);

  const blurredImageStyle = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.5,
    width,
  }), [width]);

  const linearGradientStyles = useMemo(() => ({
    width,
    paddingHorizontal: 16,
  }), [width]);

  const containerStyle = useMemo(
    () => ({
      width,
      margin: 0,
      paddingBottom: 0,
      justifyContent: 'space-between',
    }),
    [width],
  );

  const blurredImageSource = useMemo(
    () => ({
      uri: getImageUrl({ size: 'w300', path: backdropPath }),
    }),
    [backdropPath],
  );

  const backdropSource = useMemo(
    () => ({
      uri: getImageUrl({ size: 'w780', path: backdropPath }),
    }),
    [backdropPath],
  );

  const insets = useSafeAreaInsets();

  const backdropStyles = useMemo(
    () => ({
      width: width - 30,
      height: width / BACKDROP_ASPECT_RATIO - 32,
      marginTop: IS_ANDROID ? insets.top + 16 : insets.top,
      borderRadius: 4,
      marginBottom: 8,
    }),
    [width, insets.top],
  );

  const renderCategories = () => {
    const newGenreIds = [...genreIds];

    return newGenreIds.slice(0, 3).map((id) => (<Category key={id} id={id} />));
  };

  return (
    <Touchable onPress={handlePress}>
      <View style={containerStyle}>
        <Image
          style={blurredImageStyle}
          source={blurredImageSource}
          blurRadius={3}
        />
        <View edges={['top']} style={styles.backdropContainer}>
          <Image source={backdropSource} style={backdropStyles} />
        </View>
        <LinearGradient
          colors={LINEAR_GRADIENT_COLORS}
          style={linearGradientStyles}
        >
          <Text
            style={styles.movieTitle}
            numberOfLines={1}
          >
            {title || name}
          </Text>
          <View style={styles.categoryContainer}>
            {renderCategories()}
          </View>
        </LinearGradient>
      </View>
    </Touchable>
  );
});

SliderItem.Placeholder = memo(() => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const containerStyle = useMemo(
    () => ({
      width,
      margin: 0,
    }),
    [width],
  );

  const placeHolderStyles = useMemo(() => ({
    width: width - 30,
    height: width / BACKDROP_ASPECT_RATIO - 32,
    marginTop: IS_ANDROID ? insets.top + 16 : insets.top,
    backgroundColor: '#1C1D24',
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 24,
  }), [width]);

  return (
    <View style={containerStyle}>
      <PlaceHolder style={placeHolderStyles} />
      <PlaceHolder style={styles.titlePlaceHolder} />
      <PlaceHolder style={styles.categoriesPlaceHolder} />
    </View>
  );
});

export default SliderItem;
