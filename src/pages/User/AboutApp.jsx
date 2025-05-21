import React from 'react'
import NotFound from '../NotFound'
import { useNavigate } from 'react-router-dom';

export default function AboutApp() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');
    }
    return (
        <>
            <div className='aboutApp hidden md:block'>
                <div className='w-[80%] h-[100vh] mx-auto flex justify-center items-center'>
                    <div className='text-white'>
                        <h2 className='text-white uppercase text-[30px] font-bold'>Website dành cho người yêu điện ảnh</h2>
                        <div className='text-center'>
                            <button onClick={handleClick} className='uppercase py-4 px-8 bg-red-600 font-semibold tracking-wider rounded-lg'>Sử dụng ngay!</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='block md:hidden'>
                <NotFound />
            </div>
        </>
    )
}
