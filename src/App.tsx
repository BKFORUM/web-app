import DefaultLayout from '@layouts/DefaultLayout'
import { Routes, Route } from 'react-router-dom'
import { routerUser } from '@routes/router'
import Login from '@pages/Login'
import NotFound from '@pages/NotFound'
import ProtectedRoute from '@routes/ProtectedRoute'
import RedirectForum from '@routes/RedirectForum'
import './App.css'

function App() {
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
                  <DefaultLayout>
                    <route.element />
                  </DefaultLayout>
                </ProtectedRoute>
              }
            />
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
    </>
  )
}

export default App
