DataScope
Enterprise Data Discovery & Intelligence Platform

DataScope is a role-based data discovery and intelligence platform for
exploring, searching, filtering, and analyzing large collections of
structured business data. It provides a centralized interface for
working with related datasets while enforcing user- and dataset-level
access permissions through the backend.
Project status: The application has been developed and tested
locally according to the project implementation reports. Docker and
deployment configuration have been prepared, but the containerized
deployment has not yet been verified. Treat deployment instructions
below as a setup guide that must be validated in the target
environment.

Table of Contents
- Project Overview
- Features
- Technology Stack
- Project Structure
- Frontend Architecture
- Data Fetching Strategy
- State Management Strategy
- Search Architecture
- Database Indexing Strategy
- Pagination Strategy
- Caching Strategy
- Performance Optimization
- Security and Access Control
- Testing Strategy
- Getting Started
- Environment Configuration
- Deployment Instructions
Project Overview
DataScope is designed to make large and interconnected datasets easier
to discover and explore. Instead of downloading an entire dataset to the
browser, users can search and work with records through backend-powered
queries, filtering, sorting, and pagination.

The platform uses a single application with three role types:
  Role                                Access
  Administrator                   Platform-wide administration, user
and role management, dataset
management, permissions, analytics,
activity logs, and system settings.

  Data Analyst                    Exploration of authorized datasets,
advanced search and filters, saved
views, analytics, and permitted
exports.
Viewer                          Read-only exploration of authorized
datasets and basic search,
filtering, sorting, and record
viewing.
Authorization is enforced by the backend. Hiding a frontend control is
not considered sufficient protection for a restricted operation.
Demo data
The development dataset contains six synthetic datasets with a planned
total of 280,000 records:

  Dataset                      Records
  Customer Information         100,000
Product Inventory             20,000
Sales Transactions           100,000
Employee Directory             5,000
Supplier Information           5,000
Shipment & Delivery           50,000
Total                280,000

The seed data is synthetic and intended for development and
demonstration.
Features
Authentication and authorization
- Registration, login, logout, and session-based authentication
  through Better Auth.
- Role-based access control (RBAC).
- Server-side role and permission checks.
- Dataset access membership and permission-aware data access.
- Separate dashboards for Administrator, Data Analyst, and Viewer.
Dataset Library and Data Explorer
- Browse available datasets and their metadata.
- View dataset fields and record details.
- Search records and apply filters.
- Sort by supported fields and combine sort criteria.
- Paginate through results without loading the complete dataset into
  the browser.
- Configure visible table columns.
- Inspect record relationships and related records.
- Keep relevant explorer state in URL query parameters.
Productivity and administration
- Saved views and view sharing.
- Search history.
- Notifications and user preferences.
- Profile management.
- Administrative user, role, and permission management.
- Activity/audit logs and query performance information.
- Export workflows for supported formats, subject to permissions.
Technology Stack
  Layer                               Technologies
  Frontend                            Next.js App Router, React,
TypeScript

  UI and styling                      Tailwind CSS, HeroUI

  API state and data fetching         Redux Toolkit, RTK Query

  Backend                             Node.js, NestJS

  Authentication                      Better Auth

  Database                            PostgreSQL

  ORM                                 Drizzle ORM

  Cache                               Redis

  Validation                          Zod

  Charts                              Recharts

  API documentation                   Swagger / OpenAPI

  Testing                             Jest and/or Vitest, API integration
tests, Playwright where configured

  Deployment infrastructure           Docker, Docker Compose, NGINX
CI                                  GitHub Actions
Project Structure
The repository is organized as two main applications:
DATASCOPE-PROJECT/
├── datascope-client/       # Next.js frontend
│   └── src/
│       ├── app/            # App Router pages and layouts
│       ├── components/     # Shared UI components
│       ├── lib/            # Shared libraries and configuration
│       ├── services/       # API-related code (if present)
│       └── store/          # Redux store and RTK Query setup
│
├── datascope-server/       # NestJS backend
│   └── src/
│       ├── core/           # Shared infrastructure/providers
│       ├── db/             # Drizzle schema, migrations and seeds
│       ├── lib/            # Shared libraries and auth configuration
│       └── modules/        # Feature modules and API endpoints
│
└── README.md
The exact contents may evolve as the project is refactored. Refer to the
repository itself for the authoritative current directory structure.
Frontend Architecture
The frontend uses the Next.js App Router and is organized around
route-level pages, shared layouts, reusable components, and
feature-specific API/state logic.

