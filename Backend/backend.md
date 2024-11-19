## difference between dev dependency and dependencies?
"dependencies" : Packages required by your application in production. 
"devDependencies" : Packages that are only needed for local development 
and testing.

## Cookie-parser and cors
Parse Cookie header and populate req.cookies with an object keyed by the 
cookie names. Optionally you may enable signed cookie support by passing 
a secret string, which assigns req.secret so it may be used by other 
middleware.

Create a new cookie parser middleware function using the given secret 
and options.

1) secret a string or array used for signing cookies. This is optional 
and if not specified, will not parse signed cookies. If a string is 
provided, this is used as the secret. If an array is provided, an 
attempt will be made to unsign the cookie with each secret in order.
2) options an object that is passed to cookie.parse as the second 
option. See cookie for more information.
decode a function to decode the value of the cookie

CORS is a node.js package for providing a Connect/Express middleware 
that can be used to enable CORS with various options.
1) origin: Configures the Access-Control-Allow-Origin CORS header. 
Possible values: boolean , string , array
2) methods: Configures the Access-Control-Allow-Methods CORS header. 
Expects a comma-delimited string (ex: 'GET,PUT,POST') or an array
3) allowedHeaders: Configures the Access-Control-Allow-Headers CORS 
header. Expects a comma-delimited string (ex: 'Content-Type,
Authorization') or an array (ex: ['Content-Type', 'Authorization'])

## Middleware 
Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.

Middleware functions can perform the following tasks:

1) Execute any code.
2) Make changes to the request and the response objects.
3) End the request-response cycle.
4) Call the next middleware in the stack.
If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

Mongoose has 4 types of middleware: document middleware, model middleware, aggregate middleware, and query middleware.
### Pre Hooks
Pre middleware functions are executed one after another, when each middleware calls next.
Document middleware is supported for the following document functions. In Mongoose, a document is an instance of a Model class. In 
document middleware functions, this refers to the document. To access the model, use this.constructor.

validate
save
updateOne
deleteOne
init (note: init hooks are synchronous)

## Http error codes
HTTP response status codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped in five 
classes:

Informational responses (100 – 199)
Successful responses (200 – 299)
Redirection messages (300 – 399)
Client error responses (400 – 499)
Server error responses (500 – 599)

## Bcrypt and JWT
Bcrypt is used to hash your password

JWT -
jwt.sign(payload, secretOrPrivateKey, [options, callback])
(Asynchronous) If a callback is supplied, the callback is called with the err or the JWT.

(Synchronous) Returns the JsonWebToken as string
payload could be an object literal, buffer or string representing valid JSON.

JWT is a bearer token
- A Bearer token is a type of token used for authentication and authorization and is used in web applications and APIs to hold user 
credentials and indicate authorization for requests and access.


### Type of Token
There are many types of token, although in authentication with JWT the most typical are access token and refresh token.

1) Access token: It contains all the information the server needs to know if the user / device can access the resource you are
requesting or not. They are usually expired tokens with a short validity period.

2) Refresh token: The refresh token is used to generate a new access token. Typically, if the access token has an expiration date, once 
it expires, the user would have to authenticate again to obtain an access token. With refresh token, this step can be skipped and with 
a request to the API get a new access token that allows the user to continue accessing the application resources.


### Mongoose.findbyid
Model.findByIdAndUpdate(id, update, options, callback);
Parameters:
id: The ID of the document you want to update.
update: An object containing the fields and values you want to update.
options: (Optional) An object specifying options such as new, upsert, runValidators, etc.
new: If set to true, returns the modified document rather than the original. Defaults to false.
upsert: If true, creates the document if it doesn’t exist. Defaults to false.
runValidators: If true, runs schema validation during the update. Defaults to false.
callback: (Optional) A callback function that is called after the update is complete. Alternatively, you can use .then() and .catch() for promises.

### Mongoose.findOne
Returns one document that satisfies the specified query criteria on the collection or view.
The returned document may vary depending on the number of documents that match the query criteria, and the query plan used

```
db.collection.findOne( <query>, <projection>, <options> )
```

### Aggregation Pipeline
An aggregation pipeline consists of one or more stages that process documents:
1) Each stage performs an operation on the input documents. For example, a stage can filter documents, group documents, and calculate values.
2) The documents that are output from a stage are passed to the next stage.
3) An aggregation pipeline can return results for groups of documents. For example, return the total, average, maximum, and minimum values.

### 
