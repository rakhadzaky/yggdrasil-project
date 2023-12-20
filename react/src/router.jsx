import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login"
import DashboardUser from "./pages/DashboardUser/view"
import PreDashboardUser from "./pages/PreDashboardUser/view";
import DetailPerson from "./pages/DetailPerson/view"
import AdminPersonList from "./pages/Admin/PersonLists/view"
import AdminPersonAdd from "./pages/Admin/PersonAdd/view"
import AdminHeadFamilyList from "./pages/Admin/HeadFamilyLists/view"
import AdminRelationForm from "./pages/Admin/PersonRelation/view"

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
        path: '/pre/dashboard',
        element: <PreDashboardUser />,
    },
    {
        path: '/person/:pid',
        element: <DetailPerson />
    },
    {
        path: '/admin',
        children: [
            {
                path: 'person/all-list',
                element: <AdminPersonList />,
            },
            {
                path: 'person/add',
                element: <AdminPersonAdd />,
            },
            {
                path: 'head-of-family/all-list',
                element: <AdminHeadFamilyList />,
            },
            {
                path: 'person/relation/:pid',
                element: <AdminRelationForm />
            }
        ]
    }
])

export default router