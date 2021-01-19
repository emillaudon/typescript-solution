import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";

interface ShoppingItem {
  id: number;
  title: string;
  price: number;
  description?: string;
  category?: string;
  image: string;
}

async function getData(): Promise<ShoppingItem[]> {
  let items: ShoppingItem[] = [];
  const url = "https://fakestoreapi.com/products";

  let response = await fetch(url);

  if (response.status == 200) {
    let body: ShoppingItem[] = await response.json();

    body.forEach((item: ShoppingItem) => {
      let newItem: ShoppingItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
      };

      items.push(newItem);
    });
    return items;
  } else {
    return items;
  }
}

async function getSpecificData(id: number): Promise<ShoppingItem> {
  let item: ShoppingItem;
  const url = "https://fakestoreapi.com/products/" + id;

  let response = await fetch(url);

  item = await response.json();

  return item;
}

const ListItem = ({ item, navigation }: ItemParams) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ItemView", { id: item.id })}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          style={{ height: 100, width: 100 }}
          source={{ uri: item.image }}
        />

        <View style={{ flexDirection: "column" }}>
          <Text>{item.title}</Text>
          <Text>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const StoreList = (props: { data: ShoppingItem[] }) => {
  return <Text>f</Text>;
};

const HomeView = ({ navigation }: MainScreenProps) => {
  const [data, setData] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    async function loadData() {
      let items: ShoppingItem[] = await getData();
      setData(items);
    }
    loadData();
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          return <ListItem item={item} navigation={navigation} />;
        }}
      />
      
      <StatusBar style="auto" />
    </View>
  );
};

const SpecificItemView = ({ navigation, route }: ItemViewScreenProps) => {
  const [item, setItem] = useState<ShoppingItem>();

  useEffect(() => {
    async function loadData() {
      let i: ShoppingItem = await getSpecificData(route.params.id);
      navigation.setOptions({ title: i.title });
      setItem(i);
    }
    loadData();
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          height: "100%",
          width: "80%",
          flexDirection: "column",
          alignItems: "baseline",
        }}
      >
        <Image
          style={{
            alignSelf: "center",
            marginBottom: 10,
            height: 200,
            width: 200,
          }}
          source={{ uri: item?.image }}
        />
        <Text style={{ marginBottom: 10, fontSize: 24, fontWeight: "bold" }}>
          {item?.title}
        </Text>
        <Text style={{ marginBottom: 10, fontSize: 22, color: "green" }}>
          {item ? "$" + item?.price : ""}
        </Text>
        <Text style={{ marginBottom: 10, fontWeight: "bold", fontSize: 18 }}>
          {item ? "Description" : ""}
        </Text>
        <Text>{item?.description}</Text>
        <Text style={{ color: "grey" }}>
          {item ? "Category: " + item?.category : ""}
        </Text>

        <View style={{ alignSelf: "center", justifyContent: "center" }}>
          <Button title={item ? "Add to Cart" : ""} onPress={() => {}} />
        </View>
      </View>
    </View>
  );
};

type StackParams = {
  Catalog: undefined;
  ItemView: { id: number };
};

type MainScreenProps = {
  navigation: StackNavigationProp<StackParams, "Catalog">;
};

type ItemParams = {
  item: ShoppingItem;
  navigation: StackNavigationProp<StackParams, "Catalog">;
};

type ItemViewScreenProps = {
  navigation: StackNavigationProp<StackParams, "ItemView">;
  route: RouteProp<StackParams, "ItemView">;
};

const Stack = createStackNavigator<StackParams>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Catalog">
        <Stack.Screen
          name="Catalog"
          component={HomeView}
          options={{ title: "Catalog" }}
        />
        <Stack.Screen
          name="ItemView"
          component={SpecificItemView}
          options={{ title: "Item" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
