import { useDebounce } from '@hooks/useDebounce'
import { IViewUserAddList } from '@interfaces/IUser'
import { Checkbox } from '@mui/material'
import { userActionSelector, userStateSelector } from '@store/index'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { FC, useEffect, useRef, useState } from 'react'
import notFoundSearch from '../../../../assets/images/notFoundSearch.jpg'
import SearchInput from '@components/SearchInput'

interface Props {
  setValue: any
  errors: any
}

const AddMember: FC<Props> = ({ setValue, errors }: Props): JSX.Element => {
  const { getAllUser } = useStoreActions(userActionSelector)
  const { currentUserSuccess } = useStoreState(userStateSelector)

  const [inputSearch, setInputSearch] = useState<string>('')
  const [data, setData] = useState<IViewUserAddList[]>([])
  const [userSelected, setUserSelected] = useState<IViewUserAddList[]>([])
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const getAllUserNoForumCurrent = async (): Promise<void> => {
    setIsLoading(true)
    const res = await getAllUser({
      search: inputSearch,
      take: 100000000,
    })
    if (res) {
      const data = res?.data
        ?.map((item: IViewUserAddList) => {
          if (item.id !== currentUserSuccess?.id) {
            return {
              ...item,
              checked: userSelected.some((user) => user.id === item.id),
            }
          } else {
            return null
          }
        })
        .filter((item: IViewUserAddList) => item !== null)
      setData(data)
    }
    setIsLoading(false)
  }

  const scrollToLast = () => {
    const lastChildElement = ref.current?.lastElementChild
    lastChildElement?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }

  const handleCheckboxChange = (itemId: string) => {
    setData((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item,
      ),
    )
    const user = userSelected.find((item) => item.id === itemId)
    if (user === undefined) {
      const userTmp = data.find((item) => item.id === itemId)
      if (userTmp) {
        const newUserSelected = [...userSelected, userTmp]
        setUserSelected(newUserSelected)
        const arrayId = newUserSelected.map((item) => item.id)
        setValue('userIds', arrayId)
      }
    } else {
      const updatedUserSelected = userSelected.filter((item) => item.id !== itemId)
      const arrayId = updatedUserSelected.map((item) => item.id)
      setValue('userIds', arrayId)
      setUserSelected(updatedUserSelected)
    }
  }

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

  const debouncedInputValue = useDebounce(inputSearch, 500)

  useEffect(() => {
    getAllUserNoForumCurrent()
  }, [debouncedInputValue])

  useEffect(() => {
    scrollToLast()
  }, [userSelected])
  return (
    <div className="px-3 py-4">
      <SearchInput
        width="100%"
        size="small"
        value={inputSearch}
        setValue={handleChangeSearch}
      />
      <div className="h-28 w-full flex overflow-y-hidden overflow-x-scroll mt-3">
        {userSelected.length === 0 ? (
          <>
            {errors?.userIds ? (
              <span className="m-auto text-center opacity-50 text-red-600">
                {errors?.userIds.message}
              </span>
            ) : (
              <span className="m-auto text-center opacity-50">No user selected</span>
            )}
          </>
        ) : (
          <div
            className="flex gap-2 px-4"
            ref={ref}>
            {userSelected.length > 0 &&
              userSelected?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 items-start  w-20 relative mt-">
                  <div className="h-12 w-12  rounded-full overflow-hidden ml-3">
                    <img
                      src={item.avatarUrl}
                      alt="avatar"
                    />
                    <span
                      onClick={() => handleCheckboxChange(item.id)}
                      className="absolute top-0.5 right-2.5 cursor-pointer text-gray-500 bg-white px-1.5 text-sm rounded-[50%] hover:bg-gray-200 transition-all duration-200 ">
                      X
                    </span>
                  </div>
                  <span className="text-xs text-center">{item?.fullName}</span>
                </div>
              ))}
          </div>
        )}
      </div>
      <div
        className={`flex flex-col gap-1 h-[250px] ${
          data.length > 4 && 'overflow-y-scroll'
        }`}>
        <span className="text-lg font-semibold">List user</span>
        {isLoading && (
          <>
            <div className="animate-pulse flex justify-between items-center rounded-xl py-1.5">
              <div className="flex gap-2 items-center ">
                <div className="h-12 w-12 rounded-full bg-slate-200 ml-3 "></div>
                <div className="h-2 w-[250px] bg-slate-200 rounded mr-2 "></div>
              </div>
              <div className="h-4 w-4 bg-slate-200 rounded mr-2"></div>
            </div>
            <div className="animate-pulse flex justify-between items-center rounded-xl py-1.5">
              <div className="flex gap-2 items-center ">
                <div className="h-12 w-12 rounded-full bg-slate-200 ml-3 "></div>
                <div className="h-2 w-[250px] bg-slate-200 rounded mr-2 "></div>
              </div>
              <div className="h-4 w-4 bg-slate-200 rounded mr-2"></div>
            </div>
            <div className="animate-pulse flex justify-between items-center rounded-xl py-1.5">
              <div className="flex gap-2 items-center ">
                <div className="h-12 w-12 rounded-full bg-slate-200 ml-3 "></div>
                <div className="h-2 w-[250px] bg-slate-200 rounded mr-2 "></div>
              </div>
              <div className="h-4 w-4 bg-slate-200 rounded mr-2"></div>
            </div>
          </>
        )}
        {data.length === 0 && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-40 w-40">
              <img
                className="h-full w-full"
                src={notFoundSearch}
                alt="not found search"
              />
            </div>
            <span>We're sorry. We were not able to find a match</span>
          </div>
        )}
        {!isLoading &&
          data?.map((item, index) => {
            return (
              <div
                key={index}
                className={`flex justify-between items-center cursor-pointer rounded-xl py-1.5 ${
                  item.checked ? 'bg-slate-100' : 'hover:bg-slate-100'
                } `}
                onClick={() => handleCheckboxChange(item.id)}>
                <div className="flex gap-2 items-center">
                  <div>
                    <div className="h-12 w-12 flex-shrink rounded-full border border-gray-400 overflow-hidden ml-3">
                      <img
                        className="h-full w-full object-fill "
                        src={item.avatarUrl}
                        alt="avatar"
                      />
                    </div>
                  </div>
                  <span>
                    {item?.fullName} <span>({item.email})</span>
                  </span>
                </div>

                <Checkbox
                  {...label}
                  checked={item?.checked}
                />
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default AddMember
