# Start the PostgreSQL container
start-postgres:
    @echo "Starting PostgreSQL container..."
    sudo docker run --name postgres_db_2 \
        -e POSTGRES_PASSWORD='mypostgres' \
        -v my_postgres_data:/var/lib/postgresql/data \
        -p 0.0.0.0:5433:5432 \
        -d postgres

# Stop the PostgreSQL container
stop-postgres:
    @echo "Stopping PostgreSQL container..."
    -sudo docker stop postgres_db_2
    -sudo docker rm postgres_db_2

# Restart PostgreSQL container (recreate, preserve data)
restart-postgres:
    @echo "Removing old container (if exists)..."
    -sudo docker rm -f postgres_db_2

    @echo "Starting new PostgreSQL container with same volume..."
    sudo docker run --name postgres_db_2 \
        -e POSTGRES_PASSWORD='mypostgres' \
        -v my_postgres_data:/var/lib/postgresql/data \
        -p 0.0.0.0:5433:5432 \
        -d postgres
