*As a* facility *I want* to be able to see Agent's internal custom id on our pdf reports *so that* bookkeeping can be made easier.

Update `generateReport` function to include Agent's `custom_id` if present.

### Acceptance Criteria

1. `generateReport` should include the Agent's Custom Id as a seperate field in the pdf if the facility has specified a Custom Id for the Agent. 
1. `generateReport` should leave the Custom Id field back for an Agent that does not have a specified Custom Id. 
1. Tests are added to check that the above two cases are handled properly.
1. PDF format has been visually checked with various Custom ID formats to make sure that the layout is not broken.

### Implementation

1. Add the `Custom Id` field the Agent section of the pdf report.
    1. The value for the field is `N/A` if no `custom_id` is provided in the metadata for the agent, otherwise use the `custom_id` value.
1. Unit tests are added to make sure that the `Custom Id` field is present, and that the value is filled properly when `custom_id` is provided.

Note: Since PDF format is not easily parsed, we'll use a unique string (uuid for example) for the Custom ID and used a simple find operation to make sure that the ID is indeed embedded into the PDF. 


### Estimate
3hr (including documentation, and testing)

### Linked To:
[blocked by: getShiftsByFacility](./ticket_getShiftsByFacility.md.md)
