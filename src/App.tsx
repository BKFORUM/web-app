import { Routes, Route } from 'react-router-dom'
import { routerUser } from '@routes/router'
import Login from '@pages/Auth/Login'
import NotFound from '@pages/NotFound'
import ProtectedRoute from '@routes/ProtectedRoute'
import RedirectForum from '@routes/RedirectForum'
import './App.css'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  authActionSelector,
  authStateSelector,
  notifyActionSelector,
  notifyStateSelector,
  userActionSelector,
} from './store'
import Notify from '@components/Notify'
import { useEffect } from 'react'
import ForgotPassword from '@pages/Auth/ForgotPassword'
import NotifyRealtime from '@components/NotifyRealtime'
import socket from '@utils/socket/socketConfig'

function App() {
  const { notifySetting, notifyRealtime } = useStoreState(notifyStateSelector)
  const { setNotifySetting, setNotifyRealtime } = useStoreActions(notifyActionSelector)
  const { getCurrentUser } = useStoreActions(userActionSelector)
  const { accessToken, isLoginSuccess } = useStoreState(authStateSelector)
  const { setAccessToken } = useStoreActions(authActionSelector)
  const auth: any = JSON.parse(String(localStorage.getItem('auth')))

  const getCurrentUserApp = async (): Promise<void> => {
    await getCurrentUser()
  }

  useEffect(() => {
    if (auth) {
      setAccessToken(auth.accessToken)
    }
  }, [auth])

  useEffect(() => {
    if (accessToken) getCurrentUserApp()
  }, [accessToken])

  useEffect(() => {
    console.log(11111)
    const auth: any = JSON.parse(String(localStorage.getItem('auth')))
    if (isLoginSuccess && auth?.accessToken) {
      socket.io.opts.transportOptions = {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        },
      }
      socket.connect()
      socket.on('connect', () => {
        console.log('Socket connected')
      })

      socket.on('connect_error', () => {
        socket.io.opts.transportOptions = {
          polling: {
            extraHeaders: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          },
        }
        socket.connect()
      })
    }
  }, [isLoginSuccess])

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
          path="/auth/login"
          element={
            <RedirectForum>
              <Login />
            </RedirectForum>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <RedirectForum>
              <ForgotPassword />
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

      <NotifyRealtime
        notifyRealtime={notifyRealtime}
        setNotifyRealtime={setNotifyRealtime}
      />
    </>
  )
}

export default App
