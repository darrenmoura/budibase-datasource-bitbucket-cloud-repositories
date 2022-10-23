# Budibase Datasource - Bitbucket Cloud Repositories
Manage Bitbucket Cloud repositories. Uses Bitbucket REST API V2.0, you can find the docs for it [here](https://developer.atlassian.com/cloud/bitbucket/rest/intro).

## Auth
Uses Basic Auth with an App Password. For more info on setting this up, check [here](https://developer.atlassian.com/cloud/bitbucket/rest/intro/#basic-auth). Make sure the App Password you use for this integration has the requisite Pull Request permissions.

## Pagination, sorting and filtering
The Bitbucket REST API has a consistent API for [filtering & sorting](https://developer.atlassian.com/cloud/bitbucket/rest/intro/#filtering) and for [pagination](https://developer.atlassian.com/cloud/bitbucket/rest/intro/#pagination) on requests that return a list of values.

# Trying it out
Bitbucket is free, so you can easily try out the queries in this datasource.
## Create and Update operations
Below is an example config to create a new repo (POST/PUT request body):
```json
{
	"scm": "git",
	"project": {
		"key": "BUDI"
	}
}
```