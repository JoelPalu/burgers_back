# wsk-24-viikko3

Api rules:

USERS:

        - GET /users
            everyone can call all users

        - GET /users/{id}
            everyone can call a user by id

        - POST /users
            everyone can create a user

        - PUT /users/{id}
            only the user can update his/her own information
            admin can update all users information

        - DELETE /users/{id}
            only the user can delete his/her own information
            admin can delete all users information


CAT:

        - GET /cat
            everyone can call all cats

        - GET /cat/{id}
            everyone can call a cat by id

        - POST /cat
            you need to have an authenticated user to create a cat

        - PUT /cat/{id}
            only the user can update his/her own cat
            admin can update all cats

        - DELETE /cat/{id}
            only the user can delete his/her own cat
            admin can delete all cats
