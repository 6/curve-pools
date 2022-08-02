import moment from 'moment';
import lastUpdatedJSON from './last-updated.json';

export const lastUpdatedTimestampString = lastUpdatedJSON as { timestamp: string };
export const lastUpdatedMoment = moment(lastUpdatedTimestampString.timestamp);
