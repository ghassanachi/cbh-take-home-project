*As a* facility *I want* to be able set custom internal id's for agents working shifts *so that* we have an easier time reconciliating the data coming from `Clipboard Health Interview Inc` and our bookkeeping.

Our backend services lack support for the new Custom Id field that has been added, and we need to update our API's to handle these fields.

### Acceptance Criteria

1. Facilities have the ability to add Custom Id's to Agents that have worked/are working for them through the use of our API
1. If an `custom_id_regex` has been provided, then the backend validates that the custom id is in the correct format.
1. All new functionality is adequately tested.

### Implementation

1. Update the `PUT|POST /facility/:facility_id` handler to accept a `custom_id_regex` field which is then saved to the database in the `facility` table.
1. Update the `GET /facility/:facility_id` handler to return the `custom_id_regex` field.
1. Create the `GET /facility/:facility_id/agents` endpoints/handler which will return all agents that have worked for this facility. This endpoint will be filterable on `Most Recent`, `Most Shifts` and `No Custom Id`
1. Create the `PUT /facility/:facility_id/agent/:agent_id` handler to accept a `custom_id` field which is (optionally) validated and saved to the database in the `facility_agent` table.
1. Update the `PUT /shifts/:shift_id/book/:agent_id` so that it automatically generates the `facility_agent` record for the agent in question assuming it is not already present in the database.
1. Add unit tests for the handlers, to make sure that validation is properly being applied and that the DB calls include or omit the `custom_id` field appropriately.

Notes for interview: 
1. We are doing the regex validation at the API level, as opposed to the Database level for a couple reasons. 1) it allows facilities to change the validation in case requirements change, without potentially causing Constraints at the DB level. 2) Validation of this type at the DB level would require a `ON UPDATE | ON CREATE` trigger, which could cause some performance issues. 3) I am working under the assumption that all READ/WRITE operation go through the API.
1. Only the `PUT` route for the `custom_id` field is required, since my assumption is that this entry in the database is automatically generated when a agent is assigned to a shift for a facility. And this would only happen the first time the agent is assigned this this facility, on subsequent shifts booked this would reuse the same table.


### Estimate
2d (including documentation, and testing)

