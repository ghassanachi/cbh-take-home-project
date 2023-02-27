*As a* facility *I want* to be able to store custom internal id's for agents working shifts *so that* my bookeeping can be improved.

Currently out database does not support custom agent id's per facility, and we need to make the necessary databases changes to support these.

### Acceptance Criteria

1. A single agent can (optionally) have multiple Custom Id for each for the Facilities he has worked in
1. Once a facility has assigned a Custom Id to an Agent, that Id should be associated with him reguardless of the Shift.
1. Up and Down migration added for easy rollout and rollback. To ensure these are working properly they will be tested both locally and on a cloud  `Development` environment.

### Implementation


1. Up migration:
    1. Create a new database table `facility_agent` which links facilities to agents. The table will contain the following fiels `agent_id`, `facility_id` and `custom_id`. Add a unique containt on `agent_id` and `facility_id`
    1. Add a (optional/nullable) Regex column to the `facility` table called `custom_id_regex` which contains a regular expression that can be used to validate agents `custom_id` field.
    1. Create `facility_agent` records using historical data from shifts that already present in the platform.
1. Down migration:
    1. Drop the `facility_agent` table
    1. Remove the `custom_id_regex` field from `facility`

Notes: The `facility_agent` table is additive to the existing database schema, we are crucially not removing any existing foreign keys/links between our existing tables, so this migration will not impact the existing system/queries and this will be tested locally and on the cloud prior to going into Code Review.


### Resources
[Proposed Database Schema](./new_schema.txt)

### Estimate
4hr (including documentation, local and cloud testing)

