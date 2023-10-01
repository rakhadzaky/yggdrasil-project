import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login"
import DashboardUser from "./pages/DashboardUser/view"
import DetailPerson from "./pages/DetailPerson/view"
import AdminPersonList from "./pages/Admin/PersonLists/view"
import AdminPersonAdd from "./pages/Admin/PersonAdd/view"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/dashboard/:pid',
        element: <DashboardUser />
    },
    {
        path: '/person/:pid',
        element: <DetailPerson />
    },
    {
        path: '/admin',
        children: [
            {
                path: '',
                element: <AdminPersonList />,
            },
            {
                path: 'add',
                element: <AdminPersonAdd />,
            }
        ]
    }
])

export default router