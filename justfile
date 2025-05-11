# Start the PostgreSQL container
start-postgres:
    @echo "Starting PostgreSQL container..."
    sudo docker run --name postgres_db \
        -e POSTGRES_PASSWORD='mypostgres' \
        -v my_postgres_data:/var/lib/postgresql/data \
        -p 0.0.0.0:5432:5432 \
        -d postgres

# Stop the PostgreSQL container
stop-postgres:
    @echo "Stopping PostgreSQL container..."
    -sudo docker stop postgres_db
    -sudo docker rm postgres_db

# Restart PostgreSQL container (recreate, preserve data)
restart-postgres:
    @echo "Removing old container (if exists)..."
    -sudo docker rm -f postgres_db

    @echo "Starting new PostgreSQL container with same volume..."
    sudo docker run --name postgres_db \
        -e POSTGRES_PASSWORD='mypostgres' \
        -v my_postgres_data:/var/lib/postgresql/data \
        -p 0.0.0.0:5432:5432 \
        -d postgres
