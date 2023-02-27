### Development

We are running our services in the Cloud using AWS. Our infrastructure is automated through the use of CloudFormation, CI/CD is handled with Github Actions, and our backend infrastructure is Containerized and on ECS.

Our cloud infrastructure has:
1. A `Production` environment which is deployed to automatically when merging into our `main` branches on Github. This is where our production environment is ran
1. A `Staging` environment which is deployed to automatically when merging into our `develop` branches on Github. This is used for final `QA` testing of features going to production.
1. `Development` environments that developers can spin up using CloudFormation to test new features while working on tickets. This is a slimmed down version of our Staging and Production environments, but it includes all core services and realistic (generated) data in the database.

### Database

1. We are using PostgreSQL as our Database and a simplified version of the schema can be seen below
```
+-------------------+               +-------------------+
|  facility         |               |  agent            |
+-------------------+               +-------------------+
|  id         uuid  |               |  id         uuid  |
|  name       string|               |  name       string|
|  ...              |               |  ...              |
|                   |               |                   |
|                   |               |                   |
|                   |               |                   |
+-------------------+               +-------------------+
          ^                                   ^
          |                                   |
          |                                   |
+---------+---------+                         |
| shift             |                         |
+-------------------+                         |
| id           uuid |                         |
| agent_id     uuid |                         |
| facility_id  uuid |                         |
| start        date +-------------------------+
| end          date |
|                   |
|                   |
|                   |
+-------------------+
```
1. Changes to the database are done through `up` migrations, but we require our engineers to also write and test `down` migrations when working on database changes, so that in the event we need to rollback we have the ability to do so.
1. Our CI/CD pipelines will automatically run any pending migrations during deployment. 

### Product

Our core services consists of the following: 

1. A PostgreSQL Database containing the data mentioned above
1. A Backend REST API that is used to perform all CRUD opertion. The API requires JWT authentication, and uses scopes to control permission.
    1. Our company has READ/WRITE access on all tables (which customer support use to address issues flagged by facilities and agents). 
    1. Agents has READ/WRITE access over their own information (`agent` table where id matches), and have READ access over the facilities on the platform (ie: they can see facilities using the platform, this is to support marking preferences)
    1. Facilities are READ/WRITE access on their own data (`facility`  table where id matches), and have limited READ/WRITE access for the `shift`, and read information on Agents. These limits allow them to update certain fields on these tables
1. A frontend application, used by Facilities and Agents.
    1. *Facilities* can control their own data on the frontend, they can view agents, and they can also view and edit their shifts.
    1. *Facilities* Agents can view and control their own data, view/filter shifts that they have had with various facilities.
