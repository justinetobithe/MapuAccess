import { create } from 'zustand';
import api from '../api';

const useVehicleStore = create((set) => ({
    vehicles: [],
    isLoading: false,
    error: null,

    fetchVehicles: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/api/vehicles');
            console.log('fetchVehicles response:', res.data.data);
            set({ vehicles: res.data.data });
        } catch (e) {
            console.error(`fetchVehicles error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addVehicle: async (data, showToast = null, navigation = null) => {
        set({ isLoading: true, error: null });

        const formData = new FormData();
        formData.append("user_id", data.user_id);
        formData.append("plate_number", data.plate_number);
        formData.append("make", data.make);
        formData.append("model", data.model);
        formData.append("year", data.year);
        formData.append("color", data.color);
        formData.append("type", data.type);
        formData.append("is_registered", data.is_registered ? 1 : 0);

        if (data.image) {
            formData.append('image', {
                uri: data.image,
                name: `image_${Date.now()}.png`,
                type: 'image/png'
            });
        }

        console.log("FormData:", data);

        try {
            const res = await api.post('/api/vehicle', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.status === "success") {
                set((state) => ({
                    vehicles: [...state.vehicles, res.data.data],
                }));
                if (showToast) {
                    showToast(res.data.message, "success");
                }
                if (navigation) {
                    navigation.goBack();
                }
            } else {
                console.log("Backend error:", res.data.message);
                if (showToast) {
                    showToast(res.data.message, "error");
                }
            }
        } catch (e) {
            console.error(`addVehicle error: ${e}`);
            if (showToast) {
                showToast(`Failed to add vehicle: ${e.message}`, "error");
            }
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },


    showVehicle: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/api/vehicle/${id}`);
            console.log(`showVehicle response for ID ${id}:`, res.data.data);
            if (res.data.status) {
                set({ currentvehicle: res.data.data });
            }
        } catch (e) {
            console.error(`showVehicle error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateVehicle: async (id, formData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put(`/api/vehicle/${id}`, formData);
            if (res.data.status) {
                set((state) => ({
                    vehicles: state.vehicles.map((vehicle) =>
                        vehicle.id === id ? { ...vehicle, ...res.data.data } : vehicle
                    ),
                }));
            }
        } catch (e) {
            console.error(`updateVehicle error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteVehicle: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.delete(`/api/vehicle/${id}`);
            if (res.data.status) {
                set((state) => ({
                    vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
                }));
            }
        } catch (e) {
            console.error(`deleteVehicle error: ${e}`);
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

    getVehiclesByUserId: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get(`/api/vehicle/${userId}/user`);
            if (res.data.status === "success") {
                set({ vehicles: res.data.data });
            }
        } catch (e) {
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },


}));

export default useVehicleStore;
