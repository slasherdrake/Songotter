
import { Authenticator, } from '@aws-amplify/ui-react';
import AuthenticatorCustomFormFields from '../components/AuthenticatorCustomFormFields';
import '@aws-amplify/ui-react/styles.css';
import '../styles/global.css';
import AccountRedirect from '../components/AccountRedirect';
export default function CreateAccount() {
    return (
      <div className= 'sign-up'>
      <Authenticator initialState="signUp" formFields={AuthenticatorCustomFormFields} className="cent" >
          <AccountRedirect />
        </Authenticator>
        </div>
    );
  }
