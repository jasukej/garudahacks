import { create } from 'zustand';

interface useAnalyzeModalStore {
    isOpen: boolean,
    toggleModal: () => void;
}

const useAnalyzeModal = create<useAnalyzeModalStore>((set) => ({
    isOpen: false,
    toggleModal: () => set((state:any) => ({ isOpen: !state.isOpen }))
}));

export default useAnalyzeModal;