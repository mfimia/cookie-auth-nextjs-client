import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  Dispatch,
  Fragment,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { Context } from "../context/index";
import { UserActions, UserState } from "../context/types";

const { Item, SubMenu } = Menu;

const TopNav = () => {
  const [currentLink, setCurrentLink] = useState("");

  const {
    state,
    dispatch,
  }: { state: UserState; dispatch: Dispatch<UserActions> } =
    useContext(Context);
  const { user } = state;

  const router = useRouter();

  //   set link to current location when refresh or location changes
  useEffect(() => {
    typeof window !== "undefined" && setCurrentLink(window.location.pathname);
  }, [typeof window !== "undefined" && window.location.pathname]);

  const logoutUser = async () => {
    dispatch({ type: "LOGOUT" } as any);
    window.localStorage.removeItem("user");

    const { data } = await axios.get("/api/auth/logout");
    toast(data.payload);

    router.push("/login");
  };

  return (
    <Menu mode="horizontal" selectedKeys={[currentLink]}>
      <Item
        onClick={(e) => setCurrentLink(e.key)}
        key={"/"}
        icon={<AppstoreOutlined />}
      >
        <Link href={"/"}>
          <a>Home</a>
        </Link>
      </Item>
      {user === null && (
        <Fragment>
          <Item
            onClick={(e) => setCurrentLink(e.key)}
            key={"/login"}
            icon={<LoginOutlined />}
          >
            <Link href={"/login"}>
              <a>Login</a>
            </Link>
          </Item>
          <Item
            onClick={(e) => setCurrentLink(e.key)}
            key={"/register"}
            icon={<UserAddOutlined />}
          >
            <Link href={"/register"}>
              <a>Register</a>
            </Link>
          </Item>
        </Fragment>
      )}
      {user !== null && (
        <SubMenu
          key={user.name}
          icon={<CoffeeOutlined />}
          title={user.name}
          className="float-right"
        >
          <Item key="logout" onClick={logoutUser} icon={<LogoutOutlined />}>
            Logout
          </Item>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
