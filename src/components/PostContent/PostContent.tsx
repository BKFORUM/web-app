import { FC } from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { IDocuments } from '@interfaces/IPost'
interface Props {
  content: string
  images: IDocuments[]
}

const PostContent: FC<Props> = ({ content, images }: Props): JSX.Element => {
  return (
    <div>
      <div
        className="px-3"
        dangerouslySetInnerHTML={{
          __html: content,
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
          {images?.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex  ">
                <img
                  className="m-auto h-[400px] w-a  object-cover"
                  style={{ imageRendering: 'auto' }}
                  src={item.fileUrl}
                  alt={item.fileName}
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
