import { create } from 'zustand';
import api from '../api';

const useStrandStore = create((set) => ({
    strands: [],
    isLoading: false,
    error: null,

    fetchStrands: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/api/strands');
            console.log('fetchStrands response:', res.data.data);
            set({ strands: res.data.data });
        } catch (e) {
            console.error(`fetchStrands error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },


}));

export default useStrandStore;
