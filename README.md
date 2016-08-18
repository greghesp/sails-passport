Sails-Passport
===================

Sails template that includes Passport.js, as well as strategies for authenticating with Facebook and Google, as well as local registration.

All 3 strategies are pre-configured for easy use.  Simply add in your Facebook and Google App information in config/passport.js and configure your MongoDB in config/connections.js

----------


Getting Started
-------------

Install required node modules
```
$ npm install
```


----------


Setup
-------

**Facebook**

 1. Create a [Facebook Application](https://developers.facebook.com/apps/)
 2. Add the product 'Facebook Login' to your Facebook Application
 3. Enable Client and Web OAuth Login
 4.  Add localhost to the App Domains for the Facebook Application
 5. Add the redirect URI for your Sails-Passport installation
	 - If running locally, then it is likely to be http://localhost:1337/auth/facebook/callback
 6. Add the Application ID and App Secret from your Facebook App to the FacebookStrategy within config/passport.js
 7. Ensure the callbackURL within the FacebookStrategy is the same as what is in your Facebook Application
 
 
**Google**
 *Note: Google does not allow the use of localhost.  Visit [Display My Hostname](http://www.displaymyhostname.com/) and use the hostname provided.  Then setup port forwarding on your router*
 
 8. Create a [Google Application](https://console.developers.google.com)
 9. Create Credentials for an [OAuth Client ID](https://console.developers.google.com/apis/credentials/oauthclient) for a Web Application
 10. Add your hostname and port to the Authorised JavaScript Origins
 11. Add your hostname CallbackURL to the Authorised redirect URI.  
	- This will likely be something like http://[hostname.com]:[port]/auth/google/callback
 12. Add the Google+ API from the Developer Console
 13. Add the Client ID and Client Secret from your Google App to the GoogleStrategy within config/passport.js
 14. Ensure the callbackURL within the Google Strategy is the same as what is in your Google Application


----------


Scope Configuration
-------

At the moment, Sails-Passport takes the minimum amount of data needed to function:

 - Name
 - Email
 - Account ID

These options can be configured from config/passport.js and api/controllers/AuthController.js

As Sails-Passport it utilising both [passport-facebook](https://github.com/jaredhanson/passport-facebook) and [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth), more information can be found at those repositories on how to configure them.
You will need to make the necessary adjustments to both the User model, and config/passport.js to accept the new scopes.
