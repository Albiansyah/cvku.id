// src/store/useAuthModalStore.js
import { create } from "zustand";

/**
 * Zustand store untuk mengontrol modal otentikasi (login, register, forgot-password).
 *
 * @property {'login' | 'register' | 'forgot-password' | null} view
 *   Menyimpan tipe modal yang sedang aktif. null berarti modal tertutup.
 *
 * @function openModal
 * @function closeModal
 *   Menutup modal dengan mengatur view kembali ke null.
 */
const useAuthModalStore = create((set) => ({
  view: null, 
  openModal: (newView) => set(() => ({ view: newView })),
    closeModal: () => set(() => ({ view: null })),
}));

export default useAuthModalStore;
