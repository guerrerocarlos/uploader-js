import sanitize from 'sanitize-filename'
import handler from '../utils/handler'
import { downloadFile } from '../utils/s3'
import checkIn from '../policies/checkIn'
import { notFound } from '../utils/httpCodes'

// POST to getUpload with:
//   { fileName: String }
// With headers:
//   Authorization: Authorization Token
//
// Results with a body in the shape of:
//   { base64File: String }
//
// Once the received credentials are validated,
// checks wether the fileName belongs to the user's files,
// then returns a base64 encoded version of the requested
// file.
//
export default handler(checkIn, async event => {
  let { fileName } = event.queryStringParameters

  if (!event.user.files.includes(fileName))
    return notFound(`The file "${fileName}" was not found`)

  let base64File
  try {
    let { Body } = await downloadFile(sanitize(fileName))
    base64File = Body.toString('base64')
  } catch (e) {
    console.info(`Failed to download file "${fileName}"`, e.message)
    throw `Failed to download file "${fileName}"`
  }

  return {
    statusCode: 200,
    body: {
      base64File
    }
  }
})
