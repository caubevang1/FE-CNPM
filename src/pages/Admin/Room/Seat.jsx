import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Form, Input, Descriptions, Divider } from 'antd';
import { LayDanhSachGhe, ThemGhe, XoaGhe, CapNhatGhe } from '../../../services/BookingManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { SwalConfig, confirmSwal } from '../../../utils/config';

const LegendBox = ({ color, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            backgroundColor: color,
            border: '2px solid #fff'
        }} />
        <span>{label}</span>
    </div>
);



const SeatManager = () => {
    const { roomId } = useParams();
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('view');
    const [currentSeat, setCurrentSeat] = useState(null);
    const [form] = Form.useForm();
    useEffect(() => {
        fetchSeats();
    }, [roomId]);


    const fetchSeats = async () => {
        setLoading(true);
        try {
            const res = await LayDanhSachGhe();
            const filteredSeats = res.data.filter(s => String(s.roomId) === String(roomId));
            setSeats(filteredSeats);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (mode, seat = null) => {
        setModalMode(mode);
        setCurrentSeat(seat);
        setModalVisible(true);
        if (mode === 'edit') {
            form.setFieldsValue(seat);
        } else if (mode === 'add') {
            form.resetFields();
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setCurrentSeat(null);
    };

    const handleDelete = async (seat) => {
        const confirmed = await confirmSwal(
            'Bạn có chắc chắn muốn xóa ghế này?',
            'Hành động này không thể hoàn tác',
            'Xóa ghế'
        );
        if (confirmed) {
            try {
                await XoaGhe(seat.seatId);
                SwalConfig('Xóa ghế thành công', 'success', true);
                fetchSeats();
                closeModal();
            } catch {
                SwalConfig('Xóa ghế thất bại', 'error', true);
            }
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (modalMode === 'edit') {
                await CapNhatGhe(currentSeat.seatId, {
                    seatRow: values.seatRow,
                    seatNumber: values.seatNumber,
                    seatType: values.seatType,
                    seatPrice: values.seatPrice,
                    roomId: roomId,
                    seatState: currentSeat?.seatState || false
                });
                SwalConfig('Cập nhật ghế thành công', 'success', true);
            } else {
                await ThemGhe({ ...values, roomId });
                SwalConfig('Thêm ghế thành công', 'success', true);
            }
            fetchSeats();
            closeModal();
        } catch (err) {
            console.error(err);
            SwalConfig('Có lỗi xảy ra, vui lòng thử lại!', 'error', true);
        }
    };

    const renderSeatsGrid = () => {
        if (!seats.length) return <p>Chưa có ghế nào trong phòng này.</p>;
        const rows = [...new Set(seats.map(s => s.seatRow))].sort();
        const maxCol = Math.max(...seats.map(s => Number(s.seatNumber)));
        return (
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 24 }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#ccc',
                        clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 18,
                        letterSpacing: 2
                    }}>
                        SCREEN
                    </div>
                </div>
                {rows.map(row => (
                    <div key={row} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '6px 0'
                    }}>
                        <div style={{ width: 28, fontWeight: 'bold', marginRight: 12 }}>{row}</div>
                        {Array.from({ length: maxCol }, (_, i) => {
                            const seat = seats.find(s => s.seatRow === row && Number(s.seatNumber) === i + 1);
                            if (!seat) return <div key={i} style={{ width: 44, height: 44, margin: 4 }} />;
                            let bg = '#008000';
                            if (seat.seatState) bg = '#ccc';
                            if (seat.seatType.toLowerCase() === 'vip') bg = '#ffd700';
                            if (seat.seatType.toLowerCase() === 'couple') bg = '#ff69b4';
                            return (
                                <button
                                    key={seat.seatId}
                                    style={{
                                        width: 44, height: 44, margin: 4, borderRadius: 6,
                                        background: bg, border: '2px solid #fff', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#000', transition: 'transform 0.2s'
                                    }}
                                    onClick={() => openModal('view', seat)}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {seat.seatNumber}
                                </button>
                            );
                        })}
                    </div>
                ))}
                {/* 🧭 Legend */}
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <LegendBox color="#008000" label="Ghế thường" />
                        <LegendBox color="#ffd700" label="Ghế VIP" />
                        <LegendBox color="#ff69b4" label="Ghế tình yêu" />
                        <LegendBox color="#ccc" label="Ghế đã đặt" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: 32, background: '#f0f2f5', minHeight: '100vh' }}>
            <h2 style={{
                fontWeight: 'bold', marginBottom: 24, color: '#333',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                Quản lý ghế phòng {roomId}
                <Button type="primary" shape="round" onClick={() => openModal('add')}>
                    Thêm ghế mới
                </Button>
            </h2>
            <div style={{
                background: '#fff', padding: 24, borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                {renderSeatsGrid()}
            </div>

            <Modal
                width={600}
                centered
                open={modalVisible}
                footer={null} // ❌ Không dùng footer mặc định
                closable={false} // ❌ Không hiển thị nút [X] mặc định
                maskClosable={false} // ❌ Không đóng khi click ra ngoài
                onCancel={closeModal}
                title={null}
            >
                <div
                    style={{
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                >
                    {/* 🟦 Header */}
                    <div style={{
                        background: '#1890ff',
                        color: '#fff',
                        padding: '16px 24px',
                        fontSize: 20,
                        fontWeight: 600,
                        position: 'relative'
                    }}>
                        {modalMode === 'view'
                            ? `Thông tin ghế ${currentSeat?.seatRow}${currentSeat?.seatNumber}`
                            : (modalMode === 'edit' ? 'Chỉnh sửa ghế' : 'Thêm ghế mới')}
                    </div>

                    {/* 🟨 Body */}
                    <div style={{ background: '#fafafa', padding: 24 }}>
                        {modalMode === 'edit' || modalMode === 'add' ? (
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={currentSeat || { seatType: 'Normal' }}
                                style={{ maxWidth: 480, margin: '0 auto' }}
                            >
                                <Form.Item name="seatRow" label="Hàng ghế" rules={[{ required: true }]}>
                                    <Input placeholder="Ví dụ: A" style={{ borderRadius: 4 }} />
                                </Form.Item>
                                <Form.Item name="seatNumber" label="Số ghế" rules={[{ required: true }]}>
                                    <Input type="number" placeholder="Ví dụ: 1" style={{ borderRadius: 4 }} />
                                </Form.Item>
                                <Form.Item name="seatType" label="Loại ghế" rules={[{ required: true }]}>
                                    <select style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: 4,
                                        border: '1px solid #d9d9d9'
                                    }}>
                                        <option value="Normal">Thường</option>
                                        <option value="VIP">VIP</option>
                                        <option value="Couple">Tình yêu</option>
                                    </select>
                                </Form.Item>
                                <Form.Item name="seatPrice" label="Giá ghế (VND)" rules={[{ required: true }]}>
                                    <Input type="number" placeholder="Ví dụ: 100000" style={{ borderRadius: 4 }} />
                                </Form.Item>
                            </Form>
                        ) : (
                            currentSeat && (
                                <>
                                    <Descriptions
                                        bordered
                                        column={1}
                                        size="small"
                                        style={{ marginBottom: 24 }}
                                        contentStyle={{
                                            background: '#fff',
                                            padding: '12px 16px',
                                            borderRadius: 4
                                        }}
                                    >
                                        <Descriptions.Item label="Hàng">{currentSeat.seatRow}</Descriptions.Item>
                                        <Descriptions.Item label="Số">{currentSeat.seatNumber}</Descriptions.Item>
                                        <Descriptions.Item label="Loại">{currentSeat.seatType}</Descriptions.Item>
                                        <Descriptions.Item label="Giá">{currentSeat.seatPrice.toLocaleString()} VND</Descriptions.Item>
                                        <Descriptions.Item label="Trạng thái">
                                            {currentSeat.seatState ? 'Đã đặt' : 'Còn trống'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </>
                            )
                        )}
                    </div>

                    {/* 🟩 Footer */}
                    <div style={{
                        background: '#fff',
                        padding: '16px 24px',
                        textAlign: 'right',
                        borderTop: '1px solid #e8e8e8'
                    }}>
                        {modalMode === 'view' ? (
                            <>
                                <Button
                                    onClick={() => openModal('edit', currentSeat)}
                                    style={{ marginRight: 8, borderRadius: 4 }}
                                    icon={<FontAwesomeIcon icon={faEdit} />}
                                    type="primary"
                                >
                                    Sửa
                                </Button>
                                <Button
                                    onClick={() => handleDelete(currentSeat)}
                                    style={{ marginRight: 8, borderRadius: 4 }}
                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                    danger
                                >
                                    Xóa
                                </Button>
                                <Button onClick={closeModal} style={{ borderRadius: 4 }}>
                                    Đóng
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={closeModal} style={{ marginRight: 8, borderRadius: 4 }}>
                                    Hủy
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleModalOk}
                                    style={{ borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                                >
                                    {modalMode === 'edit' ? 'Cập nhật' : 'Thêm'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default SeatManager;
