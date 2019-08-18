import parse, { IPostgresInterval } from 'postgres-interval';

type Interval = Omit<IPostgresInterval, 'toPostgres' | 'toISO' | 'toISOString'>;

const column_interval_properties: Array<keyof Interval> = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];

export default class PostgresColumnInterval {

    protected interval: Interval = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

    constructor(value: string | Interval | PostgresColumnInterval) {
        if (typeof value === 'string') {
            value = parse(value);
        }
        if (typeof value === 'object') {
            if ('interval' in value) {
                value = value.interval as IPostgresInterval;
            }
            const interval = column_interval_properties.reduce((acc, key) => {
                if (value.hasOwnProperty(key) && value[key] != null && value[key] !== undefined) {
                    acc[key] = value[key];
                }
                return acc;
            }, {});
            Object.assign(this.interval, interval);
        }
    }

    get years(): number {
        return Number(this.interval.years || 0);
    }
    get months(): number {
        return Number(this.interval.months || 0);
    }
    get days(): number {
        return Number(this.interval.days || 0);
    }
    get hours(): number {
        return Number(this.interval.hours || 0);
    }
    get minutes(): number {
        return Number(this.interval.minutes || 0);
    }
    get seconds(): number {
        return Number(this.interval.seconds || 0);
    }
    get milliseconds(): number {
        return Number(this.interval.milliseconds || 0);
    }

    public valueOf(): Interval {
        return this.interval;
    }

    public toString(): string {
        const agg = column_interval_properties.reduce((acc, key) => {
            if (key in this.interval && this.interval[key] > 0) {
                acc.push(this[key] + ' ' + key);
            }
            return acc;
        },
        []);
        return agg.join(' ') || '0';
    }

    public toJSON(): Interval {
        return this.valueOf();
    }

    public add(d: Date): Date;
    public add(d: PostgresColumnInterval): PostgresColumnInterval;
    public add<T extends Date | PostgresColumnInterval>(d: T): T {
        if (d instanceof Date) {
            const dn = new Date((d as Date).valueOf());
            dn.setMilliseconds(dn.getMilliseconds() + this.milliseconds);
            dn.setSeconds(dn.getSeconds() + this.seconds);
            dn.setMinutes(dn.getMinutes() + this.minutes);
            dn.setHours(dn.getHours() + this.hours);
            dn.setDate(dn.getDate() + this.days);
            dn.setMonth(dn.getMonth() + this.months);
            dn.setFullYear(dn.getFullYear() + this.years);
            return dn as T;
        }
        if (d instanceof PostgresColumnInterval) {
            const dn = new PostgresColumnInterval(this.valueOf());
            dn.interval = Object.keys(dn.interval).reduce((acc, el) => {
                acc[el] = dn[el] + d[el];
                return acc;
            }, dn.interval);
            return dn as T;
        }
    }

    public sub(d: Date): Date;
    public sub(d: PostgresColumnInterval): PostgresColumnInterval;
    public sub<T extends Date | PostgresColumnInterval>(d: T): T {
        if (d instanceof Date) {
            const dn = new Date((d as Date).valueOf());
            dn.setMilliseconds(dn.getMilliseconds() - this.milliseconds);
            dn.setSeconds(dn.getSeconds() - this.seconds);
            dn.setMinutes(dn.getMinutes() - this.minutes);
            dn.setHours(dn.getHours() - this.hours);
            dn.setDate(dn.getDate() - this.days);
            dn.setMonth(dn.getMonth() - this.months);
            dn.setFullYear(dn.getFullYear() - this.years);
            return dn as T;
        }
        if (d instanceof PostgresColumnInterval) {
            const dn = new PostgresColumnInterval(this.valueOf());
            dn.interval = Object.keys(dn.interval).reduce((acc, el) => {
                acc[el] = dn[el] - d[el];
                return acc;
            }, dn.interval);
            return dn as T;
        }
    }
}

export { PostgresColumnInterval };
