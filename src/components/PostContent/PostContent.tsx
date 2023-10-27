import { FC } from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import test from '../../assets/images/test.jpg'
import avatar from '../../assets/images/avatartest.jpg'
import IUImage from '../../assets/images/UI.jpg'
import test666 from '../../assets/images/test666.jpg'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
interface Props {}

const fakeData = {
  dataText: `<p>Hôm nay toi bùn</p>
<p>bùn ơi là bùn&nbsp;</p>
<p><strong>vì người yêu cũ có người yêu mới</strong></p>
`,
  image: [
    {
      file: test,
      name: 'T324R7VB6-U03JWEX3PL1-be69f92899e0-512.jpg',
    },
    {
      file: avatar,
      name: 'T324R7VB6-U03JWEX3PL1-be69f92899e0-512.jpg',
    },
    {
      file: IUImage,
      name: 'T324R7VB6-U03JWEX3PL1-be69f92899e0-512.jpg',
    },
    {
      file: test666,
      name: 'T324R7VB6-U03JWEX3PL1-be69f92899e0-512.jpg',
    },
  ],
}

const PostContent: FC<Props> = (): JSX.Element => {
  return (
    <div>
      <div
        className="px-3"
        dangerouslySetInnerHTML={{
          __html: fakeData.dataText,
        }}
      />
      <div className="py-4">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={(swiper) => console.log(swiper)}
        >
          {fakeData.image.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex  ">
                <img
                  className="m-auto h-[400px] w-a  object-cover"
                  style={{ imageRendering: 'auto' }}
                  src={item.file}
                  alt={item.name}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default PostContent
