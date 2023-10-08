- # API Documentation

This documentation provides an overview of the API routes and their corresponding validators for the application.
## Table of Contents
- [Admin Routes](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#admin-routes)
  - [Get All Webtoons](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#get-all-webtoons)
  - [Create User Account](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#create-user-account)
  - [Delete User Account](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#delete-user-account)
  - [Get All User Accounts](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#get-all-user-accounts)
  - [Update User Password](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#update-user-password)
  - [Get Download State](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#get-download-state)
  - [Start Download](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#start-download)
  - [Stop Download](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#stop-download)
- [Webtoon Routes](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#webtoon-routes)
  - [Get All Webtoons](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#get-all-webtoons-webtoon)
  - [Get Webtoon Episodes](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#get-webtoon-episodes)
  - [Get Episode Images](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#get-episode-images)
- [User Routes](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#user-routes)
  - [User Login](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#user-login)
  - [Check User Login](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#check-user-login)
  - [Get User States](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#get-user-states)
  - [Create User State](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#create-user-state)
  - [Update User State](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#update-user-state)
  - [Get User Favorites](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#get-user-favorites)
  - [Add User Favorite](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#add-user-favorite)
  - [Remove User Favorite](https://chat.openai.com/c/def8bf06-bf47-4eec-92c6-a19f7b1c212a#remove-user-favorite)
## Admin Routes
### Get All Webtoons
- **Route** : `/admin/webtoons`
- **Method** : GET
- **Description** : Get all webtoons.
- **Authentication** : Admin Authentication
### Create User Account
- **Route** : `/admin/user`
- **Method** : POST
- **Description** : Create a user account.
- **Authentication** : Admin Authentication
- **Body** :
  - `username` (string, required)
  - `password` (string, required)
  - `avatar` (string, required)
### Delete User Account
- **Route** : `/admin/user/:user_id`
- **Method** : DELETE
- **Description** : Delete a user account.
- **Authentication** : Admin Authentication
### Get All User Accounts
- **Route** : `/admin/users`
- **Method** : GET
- **Description** : Get all user accounts.
- **Authentication** : Admin Authentication
### Update User Password
- **Route** : `/admin/user/:user_id`
- **Method** : PUT
- **Description** : Update user password.
- **Authentication** : Admin Authentication
- **Body** :
  - `password` (string, required)
### Get Download State
- **Route** : `/admin/download`
- **Method** : GET
- **Description** : Get download state.
- **Authentication** : Admin Authentication
### Start Download
- **Route** : `/admin/download`
- **Method** : POST
- **Description** : Start a download.
- **Authentication** : Admin Authentication
- **Body** :
  - `webtoonName` (string, required)
  - `language` (string, required, max 10)
  - `startEpisode` (number, required, min 1)
### Stop Download
- **Route** : `/admin/download`
- **Method** : DELETE
- **Description** : Stop a download.
- **Authentication** : Admin Authentication
## Webtoon Routes
### Get All Webtoons (Webtoon)
- **Route** : `/webtoons`
- **Method** : GET
- **Description** : Get all webtoons.
- **Authentication** : User Authentication
### Get Webtoon Episodes
- **Route** : `/webtoons/:webtoon_id/episodes`
- **Method** : GET
- **Description** : Get episodes of a specific webtoon.
- **Authentication** : User Authentication
### Get Episode Images
- **Route** : `/webtoons/:webtoon_id/episode/:episode_number`
- **Method** : GET
- **Description** : Get images of a specific episode.
- **Authentication** : User Authentication
## User Routes
### User Login
- **Route** : `/user/login`
- **Method** : POST
- **Description** : User login.
- **Body** :
  - `username` (string, required)
  - `password` (string, required)
### Check User Login
- **Route** : `/user/login`
- **Method** : GET
- **Description** : Check user login status.
- **Authentication** : User Authentication
### Get User States
- **Route** : `/user/states`
- **Method** : GET
- **Description** : Get user states.
- **Authentication** : User Authentication
### Create User State
- **Route** : `/user/state/:episode_id`
- **Method** : POST
- **Description** : Create a user state for an episode.
- **Authentication** : User Authentication
- **Body** :
  - `state` (number, required, min 0, max 100)
### Update User State
- **Route** : `/user/state/:episode_id`
- **Method** : PUT
- **Description** : Update user state for an episode.
- **Authentication** : User Authentication
- **Body** :
  - `state` (number, required, min 0, max 100)
### Get User Favorites
- **Route** : `/user/favorites`
- **Method** : GET
- **Description** : Get user favorites.
- **Authentication** : User Authentication
### Add User Favorite
- **Route** : `/user/favorite/:webtoon_id`
- **Method** : POST
- **Description** : Add a webtoon to user favorites.
### Remove User Favorite
- **Route** : `/user/favorite/:webtoon_id`
- **Method** : DELETE
- **Description** : Remove a webtoon from user favorites.
