import {pages} from './db';

export default async (slug, {subpages = false, parents = false} = {}) => {
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

	let parents$ = Promise.resolve({});
	if(parents) {
		const parts = slug.split('/').filter(a => a).slice(0, -1);
		const parentSlugs = parts.reduce(
			(slugs, part) => slugs.concat(
				(slugs[slugs.length - 1] || '') + `/${part}`
			), []
		);

		parents$ = pages.find({
			selector: {
				$or: parentSlugs.map(slug => ({slug: {$eq: slug}}))
			},
		});
	}

	const {docs: [page]} = await page$;

	return {
		page: page || {},
		slug,
		found: !!page,
		subpages: (await subpages$).docs,
		parents: (await parents$).docs,
	};
};
