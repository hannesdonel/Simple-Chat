import MapView, { Marker } from 'react-native-maps';
import React from 'react';

const MapPreview = (props) => {
  const { style, latitude, longitude } = props;

  return (
    <MapView
      style={style}
      region={{
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{
          latitude,
          longitude,
        }}
      />
    </MapView>
  );
};

export default MapPreview;
