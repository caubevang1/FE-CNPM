import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faXmark, faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { Drawer, Space, Tooltip, Dropdown, Menu } from 'antd';
import { getLocalStorage, removeLocalStorage, SwalConfig } from '../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import { setStatusLogin } from '../../redux/reducers/UserReducer';
import { LOCALSTORAGE_USER } from '../../utils/constant';
import popcornImg from '../../assets/img/popcorn2.png';
import { LayThongTinTaiKhoan } from '../../services/UserService';

const Header = () => {
    const navBarRef = useRef(null);
    const isLogin = useSelector(state => state.UserReducer.isLogin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [accountInfo, setAccountInfo] = useState(null);
    const user = getLocalStorage(LOCALSTORAGE_USER);

    useEffect(() => {
        if (user) {
            dispatch(setStatusLogin(true));
        }

        const handleScroll = () => {
            if (window.scrollY > 50) {
                if (navBarRef.current) {
                    navBarRef.current.style.background = 'rgb(255 255 255 / 80%)';
                }
            } else {
                if (navBarRef.current) {
                    navBarRef.current.style.background = '#fff';
                }
            }
        };

        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [dispatch, user]);

    useEffect(() => {
        if (isLogin) {
            LayThongTinTaiKhoan()
                .then(res => setAccountInfo(res.data))
                .catch(err => console.error("Lỗi lấy thông tin tài khoản:", err));
        }
    }, [isLogin]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Bạn có muốn đăng xuất không ?',
            showDenyButton: true,
            confirmButtonText: 'Đồng ý',
            denyButtonText: 'Hủy',
            icon: 'question',
            iconColor: 'rgb(104 217 254)',
            confirmButtonColor: '#f97316'
        }).then((result) => {
            if (result.isConfirmed) {
                SwalConfig('Đã đăng xuất', 'success', false);
                removeLocalStorage(LOCALSTORAGE_USER);
                dispatch(setStatusLogin(false));
                navigate('/');
            }
        });
    };

    const UserProfile = ({ user, accountInfo }) => {
        const avatarUrl = accountInfo?.body?.avatar || `https://i.pravatar.cc/150?u=${user?.username}`;

        const menu = (
            <Menu>
                <Menu.Item key="1" icon={<FontAwesomeIcon icon={faUser} />} onClick={() => navigate('/inforUser')}>
                    Thông tin tài khoản
                </Menu.Item>
                <Menu.Item key="2" icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />} onClick={handleLogout}>
                    Đăng xuất
                </Menu.Item>
            </Menu>
        );

        return (
            <Dropdown overlay={menu} placement="bottom" arrow>
                <div className="cursor-pointer flex items-center space-x-2">
                    <div className="relative bg-transparent rounded-full">
                        <img
                            src={avatarUrl}
                            alt="User Avatar"
                            className="w-[60px] h-[60px] mr-[40px] rounded-full  bg-transparent"
                        />
                    </div>
                </div>
            </Dropdown>
        );
    };

    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

    return (
        <>
            <Drawer
                title="Nhóm 13"
                placement='left'
                closable={false}
                onClose={onClose}
                open={open}
                width='300px'
                key='left'
                extra={
                    <Space>
                        <FontAwesomeIcon className='cursor-pointer' onClick={onClose} icon={faXmark} />
                    </Space>
                }
            >
                <div>
                    {isLogin ? (
                        <>
                            <UserProfile user={user} accountInfo={accountInfo} />
                        </>
                    ) : (
                        <>
                            <div className='text-gray-500 hover:text-red-600 flex items-center mb-4'>
                                <FontAwesomeIcon className='w-5 h-5 mr-1' icon={faCircleUser} />
                                <NavLink to='login' className='text-base font-semibold text-gray-500 hover:text-red-600'>Đăng Nhập</NavLink>
                            </div>
                            <div className='text-gray-500 hover:text-red-600 flex items-center mb-4'>
                                <FontAwesomeIcon className='w-5 h-5 mr-1' icon={faCircleUser} />
                                <NavLink to='register' className='text-base font-semibold text-gray-500 hover:text-red-600'>Đăng Ký</NavLink>
                            </div>
                        </>
                    )}
                </div>
                <hr />
                <ul className="list-reset justify-center flex-1 items-center mt-2">
                    <li className="mr-3">
                        <NavLink to='/' className="block py-2 px-4 text-black font-medium text-base hover:text-red-600 no-underline">Danh sách phim</NavLink>
                    </li>
                    <li className="mr-3">
                        <NavLink className="block no-underline text-black font-medium text-base hover:text-red-600 hover:text-underline py-2 px-4" to='news'>Tin tức</NavLink>
                    </li>
                </ul>
            </Drawer>

            <header className="bg-gray-400 font-sans leading-normal tracking-normal">
                <nav style={{ borderBottom: '1px solid #c1c0c04a' }} ref={navBarRef} id='navBarHeader' className="transition-all duration-500 flex items-center justify-between flex-wrap bg-white py-2 px-4 fixed w-full z-10 top-0">
                    <div className="flex items-center flex-shrink-0 text-white mr-4">
                        <NavLink to='/' aria-label="Back to homepage" className="flex items-center">
                            <img src={popcornImg} alt="Popcorn" className="w-[65px] h-[65px] object-cover rounded-full" />
                            <span className='text-xl font-medium text-orange-500 sm:text-2xl'>Nhóm 13</span>
                        </NavLink>
                    </div>
                    <div className="block lg:hidden">
                        <button onClick={showDrawer} id="nav-toggle" className="flex items-center px-3 py-2 border rounded text-gray-500 border-orange-500">
                            <svg className="fill-current h-4 w-4 text-orange-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <title>Menu</title>
                                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                            </svg>
                        </button>
                    </div>
                    <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden pt-3 lg:pt-0" id="nav-content">
                        <ul className="list-reset lg:flex justify-center flex-1 items-center mb-0">
                            <li className="mr-3">
                                <Link to='/#movie-list' className="inline-block py-2 px-4 text-black font-medium md:text-base hover:text-red-600 no-underline">Phim</Link>
                            </li>
                            <li className="mr-3">
                                <Link className="inline-block no-underline text-black font-medium md:text-base hover:text-red-600 hover:text-underline py-2 px-4" to="/#menuCinema">Cụm rạp</Link>
                            </li>
                            <li className="mr-3">
                                <NavLink className="inline-block no-underline text-black font-medium md:text-base hover:text-red-600 hover:text-underline py-2 px-4" to='news'>Tin tức</NavLink>
                            </li>
                            <li className="mr-3">
                                <NavLink className="inline-block no-underline text-black font-medium md:text-base hover:text-red-600 hover:text-underline py-2 px-4" to='aboutapp'>Ứng dụng</NavLink>
                            </li>
                        </ul>
                        <div className='flex text-gray-500'>
                            {isLogin ? (
                                <UserProfile user={user} accountInfo={accountInfo} />
                            ) : (
                                <>
                                    <NavLink to='login' className='mr-2 text-gray-500 hover:text-red-600 text-sm font-semibold border-orange-500 border-2 py-2 px-3 rounded-lg'>Đăng Nhập</NavLink>
                                    <NavLink to='register' className="text-gray-500 hover:text-red-600 text-sm font-semibold py-2 px-3 rounded-lg">Đăng Ký</NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Header;