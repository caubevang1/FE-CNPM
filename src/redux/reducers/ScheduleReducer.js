import { createSlice } from '@reduxjs/toolkit';
import { LayThongTinLichChieu, XoaLichChieu, CapNhatLichChieu } from '../../services/CinemaService';

const initialState = {
    schedules: [],
    loading: false,
    error: null,
};

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setSchedules: (state, action) => {
            state.schedules = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        removeSchedule: (state, action) => {
            state.schedules = state.schedules.filter(
                schedule => schedule.scheduleId !== action.payload
            );
        },
    },
});

export const { setSchedules, setLoading, setError, removeSchedule } = scheduleSlice.actions;

export const fetchSchedules = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await LayThongTinLichChieu();
        dispatch(setSchedules(response.data));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
    }
};

export const deleteSchedule = (scheduleId) => async (dispatch) => {
    try {
        await XoaLichChieu(scheduleId);
        dispatch(removeSchedule(scheduleId));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const updateSchedule = (scheduleId, data) => async (dispatch) => {
    try {
        await CapNhatLichChieu(data, scheduleId);
        dispatch(fetchSchedules()); // Refresh the schedule list after update
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export default scheduleSlice.reducer;