Main application areas include:
- /login and /register --- authentication.
- /admin --- Administrator dashboard.
- /analyst --- Data Analyst dashboard.
- /viewer --- Viewer dashboard.
- /datasets --- dataset library.
- /explorer --- Data Explorer.
The frontend is responsible for rendering the interface, collecting user
input, managing temporary UI state, and calling backend APIs. It is not
the authority for access control or data permissions.

Protected routes and role-aware navigation improve the user experience,
while the backend independently verifies each protected request.
Data Fetching Strategy
DataScope uses RTK Query for frontend communication with the NestJS
API.

API endpoints are defined centrally and consumed by application
features. RTK Query manages request status, response caching, and cache
invalidation.

Typical data flow:
1. A page or component requests data through an RTK Query endpoint.
2. The request is sent to the NestJS API.
3. Authentication and authorization guards validate the request.
4. The service validates parameters and performs the required database
   operation.
5. The API returns the requested result.
6. RTK Query stores the response in its cache and updates subscribed
   components.
The backend performs filtering, sorting, pagination, and other
data-intensive operations. The browser should receive only the records
and metadata needed for the current view.
State Management Strategy
DataScope separates state according to its responsibility.
  State type              Management approach     Examples
  Server state            RTK Query               Datasets, records,
saved views, analytics,
notifications

  Shared client state     Redux Toolkit where     Cross-feature
needed                  UI/application state

  Local UI state          React component state   Open dialog, selected
tab, temporary form
state
Navigational/query      URL query parameters    Search term, filters,
state                                           sort order, page
This separation avoids maintaining duplicate copies of backend data in
unrelated Redux slices. Server data is refreshed or invalidated through
RTK Query, while temporary interface interactions remain local whenever
possible.
Search Architecture
Search requests are processed by the backend rather than by downloading
all records and searching in the browser.

The initial search architecture uses PostgreSQL search capabilities,
including:
- PostgreSQL Full-Text Search for text-search use cases.
- Trigram-based indexing for supported similarity and partial-text
  search use cases.
- Parameterized database queries.
- Validation and whitelisting of supported searchable fields and query
  parameters.
Search requests follow this general flow:
1. The user enters a search term or selects filters.
2. The frontend debounces text input to avoid sending a request for
   every keystroke.
3. The frontend sends the search criteria to the API.
4. The backend validates the request and checks access permissions.
5. PostgreSQL executes the relevant search and filter query.
6. The API returns the matching page of records and pagination
   metadata.
The actual search operator and index used depend on the field and query
type. New search requirements should be evaluated against real query
patterns before adding indexes or a dedicated search engine.
Database Indexing Strategy
PostgreSQL is the primary data store. Indexes should support the queries
the application actually performs.

The indexing strategy includes:
- Primary-key indexes for record identification.
- Unique indexes for fields that must be unique.
- Foreign-key-related indexes where they improve joins and
  relationship lookups.
- B-tree indexes for common equality, range, sorting, and lookup
  operations.
- GIN indexes for supported JSONB and full-text search query patterns.
- Trigram indexes for supported similarity or partial-text searches.
Indexes should be chosen based on query patterns and verified using
PostgreSQL query plans such as EXPLAIN (ANALYZE, BUFFERS).

Important: An index is not automatically beneficial for every
column. Extra indexes consume storage and add overhead to inserts,
updates, and deletes. Review index usage and query plans as data volume
grows.
Pagination Strategy
The initial Data Explorer uses server-side offset pagination.

The client sends pagination parameters such as page number and page
size. The backend applies the corresponding limit and offset in
PostgreSQL and returns only the requested page.

