import { TReq, TRes } from '../interfaces/httpParams'

export function checkSessionIdExists(req: TReq, res: TRes, done: Function) {
	const sessionId = req.cookies.sessionId

	console.log('::: Check Cookies :::', req.cookies)

	if (!sessionId) {
		return res.status(401).send({
			message: 'Unauthorized',
		})
	}

	done()
}
