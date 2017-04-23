import {pages} from './db';

export default async (slug, {subpages = false} = {}) => {
	const page$ = pages.find({
		selector: {slug},
		limit: 1,
	});

	let subpages$ = Promise.resolve({});

	if(subpages) {
		subpages$ = pages.find({
			selector: {
				slug: {
					$regex: `^${slug}/`,
				},
			},
		});
	}

	const {docs: [page]} = await page$;

	return {
		page: page || {},
		slug,
		found: !!page,
		subpages: (await subpages$).docs,
	};
};
