*As a* facility *I want* to be able set custom internal id's for agents directly from the frontend application *so that* this information can be propagated to the PDF reports we use for our internal bookkeeping.

Update the frontend to allow facilities to set Agent's custom id and validation regex from the frontend application. 

### Acceptance Criteria

1. Facilities should be able to use our platform to add Custom Id's to Agents that have worked or are working any shifts for this facility.
1. Facitilies should be able to set validatoin parameters (regex) for the Custom Id field, to make sure that ID's aren't accidentally incorrectly entered.
1. All new functionality is adequately tested.

### Implementation

1. Create a new page (`/facility/:facility_id/agents`) which will list all of the agents that have worked or are currently working shifts for this facility. This page will use the `GET /facility/:facility_id/agents` endpoint
    1. Add search bar to this page to allow for easy searching of agents by name
    2. Add filters and sort to allow sorting by agents with most recent shifts, agents with most shifts, and agents without Custom Id (to make it easier to fill in missing entries)
1. Create a new form page (`/facility/:facility_id/agents/:agent_id`) with a `Custom Id` field that can be used to submit to the `PUT /facility/:facility_id/agents/:agent_id`
    1. This field will be validated with the `custom_id_regex` regular expression which can be retrieved from the `GET /facility/:facility_id` endpoint
1. Add unit tests for all new elements, making sure that the data is properly rendering, form validation is working, and that `OK` and `ERROR`  reponse are being handled properly on form submission.

### Estimate
2d (including documentation, and testing)

