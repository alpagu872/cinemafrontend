import React from "react";
import { NavLink } from "react-router-dom";
import { MenuItem, Menu } from "semantic-ui-react";
import {useSelector} from "react-redux";
import {selectUser} from "../services/userSlice";

export default function Categories() {
    const userState = useSelector(selectUser);
    const user = userState.user; // Access the nested user object

    return (
        <div>
            <Menu pointing vertical size={"mini"}>

                <MenuItem as={NavLink} to="/movieSelection" name="Bilet Satın Al" />
                <MenuItem as={NavLink} to="/userInfo" name="Profilim" />

                {/* Admin-only */}
                {user?.role === "ADMIN" && (
                    <>
                        <MenuItem as={NavLink} to="/movieList" name="Film Listesi" />
                        <MenuItem as={NavLink} to="/addFilm" name="Film Ekle" />
                        <MenuItem as={NavLink} to="/userList" name="Kullanıcı Listesi" />
                        <MenuItem as={NavLink} to="/showList" name="Gösterim Yönetimi" />
                        <MenuItem as={NavLink} to="/bookingList" name="Rezervasyon Yönetimi" />
                        <MenuItem as={NavLink} to="/ticketList" name="Bilet Yönetimi" />
                        <MenuItem as={NavLink} to="/theatreList" name="Salon Yönetimi" />
                        <MenuItem as={NavLink} to="/screenList" name="Ekran Yönetimi" />
                    </>
                )}

                {/* User-only */}
                {user?.role === "USER" && (
                    <>
                        {/* You can add user-specific menu items here */}
                        {/*<MenuItem as={NavLink} to="/userInfo" name="Profilim" />*/}
                    </>
                )}
            </Menu>
        </div>
    );
}
