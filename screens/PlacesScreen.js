import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { addPlace, removePlace } from "../reducers/user";
// Importation de l'adresse IP du mobile depuis le fichier .env
import { API_URL } from "@env";

export default function PlacesScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [city, setCity] = useState(""); // Champ de saisie pour ajouter une nouvelle ville

  // Fonction pour créer une nouvelle ville dans la liste de l'utilisateur
  const handleSubmit = () => {
    // Vérifie si le champ de saisie n'est pas vide avant de faire une requête
    if (city.length === 0) {
      return;
    }

    // Requête pour récupérer les coordonnées de la ville saisie
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
      .then((response) => response.json())
      .then((data) => {
        const firstCity = data.features[0];
        // Création d'une nouvelle ville avec les coordonnées récupérées
        const newPlace = {
          name: firstCity.properties.city,
          latitude: firstCity.geometry.coordinates[1],
          longitude: firstCity.geometry.coordinates[0],
        };

        // Ajoute la nouvelle ville dans le store Redux et dans la base de données, en lien avec l'utilisateur
        fetch(`${API_URL}/places`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname: user.nickname,
            name: newPlace.name,
            latitude: newPlace.latitude,
            longitude: newPlace.longitude,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.result) {
              // Si la requête est réussie, ajoute le lieu dans le store Redux
              dispatch(addPlace(newPlace));
              // Réinitialise le champ de saisie
              setCity("");
            }
          });
      });
  };

  // Fonction pour supprimer un lieu de la liste de l'utilisateur
  const handleDelete = (placeName) => {
    fetch(`${API_URL}/places`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: user.nickname,
        name: placeName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // Si la requête est réussie, supprime le lieu du store Redux
          dispatch(removePlace(placeName));
        }
      });
  };

  // Affichage des lieux de l'utilisateur au chargement de l'écran
  const places = user.places.map((data, i) => {
    return (
      <View key={i} style={styles.card}>
        <View>
          {/* NOM DE LA VILLE */}
          <Text style={styles.name}>{data.name}</Text>

          {/* COORDONNÉES DE LA VILLE */}
          <Text>
            LAT : {Number(data.latitude).toFixed(3)} LON :{" "}
            {Number(data.longitude).toFixed(3)}
          </Text>
        </View>

        {/* ICÔNE POUR SUPPRIMER LA VILLE */}
        <FontAwesome
          name="trash-o"
          onPress={() => handleDelete(data.name)}
          size={25}
          color="#ec6e5b"
        />
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{user.nickname}'s places</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="New city"
          onChangeText={(value) => setCity(value)}
          value={city}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* LISTE DES VILLES DE L'UTILISATEUR */}
        {places}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 20,
  },
  scrollView: {
    alignItems: "center",
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    backgroundColor: "#ffffff",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    backgroundColor: "#ffffff",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  input: {
    width: "65%",
    marginTop: 6,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: "30%",
    alignItems: "center",
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
