import React from 'react';
import {Dropdown} from 'semantic-ui-react';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUser} from "../services/userSlice";


export default function SignedIn({onSignOut, onInfo}) {
    console.log("SignedIn component rendered");
    const navigate = useNavigate();


    const handleInfo = () => {

        console.log("Bilgilerim button clicked in SignedIn component");
        navigate("/userinfo");
    }
    const {user} = useSelector(selectUser);
    const fullName = `User ID: ${user.webUserId} (${user.role})`;

    return (
        <Dropdown item text={fullName}>
            <Dropdown.Menu>
                <Dropdown.Item text='Bilgilerim' icon='info'
                               onClick={() => {
                                   console.log("Bilgilerim button clicked in SignedIn component");
                                   handleInfo()
                               }}/>
                <Dropdown.Item
                    text='Çıkış Yap'
                    icon='sign out'
                    onClick={() => {
                        console.log("Çıkış Yap button clicked in SignedIn component");
                        onSignOut();  // Call the handleSignOut function passed from Navi.jsx
                    }}
                />
            </Dropdown.Menu>
        </Dropdown>
    );
}
