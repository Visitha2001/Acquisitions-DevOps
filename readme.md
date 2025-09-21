# ⚙️ Setup
## eslint installation
```bash
npm i eslint @eslint/js prettier eslint-config-prettier eslint-plugin-prettier -D
```
## drizzle installation
```bash
npm i @neondatabase/serverless drizzle-orm
```
## drizzle kit installation
```bash
npm i -D drizzle-kit
```
## winston installation
```bash
npm i winston
```
## helmet installation
```bash
npm i helmet
```
## morgan installation
```bash
npm i morgan
```
## cors. cookie-parser installation
```bash
npm i cors cookie-parser
```
## jsonwebtoken and bcrypt installation
```bash
npm i jsonwebtoken bcrypt
```

# ⚙️ db migration
```bash
npm run db:generate
```
```bash
npm run db:migrate
```

# ⚙️ testing
## jest installation
```bash
npm i jest @types/jest -D
```
## supertest installation
```bash
npm i supertest @types/supertest -D
```
## jest configuration
```bash
npx jest --init
```
## cross-env installation
```bash
npm install --save-dev cross-env jest supertest
```
## jest run
```bash
npm run test
```

# ⭐ run this project
## dev env
```bash
npm run dev:docker
```
## production env
```bash
npm run prod:docker