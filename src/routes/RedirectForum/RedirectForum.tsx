import { Navigate, useLocation } from 'react-router-dom'

interface IProps {
  children: JSX.Element
}

function RedirectForum(props: IProps): JSX.Element {
  const user = localStorage.getItem('user')
  const { pathname } = useLocation()

  if (user && pathname.split('/')[1] === 'login') {
    return <Navigate to='/forum-management' />
  }
  return props.children
}

export default RedirectForum
