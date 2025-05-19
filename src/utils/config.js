import Swal from 'sweetalert2'

const getLocalStorage = (key) => {
    const raw = localStorage.getItem(key);
    if (!raw) {
        // không thấy key ⇒ trả về null
        return null;
    }
    try {
        // parse 1 lần
        return JSON.parse(raw);
    } catch (error) {
        // nếu parse lỗi (người dùng tự sửa LS)
        console.error('Parse localStorage lỗi:', error);
        removeLocalStorage(key);
        return null;
    }

}

const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

const removeLocalStorage = (key) => {
    localStorage.removeItem(key)
}

// ------------------- 

const SwalConfig = (title, icon, showConfirmButton, timer) => {
    return Swal.fire({
        icon,
        title,
        showConfirmButton,
        timer: timer ? timer : 1500,
        position: 'center',
        confirmButtonColor: '#f97316',
    })
}

const confirmSwal = async (title = 'Bạn chắc chắn?', text = 'Hành động này không thể hoàn tác', confirmText = 'Xác nhận') => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#f97316',
        cancelButtonColor: '#d33',
    });
    return result.isConfirmed;
};


export { getLocalStorage, setLocalStorage, removeLocalStorage, SwalConfig, confirmSwal };