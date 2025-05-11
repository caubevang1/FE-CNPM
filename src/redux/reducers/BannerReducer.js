import { createSlice } from '@reduxjs/toolkit'
import diaDao from '../../assets/img/diaDao.jpg'
import thamTuKien from '../../assets/img/thamTuKien.jpg'
import transformer from '../../assets/img/transformer3.jpg'

const initialState = {
    data: [
        {
            maBanner: 1,
            link: 'https://www.youtube.com/watch?v=-OGDDtsIBHA',
            img: diaDao
        },
        {
            maBanner: 2,
            link: 'https://www.youtube.com/watch?v=QiXNbEKF3U0',
            img: thamTuKien
        },
        {
            maBanner: 3,
            link: 'https://www.youtube.com/watch?v=JOQrn9AToag&pp=ygUbdGhlIGxhc3Qga25pZ2h0IHRyYWlsZXIgY2d20gcJCYYJAYcqIYzv',
            img: transformer
        },
    ],
    modalData: ''
}

const BannerReducer = createSlice({
    name: "BannerReducer",
    initialState,
    reducers: {
        getBannerMovie: (state, { type, payload }) => {
            return { ...state }
        },
        getModalVideo: (state, { type, payload }) => {
            const videoId = getId(payload)
            return { ...state, modalData: videoId }
        }
    }
});

export const { getBannerMovie, getModalVideo } = BannerReducer.actions

export default BannerReducer.reducer

function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
        ? match[2]
        : null;
}