A stable ordering is important for predictable results. The
implementation uses a unique record identifier as a tie-breaker when
applying sorting.
Why server-side pagination?
- Avoids transferring the complete dataset to the browser.
- Reduces response payload size and browser memory usage.
- Lets PostgreSQL perform filtering and sorting.
- Supports numbered-page navigation.
Current trade-off
Large offsets can become expensive because the database may need to scan
or skip many rows. If deep pagination becomes a performance problem,
cursor/keyset pagination can be introduced for suitable browsing
workflows.
Caching Strategy
Redis is used as a shared in-memory caching layer for selected
frequently accessed data and authentication/session-related information.

Potential cache candidates include:
- Dataset metadata and field definitions.
- Frequently requested lookup data.
- Selected analytics or other repeatable query results, when safe.
- Session-related data with a limited time-to-live (TTL).
The cache should not be treated as the source of truth; PostgreSQL
remains the primary persistent database.
Cache consistency and security
- Use TTLs to limit how long cached entries remain available.
- Invalidate or refresh affected entries when underlying data changes.
- Invalidate permission-sensitive session or authorization cache
  entries after role, permission, or membership changes.
- Never return cached data without ensuring it is scoped to the
  authenticated user and their current permissions.
- Avoid caching sensitive responses under keys that can be shared
  between users.
Cache keys, TTL values, and invalidation rules should be reviewed as the
application evolves.
Performance Optimization
DataScope uses several techniques to reduce unnecessary work across the
frontend, backend, and database:
Frontend
- Server-side pagination to limit the number of records sent to the
  browser.
- RTK Query caching to reuse suitable API responses.
- Debouncing for interactive search input.
- URL-based query state for reproducible explorer views.
- Reusable components and feature-oriented code organization.
- Avoiding unnecessary copies of server data in client state.
Backend
- Parameterized SQL queries.
- Validation and whitelisting of query parameters and
  sortable/filterable fields.
- Bounded result sizes and pagination limits.
- Redis caching for selected high-reuse data.
- Permission checks before returning protected data.
- Efficient batching for large export operations.
Database
- Indexes aligned with real query patterns.
- Database-side filtering, sorting, joins, and aggregation.
- Query-plan inspection for slow or frequently executed queries.
- Avoiding full-table data transfer for ordinary browsing operations.
Performance should be measured with representative data and realistic
concurrent workloads. The presence of caching or indexes alone does not
guarantee a performance target.
Security and Access Control
Security is enforced primarily by the backend.
- Better Auth handles authentication and session management.
- NestJS guards validate authenticated requests and role requirements.
- Permissions determine which operations a role may perform.
- Dataset membership/access rules restrict access to individual
  datasets.
- Input validation and parameterized queries reduce invalid input and
  SQL injection risks.
- The frontend hides or disables unavailable actions for usability,
  but backend checks remain mandatory.
- Secrets and database credentials must be supplied through
  environment variables and must not be committed to source control.
Never expose real production credentials, session tokens, password
hashes, or private environment files in this repository or README.
Testing Strategy
Testing is intended to cover individual units, API behavior,
authorization boundaries, and end-to-end user workflows.
Backend tests
- Unit tests for services and business logic.
- API integration tests for endpoints.
- Authentication and authorization tests for unauthenticated, Viewer,
  Analyst, and Administrator requests.
- Validation tests for search, filtering, sorting, and pagination.
- Data integrity and relationship tests.
Frontend tests
- TypeScript checks.
- Production build verification.
- Component and interaction tests where configured.
- End-to-end tests for login, role-based navigation, dataset browsing,
  and Data Explorer workflows.
Performance and security verification
- Test representative large-dataset queries.
- Inspect slow query plans.
- Verify that users cannot access datasets or fields outside their
  permissions.
- Verify cache invalidation after permission changes.
- Test export limits, cancellation, and authorization.
Run the scripts defined in each application's package.json. Test
command names can differ by repository configuration; do not assume a
script exists without checking it.
Getting Started
Prerequisites
Install or prepare the following:
- Node.js (use the version specified by the project, if an .nvmrc or
  engines field exists).
