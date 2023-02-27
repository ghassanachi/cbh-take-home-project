# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

For these tickets I made some [Assumptions](./tickets/assumptions.md) about the company. The file details some of the assumptions I made.

### Add Database support for Facility Agent Custom Id 

*As a* facility *I want* to be able to store custom internal id's for agents working shifts *so that* my bookeeping can be improved.

Currently out database does not support custom agent id's per facility, and we need to make the necessary databases changes to support these.

##### Acceptance Criteria

1. A single agent can (optionally) have multiple Custom Id for each for the Facilities he has worked in
1. Once a facility has assigned a Custom Id to an Agent, that Id should be associated with him reguardless of the Shift.
1. Up and Down migration added for easy rollout and rollback. To ensure these are working properly they will be tested both locally and on a cloud  `Development` environment.

##### Implementation


1. Up migration:
    1. Create a new database table `facility_agent` which links facilities to agents. The table will contain the following fiels `agent_id`, `facility_id` and `custom_id`. Add a unique containt on `agent_id` and `facility_id`
    1. Add a (optional/nullable) Regex column to the `facility` table called `custom_id_regex` which contains a regular expression that can be used to validate agents `custom_id` field.
    1. Create `facility_agent` records using historical data from shifts that already present in the platform.
1. Down migration:
    1. Drop the `facility_agent` table
    1. Remove the `custom_id_regex` field from `facility`

Notes: The `facility_agent` table is additive to the existing database schema, we are crucially not removing any existing foreign keys/links between our existing tables, so this migration will not impact the existing system/queries and this will be tested locally and on the cloud prior to going into Code Review.

##### Resources
[Proposed Database Schema](./tickets/new_schema.txt)

#### Estimate
4hr (including documentation, local and cloud testing)


### Handle loading Custom Id and Facility shift retrieval
*As a* facility *I want* to be able to retrieve Agent's internal custom id *so that* they can be used for our pdf reports to make our internal bookkeeping smoother.

Add support for retrieving facility agent custom id's in our `getShiftsByFacility` function.

##### Acceptance Criteria

1. `getShiftsByFacility` should return `custom_id` information in the agent `metadata` if the given facility has provided a `custom_id` for this agent.
1. `getShiftsByFacility` should not return `custom_id` information in the agent `metadata` if the given facility has not provided a `custom_id` for this agent.
1. Integration tests are added that the above two conditions are met. 

Notes for interview: I only included Integration tests here, since the logic changes in the function is fairly simple so a unit test would be rather trival. On the other hand the integration test would make sure that our database queries are working and simultaneously test the logic for agent metadata.

##### Implementation

1. Update the `getShiftsByFacilityId` query with a join to retrieve the `custom_id` from the `facility_agent` table. 
1. If present, add the `custom_id` field to the Agent metadata for the given shift.
1. Add integration tests that connects to a real and seeded database, to make sure that `custom_id` is pulled successfully when specified and omitted when not.

##### Estimate
3hr (including documentation, and testing)

##### Linked To:
[blocked by: Database](./tickets/ticket_database.md)

### Update PDF generation to include Custom Facility Agent Id
*As a* facility *I want* to be able to see Agent's internal custom id on our pdf reports *so that* bookkeeping can be made easier.

Update `generateReport` function to include Agent's `custom_id` if present.

##### Acceptance Criteria

1. `generateReport` should include the Agent's Custom Id as a seperate field in the pdf if the facility has specified a Custom Id for the Agent. 
1. `generateReport` should leave the Custom Id field back for an Agent that does not have a specified Custom Id. 
1. Tests are added to check that the above two cases are handled properly.
1. PDF format has been visually checked with various Custom ID formats to make sure that the layout is not broken.

##### Implementation

1. Add the `Custom Id` field the Agent section of the pdf report.
    1. The value for the field is `N/A` if no `custom_id` is provided in the metadata for the agent, otherwise use the `custom_id` value.
1. Unit tests are added to make sure that the `Custom Id` field is present, and that the value is filled properly when `custom_id` is provided.

Note: Since PDF format is not easily parsed, we'll use a unique string (uuid for example) for the Custom ID and used a simple find operation to make sure that the ID is indeed embedded into the PDF. 

