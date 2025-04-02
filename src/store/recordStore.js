import { create } from 'zustand';
import api from '../api';

const useRecordStore = create((set) => ({
    records: [],
    isLoading: false,
    error: null,

    scanQRCode: async (formData, showToast) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/api/scan-qr-code', formData);

            const { status, message, data } = res.data;

            if (status === "success") {
                set((state) => ({
                    records: [...state.records, res.data.data],
                }));
            }

            return { status, message, data };

        } catch (e) {
            console.error(`record error: ${e}`);
            if (showToast) {
                showToast(`Failed to add attendance record: ${e.message}`, "error");
            }
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    showRecordsWithVehicleId: async (vehicleId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/api/record/vehicle/${vehicleId}`);
            set({ records: res.data.data });
        } catch (e) {
            console.error(`records error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useRecordStore;
