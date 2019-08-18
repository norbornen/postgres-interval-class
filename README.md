# postgres-interval-class

Manipulations with Postgres interval columns

## Installation

Install this [package](https://npmjs.org/package/postgres-interval-class) in your project:

    $ npm install --save postgres-interval-class

## Adding to your project

### In Node.js

Call require to get the instance:
```js
const { PostgresColumnInterval } = require('postgres-interval-class');
```

Or in ES6 and TS:
```typescript
import PostgresColumnInterval from 'postgres-interval-class';
```

## Usage
```typescript
const pi = new PostgresColumnInterval('00:15:00');

pi.add(new PostgresColumnInterval('00:05:00'));

pi.add(new Date('2014-03-09T01:59:00'));

pi.sub(new PostgresColumnInterval('00:05:00'));

pi.sub(new Date('2014-03-09T01:59:00'));

pi.toString();
pi.toJSON();
```
