import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUserTag } from '@fortawesome/free-solid-svg-icons';
import useRoute from '../../hooks/useRoute';
import { LOCALSTORAGE_USER } from '../../utils/constant';
import { getLocalStorage, SwalConfig } from '../../utils/config';
import LoadingPage from '../LoadingPage';
import {
    LayDanhSachPhongVeService,
    DatVe
} from '../../services/BookingManager';
import {
    datGhe,
    layDanhSachPhongVe,
    xoaDanhSachGheDangDat
} from '../../redux/reducers/BookingReducer';
import { ThongTinDatVe } from '../../_core/models/ThongTinDatVe';
import {
    callApiThongTinNguoiDung,
    setUserInfor
} from '../../redux/reducers/UserReducer';
import { LayThongTinTaiKhoan } from '../../services/UserService';

const BookingTicket = (thongTinNguoiDung, id, setIsLoading) => {
    const dispatch = useDispatch();
    const { danhSachGhe, thongTinPhim } = useSelector(
        (state) => state.BookingReducer.chiTietPhongVe
    );
    const { danhSachGheDangDat } = useSelector(
        (state) => state.BookingReducer
    );

    const renderSeats = () => {
        return danhSachGhe.map((itemGhe, index) => {
            const sizeScreen = window.screen.width;
            let size = 16;
            const classGheVip = itemGhe.seatType === 'Vip' ? 'gheVip' : '';
            const classGheDaDat = itemGhe.seatState === true ? 'gheDaDat' : '';
            let classGheDangDat = '';
            const seatState = itemGhe.seatState === true;

            const indexGheDangDat = danhSachGheDangDat.findIndex(
                (itemGheDangDat) => itemGheDangDat.seatId === itemGhe.seatId
            );
            if (indexGheDangDat !== -1) {
                classGheDangDat = 'gheDangDat';
            }

            let classGheDaDuocTaiKhoanDat = '';
            if (thongTinNguoiDung.username === itemGhe.taiKhoanNguoiDat) {
                classGheDaDuocTaiKhoanDat = 'gheDaDuocTaiKhoanNayDat';
            }

            if (sizeScreen <= 1247 && sizeScreen > 1092) size = 14;
            if (sizeScreen <= 1092 && sizeScreen > 783) size = 12;
            if (sizeScreen <= 783 && sizeScreen > 650) size = 10;
            if (sizeScreen <= 650 && sizeScreen > 530) size = 8;
            if (sizeScreen <= 530 && sizeScreen > 390) size = 6;
            if (sizeScreen <= 390) size = 4;

            return (
                <Fragment key={index}>
                    <button
                        disabled={seatState}
                        onClick={() => dispatch(datGhe(itemGhe))}
                        className={`ghe ${classGheVip} ${classGheDaDat} ${classGheDangDat} ${classGheDaDuocTaiKhoanDat}`}
                    >
                        {itemGhe.seatState ? (
                            classGheDaDuocTaiKhoanDat === '' ? (
                                <FontAwesomeIcon icon={faXmark} />
                            ) : (
                                <FontAwesomeIcon icon={faUserTag} />
                            )
                        ) : (
                            itemGhe.seatNumber
                        )}
                    </button>
                    {(index + 1) % size === 0 ? <br /> : ''}
                </Fragment>
            );
        });
    };

    // const callApiDatVe = async () => {
    //     try {
    //         const thongTinDatVe = new ThongTinDatVe();
    //         thongTinDatVe.movieId = id;
    //         thongTinDatVe.danhSachVe = danhSachGheDangDat;

    //         setIsLoading(true);
    //         await DatVe(thongTinDatVe);
    //         SwalConfig('Đặt vé thành công', 'success');

    //         dispatch(xoaDanhSachGheDangDat());

    //         const result = await LayDanhSachPhongVeService(id);
    //         dispatch(layDanhSachPhongVe(result.data.content));

    //         const apiNguoiDung = await LayThongTinTaiKhoan();
    //         dispatch(setUserInfor(apiNguoiDung.data.content));
    //         setIsLoading(false);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <div className="min-h-[100vh]">
            <div className="grid grid-cols-12 z-[1] pb-2">
                <div className="col-span-12 xl:col-span-10 2xl:col-span-9">
                    <div className="flex justify-center relative mb-2">
                        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[2] uppercase font-bold tracking-wider text-white">
                            Screen
                        </div>
                        <div className="trapezoid"></div>
                    </div>
                    <div className="text-center">{renderSeats()}</div>
                    <div className="mt-5 md:flex md:justify-center hidden">
                        <table className="divide-y divide-gray-200 w-full">
                            <thead className="bg-gray-50 p-5">
                                <tr>
                                    <th>Ghế đã đặt</th>
                                    <th>Ghế thường</th>
                                    <th>Ghế vip</th>
                                    <th>Ghế đang chọn</th>
                                    <th>Ghế được tài khoản này đặt</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="text-center">
                                    <td>
                                        <button className="ghe gheDaDat">
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </td>
                                    <td><button className="ghe"></button></td>
                                    <td><button className="ghe gheVip"></button></td>
                                    <td><button className="ghe gheDangDat"></button></td>
                                    <td>
                                        <button className="ghe gheDaDuocTaiKhoanNayDat">
                                            <FontAwesomeIcon icon={faUserTag} />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-2 2xl:col-span-3">
                    <h3 className="text-orange-500 text-center text-2xl">
                        {danhSachGheDangDat
                            .reduce((tong, ghe) => tong + ghe.seatPrice, 0)
                            .toLocaleString()}{' '}
                        VND
                    </h3>
                    <hr />
                    <div className="my-5">
                        <h3 className="text-lg mb-2 tracking-wide font-semibold">
                            {thongTinPhim.movieName}
                        </h3>
                        <p className="mb-2">
                            {thongTinPhim.tenCumRap} - {thongTinPhim.tenRap}
                        </p>
                        <p className="mb-2">Địa điểm: {thongTinPhim.diaChi}</p>
                        <p>Ngày chiếu: {thongTinPhim.ngayChieu} </p>
                    </div>
                    <hr />
                    <div className="flex flex-row my-5 items-center">
                        <div className="flex flex-wrap items-center">
                            <span className="text-black font-semibold text-lg">Ghế: </span>
                            {_.sortBy(danhSachGheDangDat, ['seatNumber']).map((item, idx) => (
                                <span
                                    key={idx}
                                    className="mb-2 text-orange-600 font-semibold text-lg mx-1 border-2 px-2 border-orange-100"
                                >
                                    {item.seatNumber}
                                </span>
                            ))}
                        </div>
                    </div>
                    <hr />
                    <div className="my-5">
                        <h2>Email</h2>
                        {thongTinNguoiDung.email}
                    </div>
                    <hr />
                    <div className="my-5">
                        <h2>Phone</h2>
                        {thongTinNguoiDung.phoneNumber}
                    </div>
                    <hr />
                    <div className="mb-0 cursor-pointer">
                        <div
                            onClick={() => {
                                if (danhSachGheDangDat.length === 0) {
                                    return SwalConfig('Vui lòng chọn ghế', 'warning', true);
                                }
                                // else {
                                //     callApiDatVe();
                                // } 
                            }}
                            className="bg-orange-400 hover:bg-orange-600 text-white w-full text-center py-3 font-bold text-xl"
                        >
                            ĐẶT VÉ
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KetQuaDatVe = (thongTinNguoiDung) => {
    const renderTicketItem = () => {
        return thongTinNguoiDung.thongTinDatVe?.map((item, index) => (
            <div key={index} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                    <img
                        alt="team"
                        className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                        src={item.moviePoster}
                    />
                    <div className="flex-grow">
                        <h2 className="text-gray-900 title-font font-medium">
                            {item.movieName}
                        </h2>
                        <h2 className="text-gray-700 title-font font-medium">
                            {_.first(item.danhSachGhe).tenHeThongRap} -{' '}
                            {_.first(item.danhSachGhe).tenCumRap}
                        </h2>
                        <p className="text-gray-500">
                            Ngày đặt: {moment(item.ngayDat).format('DD-MM-YYYY ~ hh:mm A')}
                        </p>
                        <p className="text-gray-500">
                            Thời lượng: {item.thoiLuongPhim} phút
                        </p>
                        <p>
                            Ghế:{' '}
                            {item.danhSachGhe.map((ghe, iGhe) => (
                                <button
                                    key={iGhe}
                                    className="mb-2 text-orange-600 font-semibold text-lg mx-1 px-1 border-orange-100"
                                >
                                    {ghe.seatRow}
                                </button>
                            ))}
                        </p>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-10 mx-auto">
                <div className="flex flex-col text-center w-full mb-10">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 uppercase">
                        lịch sử đặt vé khách hàng
                    </h1>
                </div>
                <div className="flex flex-wrap -m-2">{renderTicketItem()}</div>
            </div>
        </section>
    );
};

const BookingTicketPage = () => {
    const { thongTinNguoiDung } = useSelector((state) => state.UserReducer);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const { param, navigate } = useRoute();

    useEffect(() => {
        if (!getLocalStorage(LOCALSTORAGE_USER)) {
            navigate('/login');
        } else {
            dispatch(callApiThongTinNguoiDung);
            const callApiPhongVe = async () => {
                const result = await LayDanhSachPhongVeService(param.id);
                dispatch(layDanhSachPhongVe(result.data.content));
                setIsLoading(false);
            };
            callApiPhongVe();
        }

        return () => {
            dispatch(xoaDanhSachGheDangDat());
        };
    }, [dispatch, navigate, param.id]);

    const items = [
        {
            label: '01. CHỌN GHẾ & ĐẶT VÉ',
            key: 1,
            children: BookingTicket(thongTinNguoiDung, param.id, setIsLoading)
        },
        {
            label: '02. KẾT QUẢ ĐẶT VÉ',
            key: 2,
            children: KetQuaDatVe(thongTinNguoiDung)
        }
    ];

    return (
        <>
            {isLoading ? (
                <LoadingPage />
            ) : (
                <Tabs
                    className="mt-[6rem] pb-2 min-h-[100vh] booking"
                    items={items}
                />
            )}
        </>
    );
};

export default BookingTicketPage;
