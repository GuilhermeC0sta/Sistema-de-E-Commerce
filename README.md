# Sistema-de-E-Commerce
Sistema desenvolvido para a disciplina de Reuso de Software

Para rodar o projeto é necessário executar:
npm install --save-dev cross-env
npm install dotenv

É necessário criar um arquivo .env na raiz do projeto, o arquivo deve conter a url do banco de dados:
DATABASE_URL=postgresql://usuario:senha@ep-xxxx.neon.tech/dbname?sslmode=require

Caso surja algo como (error: relation "products" does not exist), executar:
npx drizzle-kit push

Para executar o projeto:
npm run dev
