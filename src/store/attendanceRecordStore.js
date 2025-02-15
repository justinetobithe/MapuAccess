import { create } from 'zustand';
import api from '../api';

const useAttendanceRecordStore = create((set) => ({
    attendanceRecords: [],
    isLoading: false,
    error: null,

    addAttendanceRecord: async (formData, showToast) => {
        set({ isLoading: true, error: null });
        try {

            console.log("formData", formData)

            const res = await api.post('/api/attendance-record', formData);

            if (res.data.status) {
                if (res.data.status === "success") {
                    set((state) => ({
                        attendanceRecords: [...state.attendanceRecords, res.data.data],
                    }));
                    if (showToast) {
                        showToast(res.data.message, "success");
                    }
                } else {
                    if (showToast) {
                        showToast(res.data.message, "info");
                    }
                }
            } else {
                console.log("Backend error:", res.data.message);
                if (showToast) {
                    showToast(res.data.message, "error");
                }
            }
        } catch (e) {
            console.error(`addAttendanceRecord error: ${e}`);
            if (showToast) {
                showToast(`Failed to add attendance record: ${e.message}`, "error");
            }
            set({ error: e.message });
        } finally {
            set({ isLoading: false });
        }
    },

}));

export default useAttendanceRecordStore;
