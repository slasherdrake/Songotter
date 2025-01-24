import { Authenticator, } from '@aws-amplify/ui-react';
import AuthenticatorCustomFormFields from '../components/AuthenticatorCustomFormFields';
import '@aws-amplify/ui-react/styles.css';
import '../styles/global.css';
import AccountRedirect from '../components/AccountRedirect';

export default function SignIn() {
    return (
      <div className= 'sign-up'>
        <Authenticator formFields={AuthenticatorCustomFormFields} className="cent" >
            <AccountRedirect />
        </Authenticator>
      </div>
    );
  }
