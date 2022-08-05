# Scrapper API

Built with ❤️ using

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Docker](https://www.docker.com/)

## Get started

To run this project you must have the following installed:

- [Node](https://nodejs.org/en/)
- (Optional) [Yarn v1](https://classic.yarnpkg.com/lang/en/)

Once you've finished installation of the above, install dependancies by running the below command in the root project directory

```s
yarn install
```

Create a `.env` file in the project directory with the following values

```
DATABASE_USER=admin // db user
DATABASE_PASSWORD=mypassword // db password
DATABASE_URL=mongodburl.net // db url
DATABASE_NAME=mydatabase // db name
ENCRYPTION_KEY=ksdjhksjd89s8dysdb56sdsdsdsdsdsd // 32 length string for aes encryption
NODE_ENV=develop // develop for local, production on server
```

Build and run the project

```s
yarn build && yarn start
```

Server will be available on [`http://localhost:3000`](http://localhost:3000)

## Infrastructure

- Google Cloud Run. Base API endpoint (https://scrapper-api-bnvg4lp5ba-nw.a.run.app)

- CI / CD. [GitHub Actions](https://github.com/jgkiano/scrapper-api/actions)

## Documentation

Full API documentation can be found [here](https://documenter.getpostman.com/view/10090803/VUjLM7EQ).
