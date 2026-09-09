import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const { DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH } = process.env;

if (!DEPLOY_USER || !DEPLOY_HOST || !DEPLOY_PATH) {
  console.error(
    'Задайте переменные окружения DEPLOY_USER, DEPLOY_HOST и DEPLOY_PATH (см. .env.example).'
  );
  process.exit(1);
}

if (!existsSync('dist')) {
  console.error('Папка dist не найдена. Сначала выполните npm run build.');
  process.exit(1);
}

const target = `${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`;
execSync(`scp -r ./dist/* ${target}`, { stdio: 'inherit' });
