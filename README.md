# Salesforce CI/CD with GitHub Actions

This repository is a proof of concept for Salesforce CI/CD with GitHub Actions.


## Status


##### Partial SBX Builds

[![Ad hoc Partial SBX](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/ad-hoc-partial-sbx.yml/badge.svg)](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/ad-hoc-partial-sbx.yml)

[![Partial SBX Validate PR](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/partial-sbx-validate-pr.yml/badge.svg)](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/partial-sbx-validate-pr.yml)

[![Partial SBX Deploy PR](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/partial-sbx-deploy-pr.yml/badge.svg)](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/partial-sbx-deploy-pr.yml)


##### Production Builds

[![Ad hoc Production](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/ad-hoc-production.yml/badge.svg)](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/ad-hoc-production.yml)

[![Production Validate PR](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/production-validate-pr.yml/badge.svg)](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/production-validate-pr.yml)

[![Production Deploy PR](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/production-deploy-pr.yml/badge.svg)](https://github.com/kmanuzon/salesforce-ci-cd/actions/workflows/production-deploy-pr.yml)


## Overview

The following sections will walkthrough step by step of setting up CI/CD.

- [Generate server certificate and key](#generate-server-certificate-and-key)
- [Encrypt server key and commit to repository](#encrypt-server-key-and-commit-to-repository)
- [Create Connected App in Salesforce](#create-connected-app-in-salesforce)
- [Setup Environments and Secrets in GitHub](#setup-environments-and-secrets-in-github)
- [Create GitHub Actions](#create-github-actions)
- [Resources](#resources)


## Generate server certificate and key

Run the command below to generate __server.crt__ and __server.key__ files.

```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -sha256
```

The __server.crt__ file will be used later in the Connected App, and the
__server.key__ file will be used to authenticate to the Connected App.


## Encrypt server key and commit to repository


### Generate key and iv

Run this command then copy and store the returned __key__ and __iv__ values in a
safe place.

> __NOTE__ The `-k` option is the password value.

```
openssl enc -aes-256-cbc -k PASSWORD_VALUE -P -md sha1 -nosalt
```


### Encrypt server key

Run this command to encrypt __server.key__ which generates a new file
__server.key.enc__, an encrypted version.

> __NOTE__ The `-K` and `-iv` options should come from the previous section's
__key__ and __iv__ output.

```
openssl enc -nosalt -aes-256-cbc -in server.key -out server.key.enc -base64 -K KEY_VALUE -iv IV_VALUE
```

### Commit to repository

Place the __server.key.enc__ in `./build` directory, then commit the file to the
repository.


## Create Connected App in Salesforce

1. Navigate to Setup > Apps > App Manager
2. Click __New Connected App__ button
3. Populate the fields using the __Figure 1__ table below
4. Click __Save__ button
5. Click __Continue__ button
6. Copy and store the __Consumer Key__ temporarily for use later in this guide
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


## Setup Environments and Secrets in GitHub


### Secrets

1. Click __Settings__ tab
2. Click __Secrets__ vertical tab
3. Click __New repository secret__ button
4. Refer to the __Figure 3__ table for field values
5. Click __Add secret__ button
6. Repeat steps 3 to 5 for each row


###### Figure 3

| Name              | Value                                     |
| ----------------- | ----------------------------------------- |
| DECRYPTION_IV     | The __iv__ generated in previous section  |
| DECRYPTION_KEY    | The __key__ generated in previous section |
| SFDC_INSTANCE_URL | https://test.salesforce.com               |


### Environment

1. Click the __Environments__ vertical tab
2. Click __New environment__ button
3. Refer to the __Figure 4__ table for field values
4. Click __Configure environment__ button
5. Repeat steps 1 to 4 for each row


###### Figure 4

| Name        |
| ----------- |
| PARTIAL_SBX |
| PRODUCTION  |


### Environment Secrets

1. Click the __Environments__ vertical tab
2. Click the environment name link
3. Under Environment secrets section, click __Add secret__ button
4. Refer to the __Figure 5__ table for field values
5. Repeat steps 3 to 4 for each row


###### Figure 5

| Name              | Value                                 |
| ----------------- | ------------------------------------- |
| SFDC_CONSUMER_KEY | Salesforce Connected App Consumer Key |
| SFDC_USERNAME     | Salesforce Username                   |


## Create GitHub Actions

This repository already includes actions and workflows, see `./github/`
directory. Alternatively, see the [Using environments for deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
documentation.


## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)

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