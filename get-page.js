import {pages} from './db';

export default async slug => {
	const {docs: [page]} = await pages.find({
		selector: {slug},
		limit: 1
	});

	return {page: page || {}, slug, found: !!page};
};
