import { create } from 'zustand';

interface useSummarizeModalStore {
    isOpen: boolean,
    toggleModal: () => void;
}

const useSummarizeModal = create<useSummarizeModalStore>((set) => ({
    isOpen: false,
    toggleModal: () => set((state:any) => ({ isOpen: !state.isOpen }))
}));

export default useSummarizeModal;