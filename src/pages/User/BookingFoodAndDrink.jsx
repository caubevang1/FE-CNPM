import React, { useEffect, useState } from 'react';
import { Card, InputNumber, Button, Row, Col, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LayThongTinFoodAndDrink } from '../../services/BookingManager';
import { DatVe } from '../../services/BookingManager';
import { SwalConfig } from '../../utils/config';

export default function BookingFoodAndDrink() {
    const [foodList, setFoodList] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFoodList = async () => {
            setLoading(true);
            try {
                const stored = JSON.parse(localStorage.getItem('booking_info'));
                console.log('Stored booking info:', stored);
                if (!stored || !stored.cinemaName) {
                    message.error('Không có thông tin rạp để lọc đồ ăn');
                    setLoading(false);
                    return;
                }

                const res = await LayThongTinFoodAndDrink();
                console.log('Dữ liệu món ăn:', res.data);
                const filtered = res.data.filter(item => item.cinemaName === stored.cinemaName);
                setFoodList(filtered);
            } catch (err) {
                console.error('Lỗi khi lấy dữ liệu món ăn:', err);
                message.error('Không thể tải dữ liệu món ăn');
            } finally {
                setLoading(false);
            }
        };

        fetchFoodList();
    }, []);

    const handleQuantityChange = (id, value) => {
        setQuantities(prev => ({ ...prev, [id]: value }));
    };

    const handleDatVe = async () => {
        const stored = JSON.parse(localStorage.getItem('booking_info'));

        if (!stored || !stored.scheduleId || !stored.userId || !stored.seats?.length) {
            return SwalConfig('Thông tin đặt vé không đầy đủ', 'error', true);
        }
        const foodAndDrinks = Object.entries(quantities)
            .filter(([, qty]) => qty > 0)
            .map(([id, quantity]) => ({
                foodAndDrinkId: parseInt(id),
                quantity
            }));

        if (foodAndDrinks.length === 0) {
            return SwalConfig('Vui lòng chọn ít nhất 1 món ăn hoặc thức uống!', 'warning', true);
        }

        const payload = {
            scheduleId: parseInt(stored.scheduleId),
            seats: stored.seats.map(seat => ({ seatScheduleId: seat.seatScheduleId })),
            foodAndDrinks,
            bookingDay: new Date().toISOString()
        };

        console.log('Payload gửi API:', payload);

        try {
            setLoading(true);
            await DatVe(payload);

            setTimeout(() => {
                SwalConfig('Đặt vé + Combo thành công!', 'success');
                localStorage.removeItem('booking_info');
                navigate('/');
            }, 1000);
        } catch (err) {
            console.error(err);
            SwalConfig('Đặt vé thất bại!', 'error');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24, marginTop: 160, fontSize: 36, fontWeight: 700 }}>
                Chọn đồ ăn và thức uống
            </h2>

            <Row gutter={[24, 24]}>
                {foodList.map(item => (
                    <Col key={item.foodAndDrinkId} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            title={item.foodAndDrinkName}
                            bordered={false}
                            style={{
                                borderRadius: 12,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s'
                            }}
                            cover={
                                <img
                                    alt={item.foodAndDrinkName}
                                    src={item.imageFoodAndDrink}
                                    style={{
                                        height: 180,
                                        objectFit: 'cover',
                                        borderTopLeftRadius: 12,
                                        borderTopRightRadius: 12
                                    }}
                                />
                            }
                            extra={
                                <span style={{ fontSize: 16, fontWeight: 600 }}>
                                    {item.foodAndDrinkPrice.toLocaleString()}₫
                                </span>
                            }
                        >
                            <p style={{ marginBottom: 12 }}>
                                <strong>Rạp:</strong> {item.cinemaName}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: 8 }}>Số lượng:</span>
                                <InputNumber
                                    min={0}
                                    value={quantities[item.foodAndDrinkId] || 0}
                                    onChange={value => handleQuantityChange(item.foodAndDrinkId, value)}
                                />
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleDatVe}
                    style={{ padding: '0 32px', fontSize: 16, borderRadius: 6 }}
                >
                    ĐẶT VÉ
                </Button>
            </div>
        </div>
    );
}
