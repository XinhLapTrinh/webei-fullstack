import AdminPage from "../pages/Admin/AdminPage";
import CartPage from "../pages/CartPage/CartPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SearchResultsPage from "../pages/SearchResultsPage/SearchResultsPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import PrivateRoute from './PrivateRoute'
import RoleRoute from "./RoleRoute";

export const routes = [
    
    {
        path: "/admin/*",
        page: () => (
             <RoleRoute allowedRoles={['admin','editor']}>
                <AdminPage />
            </RoleRoute>
            ),
        isShowHeader: false, // không hiển thị Header chính
    },
    {
        path : '/',
        page : HomePage,
        isShowHeader: true

    },
    {
        path : '/order',
       page: () => (
            <PrivateRoute>
                <OrderPage />
            </PrivateRoute>
    ),
        isShowHeader: true

    },
    {
        path : '/cart',
        page: () => (
            <PrivateRoute>
                <CartPage />
            </PrivateRoute>
    ),
        isShowHeader: true

    },
    {
        path : '/products',
        page : ProductsPage,
        isShowHeader: true

    },
    {
        path : '/type/:category',
        page : TypeProductPage,
        isShowHeader: true
    },
    {
        path : '/sign-in',
        page : SignInPage,
        isShowHeader: true

    },
    {
        path : '/sign-up',
        page : SignUpPage,
        isShowHeader: true

    },
    {
        path: '/product-details/:id',
        page : ProductDetailsPage,
        isShowHeader: true

    },
    {
    path: '/profile',
    page: () => (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
    isShowHeader: true,
  },
  {
    path: "/search",
    page: SearchResultsPage,
    isShowHeader: true,
  },
    {
        path : '*',
        page: NotFoundPage,
        isShowHeader: true
    }
]
