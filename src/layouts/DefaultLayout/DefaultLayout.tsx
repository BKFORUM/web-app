import Header from '@layouts/components/Header'
import Sidebar from '@layouts/components/Sidebar'
import { FC } from 'react'

interface Props {
  children: React.ReactNode
}

const DefaultLayout: FC<Props> = ({ children }): JSX.Element => {
  return (
    <div className="bg-slate-50 min-h-screen wrapper overflow-x-hidden flex flex-col">
      <Header />
      <div className="grid grid-cols-10 flex-1">
        <nav className="col-span-2 bg-slate-100">
          <Sidebar />
        </nav>
        <main className="mt-[60px] col-span-8 bg-slate-200 flex flex-col ">
          {/* <Outlet /> */}
          {children}
        </main>
      </div>
    </div>
  )
}

export default DefaultLayout
