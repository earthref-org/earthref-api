import { NowRequest, NowResponse } from '@vercel/node';

export default (request: NowRequest, response: NowResponse): void => {
	response.status(404).send({
		err: `Endpoint ${request.url} is not defined for this API. Please refer to the documentation.`,
	});
};