- npm.
- PostgreSQL.
- Redis.
- Git.
For Windows development using WSL, PostgreSQL and Redis may be started
from the Ubuntu distribution.
1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd DATASCOPE-PROJECT
Replace <YOUR_REPOSITORY_URL> with the actual Git repository URL.
2. Configure the backend
cd datascope-server
npm install
Create the backend environment file using the project's expected
variables. See Environment Configuration.

Run the database migration command defined in the backend package.json
and Drizzle configuration. Then seed the development data if required:
npm run db:seed
The seed command is intended for development/demo data. Review the seed
implementation before running it against any database containing
important data.
3. Start PostgreSQL and Redis
In Ubuntu/WSL, start the services if they are installed as Linux
services:
sudo service postgresql start
sudo service redis-server start
Check Redis:
redis-cli ping
Expected response:
PONG
Check PostgreSQL connectivity using the connection details configured in
the backend environment file.
4. Start the backend
From datascope-server, run the development script defined in
package.json. For example, if the project defines the standard NestJS
script:
npm run start:dev
The current local NestJS development server has been configured to use
port 5001.
5. Configure and start the frontend
Open a second terminal:
cd datascope-client
npm install
Create the frontend environment file with the correct backend API base
URL and Better Auth settings expected by the client.

Start the frontend using the script defined in its package.json. For
example:
npm run dev
The local frontend is configured to use port 3000.

Open:
http://localhost:3000
The backend health endpoint is:
http://localhost:5001/health
If a command differs from the examples above, inspect the
corresponding package.json and use the script defined by the
repository. The frontend and backend must use compatible Better Auth
configuration, database settings, secrets, and URLs.

Environment Configuration
Environment variable names and required values must match the current
source code and configuration files. The following are examples of the
settings the application needs; they are not real credentials.
Backend environment
NODE_ENV=development
PORT=5001

DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/datascope
REDIS_URL=redis://localhost:6379

BETTER_AUTH_SECRET=<GENERATE_A_LONG_RANDOM_SECRET>
BETTER_AUTH_URL=<BACKEND_OR_AUTH_BASE_URL>
Frontend environment
NEXT_PUBLIC_API_URL=http://localhost:5001
The exact frontend variable names, Better Auth base URL, trusted
origins, and cookie settings must be taken from the current client and
server configuration. Do not create duplicate variables with different
names unless the application code expects them.
Security notes
- Use strong, unique secrets.
- Do not commit .env files.
- Keep .env.example files limited to variable names and safe
  placeholders.
- Never put private server secrets in variables prefixed with
  NEXT_PUBLIC_.
- Use separate credentials and secrets for development, testing, and
  production.
- Rotate any credential that has been exposed.
Deployment Instructions
Dockerfiles, Docker Compose orchestration, and NGINX configuration have
been prepared for containerized deployment. The deployment process
should be validated before being used for production.
Before deployment
1. Review the frontend and backend Dockerfiles.
2. Review the Docker Compose file and confirm service names, ports,
   health checks, volumes, and dependency conditions.
3. Confirm that PostgreSQL and Redis use appropriate persistent/runtime
   configuration.
4. Configure production environment variables and secrets outside the
   repository.
5. Configure the public frontend and API URLs, Better Auth trusted
   origins, and secure cookie settings.
6. Confirm that database migrations run safely during deployment.
7. Review NGINX routing, TLS termination, request size limits, and
   forwarded headers.
8. Run the test suite and production builds.
Build and start containers
From the directory containing the Docker Compose file, the typical
commands are:
docker compose config
docker compose build
docker compose up -d
Check running services:
docker compose ps
View logs:
docker compose logs -f
Stop the services:
docker compose down
These are standard Docker Compose commands. The actual service names,
profiles, environment files, and migration workflow depend on the
repository's Compose configuration. Validate the configuration before
running it. Do not remove persistent volumes when stopping or updating
an environment containing data.
Production considerations
- Use HTTPS.
- Store secrets in a secure secret manager or deployment environment.
- Enable database backups and test restoration.
- Persist PostgreSQL data.
- Monitor application, database, and Redis health.
- Apply least-privilege database credentials.
- Configure appropriate resource limits and logging.
- Do not use development demo accounts or passwords in production.