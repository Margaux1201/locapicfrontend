import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPlace, importPlaces } from "../reducers/user";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
// Importation de l'adresse IP du mobile depuis le fichier .env
import { API_URL } from "@env";

export default function MapScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [currentPosition, setCurrentPosition] = useState(null); // Coordonnées de la position de l'utilisateur
  const [tempCoordinates, setTempCoordinates] = useState(null); // Coordonnées d'un nouvel emplacement créé directement depuis la carte
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState("");
  const [userMarker, setUserMarker] = useState([]);

  // Récupération de la position de l'utilisateur et de tous ses lieux associés
  useEffect(() => {
    (async () => {
      // Demande d'autorisation pour accéder à la localisation
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === "granted") {
        // Récupère la position de l'utilisateur en temps réel avec une intervalle de mise à jour de 10 mètres
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          // Met à jour les coordonnées de la position actuelle
          setCurrentPosition(location.coords);
        });
      }
    })();

    // Récupération des lieux de l'utilisateur depuis le backend
    fetch(`${API_URL}/places/${user.nickname}`)
      .then((response) => response.json())
      .then((data) => {
        // Enregistre les lieux de l'utilisateur dans le store Redux
        data.result && dispatch(importPlaces(data.places));
      });
  }, []);

  // Fonction pour ouvrir une modale et ajouter le lieu touché sur la carte
  const handleLongPress = (e) => {
    // Enregistre les coordonnées de l'emplacement sélectionné sur la carte
    setTempCoordinates(e.nativeEvent.coordinate);
    // Ouvre une modale pour ajouter un lieu
    setModalVisible(true);
  };

  // Fonction pour ajouter le lieu sélectionné sur la carte
  const handleNewPlace = () => {
    // Enregistre le nouveau lieu dans le store Redux
    dispatch(
      addPlace({
        name: newPlace,
        latitude: tempCoordinates.latitude,
        longitude: tempCoordinates.longitude,
      })
    );

    // Ajoute le nouveau lieu dans la base de données depuis le backend
    fetch(`${API_URL}/places`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: user.nickname,
        name: newPlace,
        latitude: tempCoordinates.latitude,
        longitude: tempCoordinates.longitude,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("FETCH POST⭐⭐", data)),
      // Réinitilise le champ de saisie de la modale et ferme la modale
      setModalVisible(false);
    setNewPlace("");
  };

  // Fonction pour fermer la modale
  const handleClose = () => {
    setModalVisible(false);
    // Réinitilise le champ de saisie de la modale
    setNewPlace("");
  };

  // Création des marqueurs pour chaque lieu enregistré dans la liste de l'utilisateur
  const markers = user.places.map((data, i) => {
    return (
      <Marker
        key={i}
        coordinate={{ latitude: data.latitude, longitude: data.longitude }}
        title={data.name}
      />
    );
  });

  return (
    <View style={styles.container}>
      {/* PARTIE MODALE QUAND ELLE EST AFFICHEE */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="New place"
              onChangeText={(value) => setNewPlace(value)}
              value={newPlace}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => handleNewPlace()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleClose()}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* FIN PARTIE MODALE */}

      <MapView
        onLongPress={(e) => handleLongPress(e)}
        mapType="hybrid"
        style={styles.map}
      >
        {currentPosition && (
          <Marker
            coordinate={currentPosition}
            title="My position"
            pinColor="#fecb2d"
          />
        )}
        {markers}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 150,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#ec6e5b",
    borderRadius: 10,
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
});
