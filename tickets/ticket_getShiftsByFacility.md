*As a* facility *I want* to be able to retrieve Agent's internal custom id *so that* they can be used for our pdf reports to make our internal bookkeeping smoother.

Add support for retrieving facility agent custom id's in our `getShiftsByFacility` function.

### Acceptance Criteria

1. `getShiftsByFacility` should return `custom_id` information in the agent `metadata` if the given facility has provided a `custom_id` for this agent.
1. `getShiftsByFacility` should not return `custom_id` information in the agent `metadata` if the given facility has not provided a `custom_id` for this agent.
1. Integration tests are added that the above two conditions are met. 

Notes for interview: I only included Integration tests here, since the logic changes in the function is fairly simple so a unit test would be rather trival. On the other hand the integration test would make sure that our database queries are working and simultaneously test the logic for agent metadata.

### Implementation

1. Update the `getShiftsByFacilityId` query with a join to retrieve the `custom_id` from the `facility_agent` table. 
1. If present, add the `custom_id` field to the Agent metadata for the given shift.
1. Add integration tests that connects to a real and seeded database, to make sure that `custom_id` is pulled successfully when specified and omitted when not.


### Estimate
3hr (including documentation, and testing)

### Linked To:
[blocked by: Database](./ticket_database.md)
