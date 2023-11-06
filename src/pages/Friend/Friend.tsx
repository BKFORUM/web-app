import UserActive from '@components/UserActive'
import TabPanel from '@layouts/components/TabPanel'
import { Box, Tab, Tabs } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import FriendMe from './components/FriendMe/FriendMe'
import RequestFriend from './components/RequestFriend'
import SearchFriend from './components/SearchFriend'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { friendActionSelector, userStateSelector } from '@store/index'

interface Props {}

const Friend: FC<Props> = (): JSX.Element => {
  const { getFriendMe, setListFriendMe } = useStoreActions(friendActionSelector)
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const [value, setValue] = useState(0)

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }
  const getAllFriendMe = async (): Promise<void> => {
    await getFriendMe()
  }

  useEffect(() => {
    setListFriendMe([])
    getAllFriendMe()
  }, [currentUserSuccess?.id])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <div className="grid grid-cols-10 py-6 flex-1">
      <div className="col-span-7 ml-28 mr-20 ">
        <div className="min-h-[200px] relative flex-1 flex flex-col gap-2 px-6 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
          <Box sx={{ borderColor: 'divider', width: '100%', mt: 3 }}>
            <Tabs
              centered
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example">
              <Tab
                sx={{ textTransform: 'none' }}
                label="Bạn bè"
                {...a11yProps(0)}
              />
              <Tab
                sx={{ textTransform: 'none' }}
                label="Lời mời kết bạn"
                {...a11yProps(1)}
              />
              <Tab
                sx={{ textTransform: 'none' }}
                label="Tìm kiếm bạn bè"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>

          <TabPanel
            value={value}
            index={0}>
            <FriendMe />
          </TabPanel>

          <TabPanel
            value={value}
            index={1}>
            <RequestFriend />
          </TabPanel>

          <TabPanel
            value={value}
            index={2}>
            <SearchFriend />
          </TabPanel>
        </div>
      </div>

      <div className="col-span-3 px-4 ">
        <UserActive />
      </div>
    </div>
  )
}

export default Friend
