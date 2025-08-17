import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const ActiveOrderCard = ({ order }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.clientName}>{order.clientName}</Text>
          <Text style={styles.description} numberOfLines={3}>
            {order.description}
          </Text>
          <Text style={styles.estimatedTime}>
            Tiempo aprox: {order.estimatedTime}
          </Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: order.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 15,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  estimatedTime: {
    fontSize: 12,
    color: '#8D6CFF',
    fontWeight: '500',
  },
  imageContainer: {
    width: 80,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ActiveOrderCard;