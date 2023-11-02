import { Text, View, StyleSheet } from 'react-native'
import { DrawerToggleButton } from '@react-navigation/drawer'
import { Drawer } from 'expo-router/drawer'
export default function Page() {
  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          title: 'Home', // <== NEW EDIT HERE
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <Text style={{ fontSize: 24 }}>Index page of Home Drawer</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
