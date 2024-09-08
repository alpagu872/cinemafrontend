
import React from 'react';
import { Dropdown } from 'semantic-ui-react';

export default function SignedIn({ onSignOut }) {
    return (
        <Dropdown item text='Alpagu'>
            <Dropdown.Menu>
                <Dropdown.Item text='Bilgilerim' icon='info' />
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
