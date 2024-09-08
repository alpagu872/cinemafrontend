import React from 'react';
import { Button } from 'semantic-ui-react';

export default function SignedOut({ onSignIn }) {
    console.log("SignedOut component rendered");

    return (
        <div>
            <Button primary onClick={() => {
                console.log("Sign In button clicked in SignedOut component");
                onSignIn();
            }}>
                Giriş Yap
            </Button>
        </div>
    );
}
