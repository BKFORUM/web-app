import { FC } from 'react'
import test from '../../assets/images/avatartest.jpg'
import { HiPencilAlt } from 'react-icons/hi'

interface Props {}

const Profile: FC<Props> = (): JSX.Element => {
  return (
    <>
      <div className="bg-white  px-60 py-8 flex items-center">
        <div className="flex items-center gap-8 border-b border-gray-300 pb-6 flex-1 ">
          <div className="h-40 w-40 overflow-hidden">
            <img
              className="h-full w-full border border-gray-300 rounded-full"
              src={test}
              alt=""
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <h4 className="text-2xl font-semibold mr-4 mb-1">Trương Quang Khang</h4>
              <button className="px-4 py-1 bg-[#E6F0F6] text-black rounded-2xl flex items-center hover:bg-blue-300 transition-all duration-200">
                <HiPencilAlt className="h-6 w-6 mr-2" />
                <span>Edit profile</span>
              </button>
            </div>
            <div>
              <span className="px-4 py-1 bg-[#E6F0F6] rounded-2xl">445 bạn bè</span>
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </>
  )
}

export default Profile
