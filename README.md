# Salesforce CI/CD with GitHub Actions

This repository is a sample Salesforce CI/CD with GitHub Actions featuring
different environments and branches.


## Statuses

[![Partial SBX Pull Request Validation](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/partial-sbx-pull-request-validation.yml/badge.svg)](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/partial-sbx-pull-request-validation.yml)

[![Partial SBX Deployment](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/partial-sbx-deployment.yml/badge.svg)](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/partial-sbx-deployment.yml)

[![Production Pull Request Validation](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/production-pull-request-validation.yml/badge.svg)](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/production-pull-request-validation.yml)

[![Production Deployment](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/production-deployment.yml/badge.svg)](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/production-deployment.yml)


## Overview

The following sections will walkthrough step by step of setting up CI/CD.

- Generate server certificates and keys
- Create Connected App in Salesforce
- Encrypt server keys and commit to repository
- Create environment secrets in GitHub
- Create GitHub Actions for Pull Request and Push events


## Generate server certificates and keys

Run the command below to generate __server.crt__ and __server.key__ files.
```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -sha256
```

The __server.crt__ file will be used later in the Connected App, and the
__server.key__ file will be used to authenticate in the Connected App.


## Create Connected App in Salesforce

1. Navigate to Setup > Apps > App Manager
2. Click __New Connected App__ button
3. Populate the fields using the __Figure 1__ table below
4. Click __Save__ button
5. Click __Continue__ button
6. Copy the __Consumer Key__ for use later in this guide
7. Click __Manage__ button
8. Click __Edit Policies__ button
9. Populate the fields using the __Figure 2__ table below
10. Click __Save__ button
11. Click __Manage Profiles__ button
12. Check the checkbox for __System Administrator__ profile
13. Click __Save__ button


###### Figure 1

| Label                              | Value                               |
| ---------------------------------- | ----------------------------------- |
| Connected App Name                 | Salesforce CI/CD                    |
| API Name                           | SalesforceCICD                      |
| Contact Email                      | YOUR_EMAIL_HERE@example.com         |
| Enable OAuth Settings              | Checked                             |
| Callback URL                       | http://localhost:1717/OauthRedirect |
| Use digital signatures             | Checked                             |
| Choose File                        | Use the __server.crt__ file         |
| Selected OAuth Scopes              | Manage user data via APIs (api), Manage user data via Web browsers (web), Perform requests at any time (refresh_token, offline_access) |
| Require Secret for Web Server Flow | Checked                             |
| Require Secret for Refresh Token   | Checked                             |


###### Figure 2

| Label                              | Value                                   |
| ---------------------------------- | --------------------------------------- |
| Permitted Users                    | Admin approved users are pre-authorized |


## Encrypt server key and commit to repository


### Generate key and iv

Run this command and copy the returned __key__ and __iv__ values. Note that
__-k__ flag is the password.
```
openssl enc -aes-256-cbc -k 12345 -P -md sha1 -nosalt
```


### Encrypt server key

Run this command to encrypt __server.key__ to a new file __server.key.enc__.
```
openssl enc -nosalt -aes-256-cbc -in server.key -out server.key.enc -base64 -K KEY_VALUE -iv IV_VALUE
```

### Commit to repository

Make sure the __server.key.enc__ is in __./build__ directory, then commit this
file to the repository.


## Create environment secrets in GitHub

TODO


## Create GitHub Actions for Pull Request and Push events

TODO


## Resources

- [Create a Private Key and Self-Signed Digital Certificate](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm)

- [How To Authorize an Org With JWT-Based Flow With Salesforce DX (Part 4)](https://www.youtube.com/watch?v=Orh_n32k8mU&list=PLSjzuyuoSi-EfqRq-PJ_KKzLzB84YModG&index=4)

- [How To Set Up CI-CD With Github Actions Using Salesforce DX (Part5)](https://www.youtube.com/watch?v=_eOXnb9pQAg&list=PLSjzuyuoSi-EfqRq-PJ_KKzLzB84YModG&index=5)


## Snippets

### Create Scratch Org
```
sfdx force:org:create --wait 30 --durationdays 30 --setdefaultusername \
--definitionfile config/project-scratch-def.json \
--targetdevhubusername gtc-devhub \
--setalias km-scratch-001
```