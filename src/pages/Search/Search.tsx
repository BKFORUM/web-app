import UserActive from '@components/UserActive'
import { searchStateSelector } from '@store/index'
import { useStoreState } from 'easy-peasy'
import { FC, useState } from 'react'
import PeopleSearch from './components/PeopleSearch'
import ForumSearch from './components/ForumSearch'
import notfound_data from '../../assets/images/notFoundSearch.jpg'

interface Props {}

export interface ICheckNoData {
  isNoPeople: boolean
  isNoForum: boolean
}

const Search: FC<Props> = (): JSX.Element => {
  const { textSearch } = useStoreState(searchStateSelector)
  const [statusShowPeople, setStatusShowPeople] = useState<string>('SHOW_A_FEW')
  const [statusShowForum, setStatusShowForum] = useState<string>('SHOW_A_FEW')
  const [checkNoData, setCheckNoData] = useState<ICheckNoData>({
    isNoPeople: false,
    isNoForum: false,
  })

  const handleSetShowPeople = (status: string) => {
    setStatusShowForum('NONE')
    setStatusShowPeople(status)
  }

  const handleSetShowForum = (status: string) => {
    setStatusShowPeople('NONE')
    setStatusShowForum(status)
  }

  return (
    <>
      <div className="grid grid-cols-10 pt-6 flex-1">
        <div className="col-span-7 ml-32 mr-20 ">
          {statusShowForum !== 'NONE' && (
            <ForumSearch
              textSearch={textSearch}
              statusShowForum={statusShowForum}
              setStatusShowPeople={setStatusShowPeople}
              handleSetShowForum={handleSetShowForum}
              setCheckNoData={setCheckNoData}
            />
          )}
          {statusShowPeople !== 'NONE' && (
            <PeopleSearch
              textSearch={textSearch}
              statusShowPeople={statusShowPeople}
              setStatusShowForum={setStatusShowForum}
              handleSetShowPeople={handleSetShowPeople}
              setCheckNoData={setCheckNoData}
            />
          )}

          {checkNoData.isNoForum && checkNoData.isNoPeople && (
            <div className="w-full flex flex-col gap-2 items-center justify-center mb-6 px-6 py-4 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md z-10">
              <div className="h-60 w-60">
                <img
                  className="h-full w-full"
                  src={notfound_data}
                  alt="not found search"
                />
              </div>
              <span className="font-medium">
                We're sorry. We were not able to find a match
              </span>
            </div>
          )}
        </div>

        <div className="col-span-3 px-4 ">
          <UserActive />
        </div>
      </div>
    </>
  )
}

export default Search
