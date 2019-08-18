import PostgresColumnInterval from '../src/index';
import parse from 'postgres-interval';

test('#ctor', async () => {
    expect.assertions(5);
    const pi = new PostgresColumnInterval('00:05:00');
    expect(pi instanceof PostgresColumnInterval).toBe(true);
    expect(pi.minutes).toBe(5);
    expect(pi.years).toBe(0);
    expect(pi).toEqual(new PostgresColumnInterval(parse('00:05:00')));
    expect(pi).toEqual(new PostgresColumnInterval(pi));
});

test('#add', async () => {
    expect.assertions(3);
    const pi = new PostgresColumnInterval('00:05:00');
    const pi2 = pi.add(pi);
    expect(pi2.minutes).toBe(10);

    const d1 = new Date('2014-03-09T01:59:00');
    const d2 = pi.add(d1);
    expect(d1).toEqual(d1);
    expect(d2).toEqual(new Date('2014-03-09T02:04:00'));
});

test('#sub', async () => {
    expect.assertions(3);
    const pi = new PostgresColumnInterval('00:05:00');
    const pi3 = pi.sub(pi);
    expect(pi3.minutes).toBe(0);

    const d1 = new Date('2014-03-09T01:59:00');
    const d2 = pi.sub(d1);
    expect(d1).toEqual(d1);
    expect(d2).toEqual(new Date('2014-03-09T01:54:00'));
});

test('#string', async () => {
    expect.assertions(1);
    const pi = new PostgresColumnInterval('00:05:00');
    expect(pi.toString()).toBe('5 minutes');
});
