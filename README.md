_Exploring and exploiting the Google Chromecast!_

This repo is a collection of Google Chromecast Receiver applications.

Getting Started
---------------

    > git clone https://github.com/peterwmwong/chromecast-labs.git
    > bundle install
    > npm install
    > bower install
    > grunt

Developing
----------

    > grunt watch

TODO: grunt web server

Repo organization
-----------------

    /index.html      # Chromecast Receiver endpoint, that bootstraps the loader
                     # which loads the actual Receiver application from
                     # /receiver_apps/{app}
    /receiver_apps/
    /sender_apps/  
