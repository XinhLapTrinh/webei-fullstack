import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; // ✅ Thêm AuthProvider nếu chưa
import ZaloFloatingButton from "./components/ZaloFloatingButton/ZaloFloatingButton";

export default function App() {
  return (
    <Router>
      <div>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {routes.map((route) => {
                const Page = route.page;
                const Layout = route.isShowHeader ? DefaultComponent : Fragment;

                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              })}
            </Routes>
            <ZaloFloatingButton phone="0989671511"/>
          </CartProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}


// import React, { Fragment } from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { routes } from './routes'
// import DefaultComponent from './components/DefaultComponent/DefaultComponent'
// import { CartProvider } from './context/CartContext';

// export default function App() {
//   return (
//     <Router>
//       {/* ✅ Chừa chỗ trống cho Header */}
//       <div style={{ marginTop: "70px" }}>
//         <CartProvider>
//           <Routes>
//             {
//               routes.map((route) => {
//                 const Page = route.page;
//                 const Layout = route.isShowHeader ? DefaultComponent : Fragment;
//                 return (
//                   <Route
//                     key={route.path}
//                     path={route.path}
//                     element={
//                       <Layout>
//                         <Page />
//                       </Layout>
//                     }
//                   />
//                 );
//               })
//             }
//           </Routes>
//         </CartProvider>
//       </div>
//     </Router>
//   );
// }
