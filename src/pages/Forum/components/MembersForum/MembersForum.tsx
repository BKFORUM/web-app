import Button from '@components/Button'
import { IUserData } from '@interfaces/IUser'
import {
  forumActionSelector,
  notifyActionSelector,
  userStateSelector,
} from '@store/index'
import { HiUserPlus } from 'react-icons/hi2'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { FC, useEffect, useState } from 'react'
import SearchInput from '@components/SearchInput'
import { HiOutlineXMark } from 'react-icons/hi2'
import { useParams } from 'react-router-dom'
import ModalConfirm from '@components/ModalConfirm'
import AddUserToGroup from '@components/AddUserToGroup'
import { useDebounce } from '@hooks/useDebounce'

interface Props {
  users?: [
    {
      user: IUserData
    },
  ]
  moderator?: IUserData
}

const MembersForum: FC<Props> = ({ users, moderator }: Props): JSX.Element => {
  const { id } = useParams()
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { deleteUserFromForum, addUserToForum } = useStoreActions(forumActionSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const usersList = users?.map((userData: { user: IUserData }) => {
    return userData.user
  })

  const [listUser, setListUser] = useState<IUserData[]>(
    usersList !== undefined ? usersList : [],
  )

  const [userSelected, setUserSelected] = useState<string | undefined>(undefined)
  const [inputSearch, setInputSearch] = useState<string>('')
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [openModalAddUser, setOpenModalAddUser] = useState<boolean>(false)

  const handleDeleteUser = async (): Promise<void> => {
    if (id && userSelected) {
      const res = await deleteUserFromForum({
        id: id,
        userId: userSelected,
        status: 'DELETED',
      })
      if (res) {
        setNotifySetting({
          show: true,
          status: 'success',
          message: 'Delete user forum forum successfully',
        })
        setOpenModalDelete(false)
        const newListUser = listUser.filter((user) => {
          return user.id !== userSelected
        })
        setListUser(newListUser)
      }
    }
  }

  const handleAddUser = async (data: any): Promise<void> => {
    const ListUserId = data?.map((item: IUserData) => item.id)
    console.log({ id: id, userIds: ListUserId })
    if (id) {
      const res = await addUserToForum({ id: id, userIds: ListUserId })
      if (res) {
        setNotifySetting({
          show: true,
          status: 'success',
          message: 'Add user forum forum successfully',
        })
        setListUser([...listUser, ...data])
      }
    }
  }

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }

  const debouncedInputValue = useDebounce(inputSearch, 300)

  useEffect(() => {
    const newListUser = usersList?.filter((user) => {
      return user?.fullName.toLowerCase().includes(inputSearch.toLowerCase())
    })
    setListUser(newListUser || [])
    if (inputSearch === '') {
      setListUser(usersList || [])
    }
  }, [debouncedInputValue])

  return (
    <>
      <div className="p-4 my-4 bg-white min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-base">
            Members <span className="ml-2 font-thin text-sm"> {users?.length}</span>
          </h4>
          {currentUserSuccess?.id === moderator?.id && (
            <Button
              onClick={() => setOpenModalAddUser(true)}
              className="px-4 group overflow-hidden">
              <HiUserPlus className="group-hover:translate-x-[-50px] transition-all duration-300  h-5 w-5 " />
              <span className="translate-x-[10px]  group-hover:translate-x-[-8px] transition-all duration-300 text-sm">
                Add member
              </span>
            </Button>
          )}
        </div>
        <div className="py-6 border-b border-gray-300">
          <SearchInput
            value={inputSearch}
            setValue={handleChangeSearch}
            width="100%"
            size="small"
          />
        </div>

        <div className="py-4 border-b border-gray-300">
          <h4 className="font-medium text-base mb-2">
            Moderator <span className="ml-2 font-thin text-sm">1</span>
          </h4>
          <div className="flex items-center gap-4 hover:bg-gray-200 rounded-md cursor-pointer px-2 py-1 transition-all duration-200">
            <div className="h-12 w-12 overflow-hidden">
              <img
                className="h-full w-full rounded-full border border-gray-300"
                src={moderator?.avatarUrl}
                alt={moderator?.fullName}
              />
            </div>
            <span className="text-base font-semibold">{moderator?.fullName}</span>
          </div>
        </div>

        <div className="py-4 border-b border-gray-300">
          <h4 className="font-medium text-base mb-2">
            Member
            <span className="ml-2 font-thin text-sm">{Number(users?.length) - 1}</span>
          </h4>
          {listUser.map((user, index) => {
            if (user.id !== moderator?.id) {
              return (
                <div
                  key={index}
                  className="mb-0.5 flex items-center justify-between hover:bg-gray-200 rounded-md cursor-pointer px-2 py-1 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden">
                      <img
                        className="h-full w-full rounded-full border border-gray-300"
                        src={user?.avatarUrl}
                        alt={user?.fullName}
                      />
                    </div>
                    <span className="text-base font-semibold">{user?.fullName}</span>
                  </div>
                  {currentUserSuccess?.id === moderator?.id && (
                    <HiOutlineXMark
                      onClick={() => {
                        setUserSelected(user.id)
                        setOpenModalDelete(true)
                      }}
                      className="h-6 w-6 hover:text-red-500"
                    />
                  )}
                </div>
              )
            }
          })}
        </div>
      </div>

      {openModalDelete && (
        <ModalConfirm
          open={openModalDelete}
          handleClose={() => {
            setOpenModalDelete(false)
          }}
          handleDelete={handleDeleteUser}
        />
      )}

      {openModalAddUser && (
        <AddUserToGroup
          isOpen={openModalAddUser}
          setIsOpen={setOpenModalAddUser}
          id={id}
          handleAction={handleAddUser}
        />
      )}
    </>
  )
}

export default MembersForum
