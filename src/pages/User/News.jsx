import React from 'react'
import { Tabs } from 'antd'


export default function News() {
    const dienAnh = () => {
        return <div className='md:my-[3rem] my-[0.5rem] md:w-[80%] mx-auto'>
            <div className='md:flex'>
                <div className='md:w-[50%] p-4'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2020/07/tenet-cong-bo-ngay-khoi-chieu-chinh-thuc-tai-viet-nam-15959320391357.png" alt="" />
                    <div>
                        <h2 className='font-bold text-[15px] my-2'>Thong tin</h2>
                        <p className='text-justify'>Thong tin</p>
                    </div>
                </div>
                <div className='md:w-[50%] p-4'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2020/07/khi-phu-nu-khong-con-o-the-tron-chay-cua-nan-nhan-15943683481617.jpg" alt="" />
                    <div>
                        <h2 className='font-bold text-[15px] my-2'>Thong tin</h2>
                        <p className='text-justify'>Thong tin</p>
                    </div>
                </div>
            </div>
            <div className='md:flex'>
                <div className='p-4 md:w-[33%]'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2020/07/gerard-butler-cung-bo-cu-deadpool-tham-gia-greenland-15937528932506.png" alt="" />
                    <h2 className='font-bold my-2'>Thong tin</h2>
                    <p>Thong tin</p>
                </div>
                <div className='p-4 md:w-[33%]'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2020/07/dien-vien-dac-biet-cua-bang-chung-vo-hinh-15937518743844.png" alt="" />
                    <h2 className='font-bold my-2'>Thong tin</h2>
                    <p>Thong tin</p>
                </div>
                <div className='p-4 md:w-[33%]'>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2020/07/pee-nak-2-van-kiep-thien-thu-di-tu-khong-het-nghiep-15937498464029.png" alt="" />
                        <p>Thong tin</p>
                    </div>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2020/07/loat-phim-kinh-di-khong-the-bo-lo-trong-thang-7-15937470779379.png" alt="" />
                        <p>Thong tin</p>
                    </div>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2020/06/rom-tung-trailer-he-lo-cuoc-song-cua-dan-choi-so-de-15929959532579.jpg" alt="" />
                        <p>Thong tin</p>
                    </div>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2020/06/antebellum-trailer-cuoi-cung-khong-he-lo-bat-cu-thong-tin-gi-them-15929866818923.jpg" alt="" />
                        <p>Thong tin</p>
                    </div>
                </div>
            </div>
        </div>
    }
    const review = () => {
        return <div className='md:my-[3rem] my-[0.5rem] md:w-[80%] mx-auto'>
            <div className='md:flex'>
                <div className='md:w-[50%] p-4'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2020/03/review-nang-3-loi-hua-cua-cha-cau-chuyen-tinh-than-cam-dong-cua-kha-nhu-va-kieu-minh-tuan-15834049872311.jpg" alt="" />
                    <div>
                        <h2 className='font-bold text-[15px] my-2'>[Review] Review</h2>
                        <p className='text-justify'>Review</p>
                    </div>
                </div>
                <div className='md:w-[50%] p-4'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2020/03/review-onward-khi-phep-thuat-manh-me-nhat-chinh-la-tinh-than-15832047938817.jpg" alt="" />
                    <div>
                        <h2 className='font-bold text-[15px] my-2'>[Review] Review</h2>
                        <p className='text-justify'>Review</p>
                    </div>
                </div>
            </div>
            <div className='md:flex'>
                <div className='p-4 md:w-[33%]'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2020/02/review-ke-vo-hinh-con-gi-dang-so-hon-ke-giet-nguoi-benh-hoan-vo-hinh-15828835353362.jpg" alt="" />
                    <h2 className='font-bold my-2'>[Review] Review</h2>
                    <p>Review</p>
                </div>
                <div className='p-4 md:w-[33%]'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2020/02/review-cau-be-ma-2-ban-trai-cua-be-beo-la-day-chu-dau-xa-15823608583110.jpg" alt="" />
                    <h2 className='font-bold my-2'>[Review] Review</h2>
                    <p>Review</p>
                </div>
                <div className='p-4 md:w-[33%]'>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2020/02/review-nhim-sonic-cuoi-tha-ga-cung-chang-nhim-sieu-thanh-lay-loi-15821907793369.jpg" alt="" />
                        <p>[Review] Review</p>
                    </div>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2020/02/review-thang-nam-hanh-phuc-ta-tung-co-buong-bo-chua-bao-gio-la-viec-de-dang-15817967038683.jpg" alt="" />
                        <p>[Review] Review</p>
                    </div>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2020/02/review-sac-dep-doi-tra-huong-giang-ke-chuyen-doi-minh-qua-phim-anh-15817958389162.jpg" alt="" />
                        <p>[Review] Review</p>
                    </div>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2020/02/review-birds-of-prey-15809871977193.jpg" alt="" />
                        <p>[Review] Review</p>
                    </div>
                </div>
            </div>
        </div>
    }
    const promotion = () => {
        return <div className='md:my-[3rem] my-[0.5rem] md:w-[80%] mx-auto'>
            <div className='md:flex'>
                <div className='md:w-[50%] p-4'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2019/10/123phim-nhap-ma-bkt-giam-ngay-20k-khi-dat-ve-bac-kim-thang-15712976725554.jpg" alt="" />
                    <div>
                        <h2 className='font-bold text-[15px] my-2'>[123Phim] KM</h2>
                        <p className='text-justify'>KM</p>
                    </div>
                </div>
                <div className='md:w-[50%] p-4'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2019/08/sinh-nhat-mega-gs-15663933683466.jpg" alt="" />
                    <div>
                        <h2 className='font-bold text-[15px] my-2'>KM</h2>
                        <p className='text-justify'>KM</p>
                    </div>
                </div>
            </div>
            <div className='md:flex'>
                <div className='p-4 md:w-[33%]'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2019/05/123phim-tixshop-tro-lai-qua-xin-hon-xua-15583511037699.jpg" alt="" />
                    <h2 className='font-bold my-2'>[123Phim] KM</h2>
                    <p>KM</p>
                </div>
                <div className='p-4 md:w-[33%]'>
                    <img className='w-full' src="https://s3img.vcdn.vn/123phim/2019/05/galaxy-trang-thi-xem-phim-hay-say-qua-tang-15572160162243.jpg" alt="" />
                    <h2 className='font-bold my-2'>[Beta Xuân Thủy] KM</h2>
                    <p>KM</p>
                </div>
                <div className='p-4 md:w-[33%]'>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2019/04/mua-2-ve-cinestar-qua-zalopay-chi-1-000d-ve-15563607309238.jpg" alt="" />
                        <p>KM</p>
                    </div>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2019/04/123phim-ban-la-fan-cung-marvel-15562538560772.jpg" alt="" />
                        <p>[123Phim] KM</p>
                    </div>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2019/04/galaxy-trang-thi-trai-nghiem-bom-tan-cang-dong-cang-vui-15561704693167.jpg" alt="" />
                        <p>[Beta Xuân Thủy] KM</p>
                    </div>
                    <div className='flex mb-4'>
                        <img className='w-[50px] h-[50px]' src="https://s3img.vcdn.vn/123phim/2019/04/mua-ve-bhd-star-tren-123phim-bang-zalopay-1-000d-ve-15547979641987.jpg" alt="" />
                        <p>KM</p>
                    </div>
                </div>
            </div>
        </div>
    }
    const items = [
        { label: <h2 className='text-[14px] md:text-[18px] uppercase font-medium'>Điện ảnh</h2>, key: 'item-1', children: dienAnh() },
        { label: <h2 className='text-[14px] md:text-[18px] uppercase font-medium'>Review</h2>, key: 'item-2', children: review() },
        { label: <h2 className='text-[14px] md:text-[18px] uppercase font-medium'>Khuyến mãi</h2>, key: 'item-3', children: promotion() },
    ];
    return <div className='news mt-[6rem] h-full '>
        <Tabs centered items={items} />
    </div>;
}
