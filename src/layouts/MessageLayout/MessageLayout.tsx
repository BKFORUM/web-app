import Header from '@layouts/components/Header'
import SidebarMessage from '@layouts/components/SidebarMessage/'
import { FC } from 'react'

interface Props {
  children: React.ReactNode
}

const MessageLayout: FC<Props> = ({ children }): JSX.Element => {
  return (
    <div className=" min-h-screen wrapper overflow-x-hidden flex flex-col">
      <Header />
      <div className=" mt-[60px] grid grid-cols-10 flex-1 border-r border-gray-500">
        <nav className="col-span-2  border-r border-gray-300   ">
          <SidebarMessage />
        </nav>
        <main className="col-span-8 bg-slate-200 flex flex-col flex-1 ">{children}</main>
      </div>
    </div>
  )
}

export default MessageLayout
