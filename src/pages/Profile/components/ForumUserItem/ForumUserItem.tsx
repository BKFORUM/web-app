import { IUserForumResponse } from '@interfaces/IForum'
import TabPanel from '@layouts/components/TabPanel'
import { Box, Tab, Tabs } from '@mui/material'
import { GrUserSettings } from 'react-icons/gr'
import { HiUser } from 'react-icons/hi2'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultImage from '../../../../assets/images/bg-login-default.jpg'

interface Props {
  dataForum: IUserForumResponse[]
  idUser?: string
}

const ForumUserItem: FC<Props> = ({ dataForum, idUser }: Props): JSX.Element => {
  const navigate = useNavigate()
  const [value, setValue] = useState(0)

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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

      <div className="mt-8 px-12">
        <TabPanel
          value={value}
          index={0}>
          <div className="grid grid-cols-2 gap-8 pb-4">
            {dataForum.map((item, index) => {
              if (item.moderator.id === idUser)
                return (
                  <div
                    key={index}
                    onClick={() => navigate('/forums/' + item.id)}
                    className="p-2 rounded-xl flex items-start flex-1 gap-4 shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]
                    transform hover:scale-105 duration-500 ease-in-out cursor-pointer
                    ">
                    <div className="h-20 w-20 rounded-lg overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={item.avatarUrl || defaultImage}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col flex-1 gap-1 mb-auto">
                      <h4 className="text-xl font-semibold pt-0">{item.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.topics.map((data: any, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#E6F0F6] rounded-2xl text-xs">
                            {data?.topic.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          <GrUserSettings className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Moderator</span>
                        </div>
                        <span className="text-sm ml-1">
                          {item._count.users} <span>member</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
            })}
          </div>
        </TabPanel>

        <TabPanel
          value={value}
          index={1}>
          <div className="grid grid-cols-2 gap-6 pb-8">
            {dataForum.map((item, index) => {
              if (item.moderator.id !== idUser)
                return (
                  <div
                    key={index}
                    onClick={() => navigate('/forums/' + item.id)}
                    className="p-2 rounded-xl flex items-start flex-1 gap-4 shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]
                    transform hover:scale-105 duration-500 ease-in-out cursor-pointer
                    ">
                    <div className="h-20 w-20 rounded-lg overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={item.avatarUrl || defaultImage}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col flex-1 gap-1 mb-auto">
                      <h4 className="text-xl font-semibold pt-0">{item.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.topics.map((data: any, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#E6F0F6] rounded-2xl text-xs">
                            {data?.topic.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 ">
                        <HiUser className="w-4 h-4" />
                        <span className="text-sm ">
                          {item._count.users} <span>member</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
            })}
          </div>
        </TabPanel>
      </div>
    </div>
  )
}

export default ForumUserItem
