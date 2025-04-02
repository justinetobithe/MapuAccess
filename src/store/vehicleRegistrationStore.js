import { create } from 'zustand';
import api from '../api';

const useVehicleRegistration = create((set) => ({
    vehicleRegistrations: [],
    isLoading: false,
    error: null,

    addVehicleRegistration: async (vehicleId, showToast) => {
        set({ isLoading: true, error: null });

        console.log("vehicleId", vehicleId)

        try {
            const res = await api.post('/api/vehicle-registration', {
                vehicle_id: vehicleId,
            });

            if (res.data.status === "success") {
                set((state) => ({
                    vehicleRegistrations: [...state.vehicleRegistrations, res.data.data],
                }));
                if (showToast) {
                    showToast(res.data.message, "success");
                }
            } else {
                set({ error: res.data.message });
                if (showToast) {
                    showToast(res.data.message, "error");
                }
            }
        } catch (e) {
            set({ error: e.message });
            if (showToast) {
                showToast(`Failed to add vehicle: ${e.message}`, "error");
            }
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useVehicleRegistration;
