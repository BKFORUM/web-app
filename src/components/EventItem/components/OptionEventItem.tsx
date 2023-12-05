import { Transition } from '@headlessui/react'
import { useClickOutside } from '@hooks/useClickOutside'
import { IEvent } from '@interfaces/IEvent'
import { FC, Fragment, useState } from 'react'
import {
  HiEllipsisVertical,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2'

interface Props {
  item: IEvent
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDelete?: React.Dispatch<React.SetStateAction<boolean>>
  setRowSelectedEvent?: React.Dispatch<React.SetStateAction<IEvent | undefined>>
}

const OptionEventItem: FC<Props> = ({
  setOpenModal,
  setOpenModalDelete,
  setRowSelectedEvent,
  item,
}): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  let elementRef: any = useClickOutside(() => {
    if (open) {
      setOpen(false)
    }
  })
  return (
    <div className="relative">
      <div
        className="flex text-sm rounded-full focus:outline-none cursor-pointer"
        id="user-menu-button"
        onClick={() => setOpen(!open)}>
        <div className="relative">
          <HiEllipsisVertical className=" h-6 w-6 cursor-pointer" />
        </div>
      </div>
      <Transition
        show={open}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <ul
          ref={elementRef}
          onClick={() => {
            setOpen(!open)
          }}
          className={`absolute rounded right-[-4px] top-[-375%] z-50  bg-white border shadow-md`}
          style={{ width: '8rem' }}>
          <li
            className="list-none flex items-center gap-4 hover:bg-gray-200 cursor-pointer py-2 px-4 transition-all duration-300"
            onClick={() => {
              if (setOpenModal !== undefined) {
                setOpenModal(true)
                setRowSelectedEvent && setRowSelectedEvent(item)
              }
            }}>
            <HiOutlinePencilSquare className="h-6 w-6" />
            <span className="font-semibold">Edit</span>
          </li>

          <li
            className="list-none flex items-center gap-4 hover:bg-gray-200 cursor-pointer py-2 px-4 transition-all duration-300 text-red-500"
            onClick={() => {
              if (setOpenModalDelete !== undefined) {
                setOpenModalDelete(true)
                setRowSelectedEvent && setRowSelectedEvent(item)
              }
            }}>
            <HiOutlineTrash className="h-5 w-5" />
            <span className="font-semibold">Delete</span>
          </li>
        </ul>
      </Transition>
    </div>
  )
}

export default OptionEventItem
