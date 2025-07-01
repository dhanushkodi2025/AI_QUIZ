// src/Components/Layout.jsx
import Header from "./Header";

const Layout = ({ user, children }) => {
  return (
    <>
      <Header user={user} />
      <main>{children}</main>
    </>
  );
};

export default Layout;
