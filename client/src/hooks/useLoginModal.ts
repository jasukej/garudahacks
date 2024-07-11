import { create } from 'zustand';

interface LoginModalStore {
    isOpen: boolean;
    toggleModal: () => void;
}

export const useLoginModal = create<LoginModalStore>((set) => ({
    isOpen: false,
    toggleModal: () => set((state:any) => ({ isOpen: !state.isOpen }))
}))