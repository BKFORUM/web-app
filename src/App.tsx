import { Routes, Route } from 'react-router-dom'
import { routerUser } from '@routes/router'
import Login from '@pages/Login'
import NotFound from '@pages/NotFound'
import ProtectedRoute from '@routes/ProtectedRoute'
import RedirectForum from '@routes/RedirectForum'
import './App.css'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { notifyActionSelector, notifyStateSelector, userActionSelector } from './store'
import Notify from '@components/Notify'
import { useEffect } from 'react'

function App() {
  const { notifySetting } = useStoreState(notifyStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const { getCurrentUser } = useStoreActions(userActionSelector)
  const auth: any = JSON.parse(String(localStorage.getItem('auth')))

  const getCurrentUserApp = async (): Promise<void> => {
    await getCurrentUser()
  }

  useEffect(() => {
    if (auth?.accessToken) getCurrentUserApp()
  }, [auth])
  return (
    <>
      <Routes>
        {routerUser.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute>
                  <>
                    <route.layout>
                      <route.element />
                    </route.layout>
                  </>
                </ProtectedRoute>
              }></Route>
          )
        })}
        <Route
          path="/login"
          element={
            <RedirectForum>
              <Login />
            </RedirectForum>
          }
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
      <Notify
        notifySetting={notifySetting}
        setNotifySetting={setNotifySetting}
      />
    </>
  )
}

export default App
