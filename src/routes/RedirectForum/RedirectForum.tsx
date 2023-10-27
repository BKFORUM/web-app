import { Navigate, useLocation } from 'react-router-dom'

interface IProps {
  children: JSX.Element
}

function RedirectForum(props: IProps): JSX.Element {
  const auth = localStorage.getItem('auth')
  const { pathname } = useLocation()

  if (auth && pathname.split('/')[1] === 'login') {
    return <Navigate to="/" />
  }
  return props.children
}

export default RedirectForum
