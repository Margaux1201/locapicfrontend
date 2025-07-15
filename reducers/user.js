import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { nickname: null, places: [] },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Enregistre le pseudo de l'uilisateur
    updateNickname: (state, action) => {
      state.value.nickname = action.payload;
    },
    // Ajoute un lieu à la liste des lieux de l'utilisateur
    addPlace: (state, action) => {
      state.value.places.push(action.payload);
    },
    // Supprime un lieu de la liste des lieux de l'utilisateur
    removePlace: (state, action) => {
      state.value.places = state.value.places.filter(
        (e) => e.name !== action.payload
      );
    },
    // Récupère la liste des lieux de l'utilisateur depuis le bakcend
    importPlaces: (state, action) => {
      state.value.places = action.payload;
    },
  },
});

export const { updateNickname, addPlace, removePlace, importPlaces } =
  userSlice.actions;
export default userSlice.reducer;
