# Деплой Pushes на Aeza

Сейчас в репозитории **только фронтенд** (`frontend/`). API и база — следующий этап на этом же VPS.

## Что нужно заранее

1. **Домен** (A-запись → IP сервера Aeza). Telegram Mini App **без HTTPS не откроется**.
2. SSH-доступ: IP, логин `root` (или другой), пароль/ключ.
3. Репозиторий на GitHub: `https://github.com/chizhev09/pushes.git`

---

## Шаг 1 — Подключись к серверу

```bash
ssh root@IP_СЕРВЕРА
```

---

## Шаг 2 — Установи софт (Ubuntu/Debian)

```bash
apt update && apt upgrade -y
apt install -y nginx git curl

# Node 20 LTS (для сборки фронта)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

node -v
npm -v
```

---

## Шаг 3 — Клонируй проект и собери фронт

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/chizhev09/pushes.git
cd pushes/frontend
npm ci
npm run build
```

Статика после сборки: `/var/www/pushes/frontend/dist`

```bash
ln -sfn /var/www/pushes/frontend/dist /var/www/pushes
```

---

## Шаг 4 — Nginx

```bash
cp /var/www/pushes/deploy/nginx-pushes.conf /etc/nginx/sites-available/pushes
nano /etc/nginx/sites-available/pushes
# Замени YOUR_DOMAIN на свой домен

ln -s /etc/nginx/sites-available/pushes /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

---

## Шаг 5 — SSL (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d pushes.su -d www.pushes.su
```

Проверь в браузере: `https://pushes.su`

---

## Шаг 6 — Telegram Mini App

1. [@BotFather](https://t.me/BotFather) → твой бот → **Menu Button** → **Web App**
2. URL: `https://pushes.su`
3. Открой бота в Telegram и проверь Mini App

---

## Обновление после правок в коде

```bash
cd /var/www/pushes
git pull
cd frontend
npm ci
npm run build
```

---

## Дальше на этом же Aeza (бэкенд)

| Компонент | Зачем |
|-----------|--------|
| **PostgreSQL** | пользователи, задания, энергия |
| **Node/FastAPI API** | `initData` Telegram, загрузка скриншотов |
| **systemd** | сервис `pushes-api` |
| **nginx location /api** | прокси на `localhost:3000` |

Схема:

```
https://домен/          → фронт (dist)
https://домен/api/      → бэкенд (позже)
```

---

## Альтернатива: фронт на Cloudflare Pages

- **Фронт** — бесплатно на Cloudflare Pages (деплой из Git)
- **Aeza** — только API и бот

Так проще обновлять UI и меньше нагрузка на VPS.
