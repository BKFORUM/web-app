import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { DATA_SIDEBAR } from '@commom/constants'
import { MdOutlineCalendarMonth } from 'react-icons/md'
import { HiOutlineUserGroup, HiOutlineStar, HiOutlineHome } from 'react-icons/hi2'
import { useLocation, useNavigate } from 'react-router-dom'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import test from '../../../assets/images/test.jpg'

interface IProps {
  // open: boolean
}

const FakeData = [
  {
    id: '0398106c-d356-4143-88a4-48b24bcd5af1',
    name: '20TCLC_DT4',
    image: test,
  },
  {
    id: 2,
    name: 'Việc làm CNTT Đà Nẵng',
    image: test,
  },
  {
    id: 3,
    name: 'Hội fan UI',
    image: test,
  },
  {
    id: 4,
    name: 'Cô đơn không muốn về nhà',
    image: test,
  },
  {
    id: 5,
    name: 'Mày cười nữa đi',
    image: test,
  },
  {
    id: 6,
    name: 'Mày cười nữa đi',
    image: test,
  },
  {
    id: 7,
    name: 'Mày cười nữa đi',
    image: test,
  },
  {
    id: 8,
    name: 'Mày cười nữa đi',
    image: test,
  },
  {
    id: 9,
    name: 'Mày cười nữa đi',
    image: test,
  },

  {
    id: 10,
    name: 'Mày cười nữa đi',
    image: test,
  },
  {
    id: 11,
    name: 'Mày cười nữa đi',
    image: test,
  },
  {
    id: 12,
    name: 'Mày cười nữa đi',
    image: test,
  },
  {
    id: 13,
    name: 'Mày cười nữa đi',
    image: test,
  },
  {
    id: 14,
    name: 'Mày cười nữa đi',
    image: test,
  },
  {
    id: 15,
    name: 'Mày cười nữa đi',
    image: test,
  },
]

const Sidebar: FC<IProps> = (): JSX.Element => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [selected, setSelected] = useState<number | null>(null)
  const [openListForum, setOpenListForum] = useState<boolean>(false)
  const [contentHeight, setContentHeight] = useState(0)
  const [listForum, setListForum] = useState(FakeData)
  const contentRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight
      setContentHeight(height)
    }
  }, [])
  useEffect(() => {
    const routePath = `/${pathname.split('/')[1]}`
    DATA_SIDEBAR.map((item) => {
      if (routePath === item.pathName) {
        setSelected(item.id)
      }
    })
  }, [])
  const _renderIcon = useCallback((icon: string) => {
    let result = null
    switch (icon) {
      case 'home': {
        result = <HiOutlineHome className="inline-block h-6 w-6" />
        break
      }
      case 'friend': {
        result = <HiOutlineUserGroup className="inline-block h-6 w-6" />
        break
      }
      case 'event': {
        result = <HiOutlineStar className="inline-block h-6 w-6" />
        break
      }
      case 'forum': {
        result = <MdOutlineCalendarMonth className="inline-block h-6 w-6" />
        break
      }
    }
    return result
  }, [])
  return (
    <div
      className={`hover:overflow-y-auto overflow-hidden fixed left-0 top-[60px] shadow-[1px_1px_42px_8px_#00000028]`}
      style={{ height: 'calc(100vh - 60px)', width: '305px' }}>
      <ul
        id="side-menu"
        className="w-full float-none flex flex-col font-medium ">
        {DATA_SIDEBAR.map((dataItem: any, index: number) => (
          <li
            className={`relative`}
            key={JSON.parse(JSON.stringify(dataItem)) + index}>
            <a
              className={`flex text-black cursor-pointer `}
              onClick={() => {
                if (selected != dataItem?.id) {
                  setSelected(dataItem?.id)
                  navigate(dataItem?.pathName)
                }
              }}>
              <div
                className={`flex w-full justify-start items-center px-2 py-2.5 
                 ${
                   selected === index
                     ? 'bg-gray-300'
                     : 'hover:bg-gray-200 transition-all duration-200'
                 } `}>
                <div className="ml-[8px]">{_renderIcon(dataItem.icon)}</div>
                <span className={`text-base font-semibold ml-2`}>{dataItem?.name}</span>
              </div>
            </a>
          </li>
        ))}
        <li className={`relative`}>
          <a
            className={`flex text-black cursor-pointer `}
            onClick={() => {
              if (selected != 3) {
                setSelected(3)
              }
              setOpenListForum(!openListForum)
            }}>
            <div
              className={`flex w-full justify-start items-center px-2 py-2.5 
                 ${
                   selected === 3
                     ? 'bg-gray-300'
                     : 'hover:bg-gray-200 transition-all duration-200'
                 } `}>
              <div className="ml-[8px]">{_renderIcon('forum')}</div>
              <span className={`text-base font-semibold ml-2`}>Forum</span>

              <div
                className={`ml-auto transition-all duration-500 ${
                  openListForum && 'rotate-90'
                }`}>
                <PlayArrowIcon sx={{ fontSize: 20 }} />
              </div>
            </div>
          </a>
        </li>

        <div
          className={`overflow-hidden transition-max-height duration-500`}
          style={{ maxHeight: openListForum ? '0' : `${contentHeight}px` }}>
          <ul ref={contentRef}>
            {listForum.map((item) => (
              <li
                key={item.id}
                onClick={() => navigate('/forums/' + item.id)}
                className="flex items-center p-2 pl-4 hover:text-primary-400 cursor-pointer  hover:bg-gray-200 transition-all duration-200 ">
                <div className="flex-shrink-0 h-8 w-8 rounded-xl overflow-hidden mr-2 border border-gray-700 bg-gray-700">
                  <img
                    className="h-full w-full object-cover "
                    src={item.image}
                    alt="logo"
                  />
                </div>
                <p className="text-xs">{item.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </ul>
    </div>
  )
}

export default Sidebar
