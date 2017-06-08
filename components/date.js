import React from 'react';
import {relativeTime} from 'human-date';

export default ({date}) => <time dateTime={date.toISOString()} title={date.toLocaleString()}>
	{relativeTime(date)}
</time>;
