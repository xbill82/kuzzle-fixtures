# Kuzzle Fixtures

A simple CLI to add fixtures to your Kuzzle server. It uses Faker under the hood and it is somehow customizable.

```
$ kuzzle-fixtures --help
Usage: index [options]

Options:
  -V, --version            output the version number
  -h, --host [name]        Kuzzle hostname (default: localhost)
  -p, --port <port>        Kuzzle port (default: 7512)
  -i, --index [name]       The name of the index to create (default: testindex)
  -c, --collection [name]  The name of the collection to create (default: testcollection)
  -n, --items <number>     The number of items to be added as fixtures (default: 100)
  -m, --mapping [path]     The path to a file containing the mapping for the collection
  -h, --help               output usage information
```

The content of the items is hardcoded as follows

```javascript
{
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  job: faker.name.jobTitle()
}
```
