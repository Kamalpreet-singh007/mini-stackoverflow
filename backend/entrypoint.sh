#!/bin/bash

# Exit the script if any command fails
set -e

ls

pwd

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo -e "RUNNING THE APPLICATION\n\n"

env  # Shows loaded environment variables (for debugging)

python manage.py migrate

python manage.py collectstatic --no-input
# Start Gunicorn
gunicorn core.wsgi:application --workers 4 --bind 0.0.0.0:8000

exec "$@"


# sudo docker build -t backend . && sudo docker run -it --rm -p 8000:8000 backend