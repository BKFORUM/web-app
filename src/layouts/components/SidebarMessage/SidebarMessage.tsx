import SearchInput from '@components/SearchInput'
import { FC, useState, useEffect } from 'react'
import avatartest from '../../../assets/images/test666.jpg'
import { useNavigate } from 'react-router-dom'

interface Props {}

const fakeData = [
  {
    id: 1,
    name: 'Trương Quang Khang',
    image: avatartest,
    isOnline: false,
  },
  {
    id: 2,
    name: 'Nguyễn Văn Thịnh',
    image: avatartest,
    isOnline: true,
  },
  {
    id: 3,
    name: '20TCLC_DT4',
    image: avatartest,
    isOnline: false,
  },
  {
    id: 4,
    name: 'Nguyễn Phạm Nam Anh',
    image: avatartest,
    isOnline: true,
  },
  {
    id: 5,
    name: 'Nguyễn Thành Đạt',
    image: avatartest,
    isOnline: true,
  },
]

const SidebarMessage: FC<Props> = (): JSX.Element => {
  useEffect(() => {
    // console.log('test')
  }, [])
  const navigate = useNavigate()
  const [inputSearch, setInputSearch] = useState<string>('')

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }
  return (
    <div className="flex flex-col ">
      <h2 className="px-3 py-2 text-2xl font-bold">Chat</h2>
      <div className="px-3">
        <SearchInput
          value={inputSearch}
          setValue={handleChangeSearch}
          width="100%"
          size="small"
        />
      </div>
      <ul className="flex flex-col mt-4 gap-1 ">
        {fakeData.map((item, index) => (
          <li
            key={index}
            onClick={() => navigate('/message/' + item.id)}
            className="relative group list-none px-2 ">
            <a className="relative block w-full py-1.5 px-2  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200 ">
              <img
                className="h-12 w-12 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
                src={item.image}
                alt="avatar"
              />
              {item.isOnline && (
                <span
                  title="online"
                  className="flex justify-center absolute left-11 bottom-2  text-center bg-green-500 border border-white w-[10px] h-[10px] rounded-full"></span>
              )}
              <span className="font-semibold">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SidebarMessage
