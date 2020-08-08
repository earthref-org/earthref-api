import { NowRequest, NowResponse } from '@vercel/node';

export default (request: NowRequest, response: NowResponse): void => {
	const { version, portal, path } = request.query;
	response.status(200).send(`${version} ${portal} ${path}!`);
};
