import { NavLink, Outlet } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    SnippetsOutlined,
    FileAddOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { removeLocalStorage } from '../../utils/config';
import { LOCALSTORAGE_USER } from '../../utils/constant';
import useRoute from '../../hooks/useRoute';
import { LayThongTinTaiKhoan } from '../../services/UserService';
import LoadingPage from '../../pages/LoadingPage';
import NotFound from '../../pages/NotFound';
import popcornImg from '../../assets/img/popcorn2.png';

const { Header, Sider, Content } = Layout;

export default function AdminTemplate() {
    const [collapsed, setCollapsed] = useState(false);
    const { navigate } = useRoute();
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await LayThongTinTaiKhoan();
                const userData = res.data?.body || res.data?.content || res.data;

                // Kiểm tra role có phải là admin không
                const isAdmin = userData.roles?.some(role => role.name === 'ADMIN');

                if (!isAdmin) {
                    navigate('/notfound');
                } else {
                    setUserInfo(userData);
                    setIsLoading(false);
                }
            } catch (error) {
                removeLocalStorage(LOCALSTORAGE_USER);
                navigate('/notfound');
            }
        };

        fetchUserInfo();
    }, [navigate]);

    return (
        <>
            {isLoading ? (
                <LoadingPage />
            ) : (
                <>
                    <div className='hidden xl:block'>
                        <Layout className='min-h-screen'>
                            <Sider trigger={null} collapsible collapsed={collapsed}>
                                <NavLink to='/' className="flex items-center justify-center p-2">
                                    <img
                                        src={popcornImg}
                                        alt="Popcorn"
                                        className="w-[65px] h-[65px] object-cover rounded-full"
                                    />
                                </NavLink>
                                <Menu
                                    theme="dark"
                                    mode="inline"
                                    items={[
                                        {
                                            key: '1',
                                            icon: <UserOutlined />,
                                            label: <NavLink to='user'>User Manager</NavLink>
                                        },
                                        {
                                            key: '2',
                                            icon: <SnippetsOutlined />,
                                            label: 'Film',
                                            children: [
                                                {
                                                    key: '21',
                                                    icon: <SnippetsOutlined />,
                                                    label: <NavLink to='film'>Film Manager</NavLink>,
                                                },
                                                {
                                                    key: '22',
                                                    icon: <FileAddOutlined />,
                                                    label: <NavLink to='film/addnewfilm'>Add Film</NavLink>,
                                                },
                                            ]
                                        },
                                        {
                                            key: '3',
                                            icon: <SnippetsOutlined />,
                                            label: 'Cinema',
                                            children: [
                                                {
                                                    key: '23',
                                                    icon: <SnippetsOutlined />,
                                                    label: <NavLink to='cinema'>Cinema Manager</NavLink>,
                                                },
                                                {
                                                    key: '24',
                                                    icon: <FileAddOutlined />,
                                                    label: <NavLink to='/admin/cinema/addnewcinema'>Add Cinema</NavLink>,
                                                },
                                            ]
                                        },
                                        {
                                            key: '4',
                                            icon: <SnippetsOutlined />,
                                            label: 'Room',
                                            children: [
                                                {
                                                    key: '25',
                                                    icon: <SnippetsOutlined />,
                                                    label: <NavLink to='room'>Room Manager</NavLink>,
                                                },
                                                {
                                                    key: '26',
                                                    icon: <FileAddOutlined />,
                                                    label: <NavLink to='/admin/room/addnewroom'>Add Room</NavLink>,
                                                },
                                            ]
                                        },
                                    ]}
                                />
                            </Sider>
                            <Layout className="site-layout">
                                <Header className="site-layout-background pl-4 text-[1.8rem]">
                                    {React.createElement(
                                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                                        {
                                            className: 'trigger',
                                            onClick: () => setCollapsed(!collapsed),
                                        }
                                    )}
                                </Header>
                                <Content
                                    className="site-layout-background contentAdmin"
                                    style={{
                                        margin: '24px 16px',
                                        padding: 24,
                                        minHeight: 500,
                                    }}
                                >
                                    <Outlet context={userInfo} />
                                </Content>
                            </Layout>
                        </Layout>
                    </div>

                    <div className="block xl:hidden">
                        <NotFound />
                    </div>
                </>
            )}
        </>
    );
}
