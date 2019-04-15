import Vue from 'vue'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'

Amplify.configure({
    Auth: {
        // REQUIRED - Amazon Cognito Region
        region: 'eu-west-1',
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: '',
        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: ''
        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        //mandatorySignIn: false,
        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        //authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
})

Vue.use(AmplifyPlugin, AmplifyModules)
