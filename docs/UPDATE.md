
# Обновление: Git → сервер

Подробная инструкция: как запушить код в GitHub и обновить сайт на VPS через SSH.

- Репозиторий: https://github.com/chizhev09/pushes
- Сайт: https://pushes.su
- Путь на сервере: `/var/www/pushes`
- Пример IP: `80.64.17.11` (Timeweb)

---

## 1. Запушить с компьютера в Git

### Первый раз (если Git ещё не настроен)

1. Установи [Git](https://git-scm.com/download/win).
2. Открой PowerShell в папке проекта:

```powershell
cd C:\Users\ТВОЙ_ПОЛЬЗОВАТЕЛЬ\Desktop\pushes
git status
```

3. Проверь привязку к GitHub:

```powershell
git remote -v
```

Должно быть: `origin` → `https://github.com/chizhev09/pushes.git`

Если `origin` нет:

```powershell
git remote add origin https://github.com/chizhev09/pushes.git
git branch -M main
```

4. **Авторизация GitHub** (при `git push`):
   - Логин: твой **GitHub username**
   - Пароль: **Personal Access Token** (не пароль от аккаунта)
   - Создать токен: GitHub → Settings → Developer settings → Personal access tokens → Generate (права `repo`)

---

### Каждое обновление кода

**Шаг 1** — посмотреть изменения:

```powershell
cd C:\Users\ТВОЙ_ПОЛЬЗОВАТЕЛЬ\Desktop\pushes
git status
```

**Шаг 2** — добавить файлы:

```powershell
git add .
```

Только фронт:

```powershell
git add frontend
```

**Шаг 3** — коммит:

```powershell
git commit -m "Кратко: что изменил"
```

Примеры: `fix: кнопка Проверить`, `feat: страница меню`

**Шаг 4** — отправить на GitHub:

```powershell
git push origin main
```

Если ветка `master`:

```powershell
git push origin master
```

**Шаг 5** — проверка: https://github.com/chizhev09/pushes — новый коммит на месте.

---

### Что не попадает в Git

В `frontend/.gitignore`: `node_modules/`, `dist/` — их пушить не нужно.

---

## 2. Обновить сайт на сервере (SSH)

После `git push` зайди на сервер и пересобери фронт.

### Подключение

```powershell
ssh root@80.64.17.11
```

Подставь **свой IP** из панели хостинга. Пароль — из панели VPS.

---

### Обновление (каждый раз)

На сервере:

```bash
cd /var/www/pushes
git pull origin main
cd frontend
npm ci
npm run build
```

**Одной строкой:**

```bash
cd /var/www/pushes && git pull origin main && cd frontend && npm ci && npm run build
```

Проверка:

```bash
ls -la /var/www/pushes/frontend/dist/index.html
```

В браузере: https://pushes.su (жёсткое обновление Ctrl+F5).

Если UI не обновился:

```bash
systemctl reload nginx
```

---

### Первичная установка на сервере (один раз)

```bash
apt update
apt upgrade -y
apt install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
mkdir -p /var/www
cd /var/www
git clone https://github.com/chizhev09/pushes.git
cd pushes/frontend
npm ci
npm run build
```

Nginx (`/etc/nginx/sites-available/pushes`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name pushes.su www.pushes.su;

    root /var/www/pushes/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
ln -sf /etc/nginx/sites-available/pushes /etc/nginx/sites-enabled/pushes
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

SSL (когда DNS указывает на IP сервера):

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d pushes.su -d www.pushes.su
```

Telegram: BotFather → Menu Button → Web App → `https://pushes.su`

---

### Если `git pull` просит логин

Сделай репозиторий **публичным** на GitHub — тогда `git pull` на сервере без пароля.

---

## 3. Чеклист

| Шаг | Где | Действие |
|-----|-----|----------|
| 1 | ПК | `git add` → `commit` → `push` |
| 2 | GitHub | Коммит виден |
| 3 | SSH | `git pull` + `npm run build` |
| 4 | Браузер / Telegram | Новый UI |

---

## 4. Полезные команды

**ПК:**

```powershell
git log -3 --oneline
```

**Сервер:**

```bash
tail -f /var/log/nginx/error.log
curl -I -H "Host: pushes.su" http://127.0.0.1
```

См. также: [deploy/DEPLOY-AEZA.md](../deploy/DEPLOY-AEZA.md), [deploy/nginx-pushes.conf](../deploy/nginx-pushes.conf)
