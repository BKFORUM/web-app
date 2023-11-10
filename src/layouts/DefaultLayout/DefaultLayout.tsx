import Header from '@layouts/components/Header'
import Sidebar from '@layouts/components/Sidebar'
import { FC } from 'react'

interface Props {
  children: React.ReactNode
}

const DefaultLayout: FC<Props> = ({ children }): JSX.Element => {
  return (
    <div className=" min-h-screen wrapper overflow-x-hidden flex flex-col bg-slate-300/70">
      <Header />
      <div className="grid grid-cols-10 flex-1">
        <nav className="col-span-2 bg-slate-100 ">
          <Sidebar />
        </nav>
        <main className="mt-[60px] col-span-8  flex flex-col ">{children}</main>
      </div>
    </div>
  )
}

export default DefaultLayout
