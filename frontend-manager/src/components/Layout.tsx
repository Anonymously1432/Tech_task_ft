import { Outlet } from 'react-router-dom'
import Nav from './Nav'

export default function Layout() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: 'calc(100vh - 60px)', padding: '1.5rem 0' }}>
        <Outlet />
      </main>
    </>
  )
}