##### Estimate
3hr (including documentation, and testing)

##### Linked To:
[blocked by: getShiftsByFacility](./tickets/ticket_getShiftsByFacility.md)

### Add support for Facility Custom Agent Id in our REST API Backend
*As a* facility *I want* to be able set custom internal id's for agents working shifts *so that* we have an easier time reconciliating the data coming from `Clipboard Health Interview Inc` and our bookkeeping.

Our backend services lack support for the new Custom Id field that has been added, and we need to update our API's to handle these fields.

##### Acceptance Criteria

1. Facilities have the ability to add Custom Id's to Agents that have worked/are working for them through the use of our API
1. If an `custom_id_regex` has been provided, then the backend validates that the custom id is in the correct format.
1. All new functionality is adequately tested.

##### Implementation

1. Update the `PUT|POST /facility/:facility_id` handler to accept a `custom_id_regex` field which is then saved to the database in the `facility` table.
1. Update the `GET /facility/:facility_id` handler to return the `custom_id_regex` field.
1. Create the `GET /facility/:facility_id/agents` endpoints/handler which will return all agents that have worked for this facility. This endpoint will be filterable on `Most Recent`, `Most Shifts` and `No Custom Id`
1. Create the `PUT /facility/:facility_id/agent/:agent_id` handler to accept a `custom_id` field which is (optionally) validated and saved to the database in the `facility_agent` table.
1. Update the `PUT /shifts/:shift_id/book/:agent_id` so that it automatically generates the `facility_agent` record for the agent in question assuming it is not already present in the database.
1. Add unit tests for the handlers, to make sure that validation is properly being applied and that the DB calls include or omit the `custom_id` field appropriately.

Notes for interview: 
1. We are doing the regex validation at the API level, as opposed to the Database level for a couple reasons. 1) it allows facilities to change the validation in case requirements change, without potentially causing Constraints at the DB level. 2) Validation of this type at the DB level would require a `ON UPDATE | ON CREATE` trigger, which could cause some performance issues. 3) I am working under the assumption that all READ/WRITE operation go through the API.
1. Only the `PUT` route for the `custom_id` field is required, since my assumption is that this entry in the database is automatically generated when a agent is assigned to a shift for a facility. And this would only happen the first time the agent is assigned this this facility, on subsequent shifts booked this would reuse the same table.

##### Estimate
2d (including documentation, and testing)

##### Linked To:
[blocked by: database](./tickets/ticket_database.md)


### Add frontend support for Facility Custom Agent Id 

*As a* facility *I want* to be able set custom internal id's for agents directly from the frontend application *so that* this information can be propagated to the PDF reports we use for our internal bookkeeping.

Update the frontend to allow facilities to set Agent's custom id and validation regex from the frontend application. 

##### Acceptance Criteria

1. Facilities should be able to use our platform to add Custom Id's to Agents that have worked or are working any shifts for this facility.
1. Facitilies should be able to set validatoin parameters (regex) for the Custom Id field, to make sure that ID's aren't accidentally incorrectly entered.
1. All new functionality is adequately tested.

##### Implementation

1. Create a new page (`/facility/:facility_id/agents`) which will list all of the agents that have worked or are currently working shifts for this facility. This page will use the `GET /facility/:facility_id/agents` endpoint
    1. Add search bar to this page to allow for easy searching of agents by name
    2. Add filters and sort to allow sorting by agents with most recent shifts, agents with most shifts, and agents without Custom Id (to make it easier to fill in missing entries)
1. Create a new form page (`/facility/:facility_id/agents/:agent_id`) with a `Custom Id` field that can be used to submit to the `PUT /facility/:facility_id/agents/:agent_id`
    1. This field will be validated with the `custom_id_regex` regular expression which can be retrieved from the `GET /facility/:facility_id` endpoint
1. Add unit tests for all new elements, making sure that the data is properly rendering, form validation is working, and that `OK` and `ERROR`  reponse are being handled properly on form submission.

##### Estimate
2d (including documentation, and testing)

##### Linked To:
[blocked by: backend](./tickets/ticket_backend.md)
