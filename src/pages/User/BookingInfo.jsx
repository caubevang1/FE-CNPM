import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callApiThongTinBooking } from '../../redux/reducers/UserReducer';
import moment from 'moment';
import { LayThongTinFoodAndDrinkChiTiet, LayDanhSachGheSchedule } from '../../services/BookingManager';

const ThongTinBooking = () => {
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.UserReducer.bookings);
    const [foodDetails, setFoodDetails] = useState({});
    const [seatDetails, setSeatDetails] = useState({});

    useEffect(() => {
        dispatch(callApiThongTinBooking);
    }, [dispatch]);

    useEffect(() => {
        const fetchFoodDetails = async () => {
            const foodAndDrinkIds = new Set();
            bookings.forEach(booking => {
                booking.foodAndDrinks.forEach(item => {
                    foodAndDrinkIds.add(item.foodAndDrinkId);
                });
            });

            const foodDetailsMap = {};
            for (let id of foodAndDrinkIds) {
                try {
                    const response = await LayThongTinFoodAndDrinkChiTiet(id);
                    foodDetailsMap[id] = response.data;
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin món ăn/thức uống:", error);
                }
            }

            setFoodDetails(foodDetailsMap);
        };

        fetchFoodDetails();
    }, [bookings]);

    useEffect(() => {
        const fetchSeatDetails = async () => {
            try {
                const response = await LayDanhSachGheSchedule();
                const seatDetailsMap = {};
                response.data.forEach(seat => {
                    seatDetailsMap[seat.seatScheduleId] = `${seat.seatNumber}${seat.seatRow}`;
                });

                setSeatDetails(seatDetailsMap);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin ghế:", error);
            }
        };

        fetchSeatDetails();
    }, []);

    const styles = {
        container: {
            padding: '30px',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: '#2c3e50',
            backgroundColor: '#f4f6f8'
        },
        bookingItem: {
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
        },
        movieName: {
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '15px',
            color: '#37474f'
        },
        section: {
            marginBottom: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: '15px',
            lineHeight: '1.6'
        },
        label: {
            fontWeight: 'bold',
            marginRight: '6px',
            minWidth: '120px'
        },
        value: {
            flex: 1
        },
        seat: {
            display: 'inline-block',
            backgroundColor: '#e3f2fd',
            color: '#1565c0',
            padding: '6px 12px',
            marginRight: '10px',
            marginBottom: '6px',
            borderRadius: '8px',
            fontSize: '14px',
            border: '1px solid #90caf9'
        },
        foodItem: {
            fontSize: '14px',
            marginBottom: '6px',
            paddingLeft: '10px'
        },
        totalPrice: {
            marginTop: '15px',
            fontWeight: 'bold',
            color: '#d32f2f',
            fontSize: '16px',
            borderTop: '1px dashed #ccc',
            paddingTop: '10px'
        }
    };

    return (
        <div style={styles.container}>
            {bookings.length === 0 ? (
                <p style={styles.noBookingMessage}>Không có thông tin booking nào</p>
            ) : (
                bookings.map((booking, index) => (
                    <div key={index} style={styles.bookingItem}>
                        <h3 style={styles.movieName}>{booking.movieName}</h3>

                        <div style={styles.section}>
                            <span style={styles.label}>Rạp:</span>
                            <span style={styles.value}>{booking.cinemaName}</span>
                        </div>
                        <div style={styles.section}>
                            <span style={styles.label}>Phòng chiếu:</span>
                            <span style={styles.value}>{booking.roomName}</span>
                        </div>
                        <div style={styles.section}>
                            <span style={styles.label}>Ngày đặt:</span>
                            <span style={styles.value}>{moment(booking.bookingDay).format('DD/MM/YYYY HH:mm')}</span>
                        </div>

                        <div style={styles.section}>
                            <span style={styles.label}>Ghế:</span>
                            <span style={styles.value}>
                                {booking.seats.map((seat, idx) => (
                                    <div key={idx} style={{ marginBottom: '5px' }}>
                                        <span style={{ ...styles.seat }}>
                                            {seatDetails[seat.seatScheduleId] || 'Không có thông tin ghế'}
                                        </span>
                                        <span> - Giá: {seat.price.toLocaleString()} VND</span>
                                    </div>
                                ))}
                            </span>
                        </div>

                        <div style={styles.section}>
                            <span style={styles.label}>Đồ ăn/Thức uống:</span>
                            <span style={styles.value}>
                                {booking.foodAndDrinks.length === 0 ? (
                                    <span>Không có</span>
                                ) : (
                                    booking.foodAndDrinks.map((item, idx) => (
                                        <div key={idx} style={styles.foodItem}>
                                            <span>{item.quantity} x {foodDetails[item.foodAndDrinkId]?.foodAndDrinkName || 'Không có thông tin'} ({item.price.toLocaleString()} VND)</span>
                                        </div>
                                    ))
                                )}
                            </span>
                        </div>

                        <div style={styles.totalPrice}>
                            Tổng cộng: {booking.price.toLocaleString()} VND
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ThongTinBooking;
