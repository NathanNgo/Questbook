DB_URL=postgres://admin:password@localhost:5432/questbook?sslmode=disable
MIGRATIONS_PATH=./migrations
MIGRATE=go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate

migrate:
	$(MIGRATE) -path $(MIGRATIONS_PATH) -database "$(DB_URL)" up

migrate-down:
	$(MIGRATE) -path $(MIGRATIONS_PATH) -database "$(DB_URL)" down 1

new-migration:
	@if [ -z "$(name)" ]; then echo "Error: name is required. Usage: make new-migration name=<name>"; exit 1; fi
	@# Using $(MIGRATE) here keeps things consistent and uses the same tool version
	$(MIGRATE) create -ext sql -dir $(MIGRATIONS_PATH) -format unix "$(name)"