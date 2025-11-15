fb3205331f4e4141a7f62d9ca4f9f080


echo "==== Starting Build and Deployment ===="

SOURCE="$WORKSPACE/"
DEST="/var/www/html/ems"

echo "Syncing files from $SOURCE to $DEST..."

rsync -avz --delete \
  --exclude='.git' \
  --exclude='backend/uploads/' \
  --exclude='backend/.env' \
  --exclude='frontend/.env' \
  "$SOURCE" "$DEST"

echo "==== Deployment completed successfully ===="

