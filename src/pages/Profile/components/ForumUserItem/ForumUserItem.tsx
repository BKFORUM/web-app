import { ITopic, IUserForumResponse } from '@interfaces/IForum'
import TabPanel from '@layouts/components/TabPanel'
import { Box, Tab, Tabs } from '@mui/material'
import { HiOutlineUser } from 'react-icons/hi'
import { FC, useState } from 'react'
import test from '../../../../assets/images/avatartest.jpg'

interface Props {
  dataForum: IUserForumResponse[]
}

const ForumUserItem: FC<Props> = ({ dataForum }: Props): JSX.Element => {
  const [value, setValue] = useState(0)

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <div className="my-4 bg-white min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
      <Box sx={{ borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          aria-label="basic tabs example">
          <Tab
            label="Moderator"
            {...a11yProps(0)}
          />
          <Tab
            label="Member"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>

      <div className="mt-4 px-4">
        <TabPanel
          value={value}
          index={0}>
          <div className="grid grid-cols-2 gap-4 pb-4">
            {dataForum.map((item, index) => (
              <div
                key={index}
                className="p-3 border border-gray-400 rounded-xl flex items-start flex-1 gap-4">
                <div className="h-20 w-20 rounded-lg overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={test}
                    alt=""
                  />
                </div>
                <div className="flex flex-col flex-1 gap-1 mb-auto">
                  <h4 className="text-xl font-semibold pt-0">{item.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.topics.map((data: any, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#E6F0F6] rounded-2xl text-sm">
                        {data?.topic.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineUser className="w-5 h-5" />
                    <span className="font-thin text-sm">
                      {item._count.users} <span>member</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>

        <TabPanel
          value={value}
          index={1}>
          <div>bbbbb</div>
        </TabPanel>
      </div>
    </div>
  )
}

export default ForumUserItem
