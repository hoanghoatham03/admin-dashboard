import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

//get token from api and save it in local storage

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      token: "",

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getUser = () => {
  return useAuthStore.getState().user;
};

export const setUser = (user) => {
  useAuthStore.getState().setUser(user);
};

export const getToken = () => {
  return useAuthStore.getState().token;
};

export const setToken = (token) => {
  useAuthStore.getState().setToken(token);
};

export const removeToken = () => {
  useAuthStore.getState().setToken("");
};
