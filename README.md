# Carbon Connect

Carbon Connect is a React component designed for managing integrations with a variety of data sources.

## Installation

To install Carbon Connect, use npm as follows:

```bash
npm install carbon-connect
```

## Prerequisites

The package expects the following npm packages to be installed in your project:

1. `@radix-ui/react-dialog`
2. `"lodash": "^4.17.21`
3. `react`
4. `react-dom`
5. `react-drag-drop-files`
6. `react-icons`
7. `react-toastify`
8. `tailwindcss`

Please check for the versions from `package.json` if you encounter a version mismatch error.

## Component Properties

The `CarbonConnect` component accepts the following properties:

| Property                   | Type            | Required? | Description                                                                                                             |
| -------------------------- | --------------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `brandIcon`                | String          | Yes       | A URL or a local path to your organization's brand icon.                                                                |
| `orgName`                  | String          | Yes       | The name of your organization. This is displayed in the initial announcement modal view.                                |
| `tokenFetcher`             | Function        | Yes       | A function that returns a promise which resolves with the access and refresh tokens.                                    |
| `onSuccess`                | Function        | No        | A callback function that will be called after the file upload is successful.                                            |
| `onError`                  | Function        | No        | A callback function that will be called if there is any error in the file upload.                                       |
| `children`                 | React Node(JSX) | No        | You can pass any valid React node that will be used as a trigger to open the component.                                 |
| `entryPoint`               | String          | No        | The initial active step when the component loads. Default entry point is 'LOCAL_FILES'. More integrations are upcoming. |
| `maxFileSize`              | Number          | No        | Maximum file size in bytes that is allowed to be uploaded. Defaults to 10 MB                                            |
| `tags`                     | Object          | No        | Any additional data you want to associate with the component's state, such as an app ID.                                |
| `enabledIntegrations`      | dict            | No        | Let's you choose which 3rd party integrations to show. See below for more details about this prop                       |
| `primaryBackgroundColor`   | String          | No        | The primary background color of the component. Defaults to `#000000`.                                                   |
| `primaryTextColor`         | String          | No        | The primary text color of the component. Defaults to `#FFFFFF`.                                                         |
| `secondaryBackgroundColor` | String          | No        | The secondary background color of the component. Defaults to `#FFFFFF`.                                                 |
| `secondaryTextColor`       | String          | No        | The secondary text color of the component. Defaults to `#000000`.                                                       |
| `allowMultipleFiles`       | Boolean         | No        | Whether or not to allow multiple files to be uploaded at once. Defaults to `false`.                                     |
| `chunkSize`                | Number          | No        | The no.of tokens per chunk. Defaults to 1500.                                                                           |
| `overlapSize`              | Number          | No        | The no.of tokens to overlap between chunks. Defaults to 20.                                                             |
| `open`                     | Boolean         | No        | Whether or not to open the component. Defaults to `false`.                                                              |
| `setOpen`                  | Function        | No        | A function that will be called to set the open state of the component. Defaults to `None`.                              |
| `tosURL`                   | String          | No        | A URL to your organization's terms of service. Defaults to `https://carbon.ai/terms`.                                   |
| `privacyPolicyURL`         | String          | No        | A URL to your organization's privacy policy. Defaults to `https://carbon.ai/privacy`.                                   |
| `navigateBackURL`          | String          | No        | A URL to your intended destination. Defaults to `None`.                                                                 |

When u do not pass `open` or `setOpen`, CC will manage the open state internally. If you pass `open` and `setOpen`, you will have to manage the open state yourself.

### Note about Google Docs

Our oAuth app is in approval phase. your users will see a warning message when they try to connect their Google account. Please ignore the warning and proceed to connect your account. We will update this section once our app is approved.

## Usage

This section demonstrates how to integrate the CarbonConnect component within a Next.js project.

### Client Side Configuration

1. Import necessary libraries and components:

```jsx
import { CarbonConnect } from 'carbon-connect';
import axios from 'axios';
```

2. Token Retrieval:
   Set up the tokenFetcher function. It's designed to request authentication tokens from your backend:

```js
const tokenFetcher = async () => {
  const response = await axios.get('/api/auth/fetchCarbonTokens', {
    params: { customer_id: 'your_customer_id' },
  });
  return response.data; // Must return data containing access_token
};
```

3. Implement CarbonConnect Component:
   Here's a concise usage example. Customize according to your requirements:

```jsx
<CarbonConnect
  orgName="Your Organization"
  brandIcon="path/to/your/brand/icon"
  tokenFetcher={tokenFetcher}
  tags={{
    tag1: 'tag1_value',
    tag2: 'tag2_value',
    tag3: 'tag3_value',
  }}
  maxFileSize={10000000}
  enabledIntegrations={[
    {
      id: 'LOCAL_FILES',
      chunkSize: 100,
      overlapSize: 10,
      maxFileSize: 20000000,
      allowMultipleFiles: true,
      maxFilesCount: 5,
      allowedFileTypes: [
        {
          extension: 'csv',
          chunkSize: 1200,
          overlapSize: 120,
        },
        {
          extension: 'txt',
          chunkSize: 1599,
          overlapSize: 210,
        },
        {
          extension: 'pdf',
        },
      ],
    },
    {
      id: 'NOTION',
      chunkSize: 1500,
      overlapSize: 20,
    },
    {
      id: 'WEB_SCRAPER',
      chunkSize: 1500,
      overlapSize: 20,
    },
    {
      id: 'GOOGLE_DRIVE',
      chunkSize: 1000,
      overlapSize: 20,
    },
  ]}
  onSuccess={(data) => console.log('Data on Success: ', data)}
  onError={(error) => console.log('Data on Error: ', error)}
  primaryBackgroundColor="#F2F2F2"
  primaryTextColor="#555555"
  secondaryBackgroundColor="#f2f2f2"
  secondaryTextColor="#000000"
  allowMultipleFiles={true}
  open={true}
  chunkSize={1500}
  overlapSize={20}
  // entryPoint="LOCAL_FILES"
></CarbonConnect>
```

### Server Side Configuration

Your backend should handle token requests like this:

```js
const response = await axios.get('https://api.carbon.ai/auth/v1/access_token', {
  headers: {
    'Content-Type': 'application/json',
    'customer-id': '<YOUR_USER_UNIQUE_IDENTIFIER>',
    authorization: 'Bearer <YOUR_API_KEY>',
  },
});
if (response.status === 200 && response.data) {
  res.status(200).json(response.data);
}
```

### Return Value Expectation:

Ensure that your tokenFetcher returns an object structured as:

```js
{
  access_token: string;
}
```

## Enabling integrations

Another important prop is enabledIntegrations. This prop lets you choose which integrations to show in the component. You can also pass additional configuration for each integration. We have provided an example in the above code snippet. Here is the list of all the integrations that you can enable:

1. `LOCAL_FILES`: This integration lets you upload files from your local machine. You can pass the following configuration for this integration:

   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.
   - `maxFileSize`: This is the maximum file size in bytes that is allowed to be uploaded. Defaults to 10 MB.
   - `allowMultipleFiles`: Whether or not to allow multiple files to be uploaded at once. Defaults to `false`.
   - `maxFilesCount`: This is the maximum no.of files that can be uploaded at once. Defaults to 10.
   - `skipEmbeddingGeneration`: Whether or not to skip embeddings generation. Defaults to `false`.
   - `allowedFileTypes`: This is an array of objects. Each object represents a file type that is allowed to be uploaded. Each object can have the following properties:
     - `extension`: The file extension of the file type. This is a required property.
     - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
     - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.
     - `skipEmbeddingGeneration`: Whether or not to skip embeddings generation. Defaults to `false`.

2. `NOTION`: This integration lets you upload files from your notion account. You can pass the following configuration for this integration

   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.
   - `skipEmbeddingGeneration`: Whether or not to skip embeddings generation. Defaults to `false`.

3. `WEB_SCRAPER`: This integration lets you scrape URLs. You can pass the following configuration for this integration:

   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.
   - `skipEmbeddingGeneration`: Whether or not to skip embeddings generation. Defaults to `false`.

4. `GOOGLE_DRIVE`: This integration lets you upload files from your Google Docs. You can pass the following configuration for this integration:

   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.
   - `skipEmbeddingGeneration`: Whether or not to skip embeddings generation. Defaults to `false`.

5. `INTERCOM`: This integration lets you select pages from your Intercom. You can pass the following configuration for this integration:

   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.
   - `skipEmbeddingGeneration`: Whether or not to skip embeddings generation. Defaults to `false`.

6. `DROPBOX`: This integration lets you upload files from your Dropbox. You can pass the following configuration for this integration:

   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.
   - `skipEmbeddingGeneration`: Whether or not to skip embeddings generation. Defaults to `false`.

7. `ONEDRIVE`: This integration lets you upload files from your Onedrive. You can pass the following configuration for this integration:
   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.
   - `skipEmbeddingGeneration`: Whether or not to skip embeddings generation. Defaults to `false`.

## Callback function props

1. `onSuccess`: You can let CC trigger a callback function upon successful file upload, 3rd party account connection and file selection, Webscraping request initiation. This function will pass data in the following format:

```js
{
  status: 200,
  data: [Object 1, Object 2, ...] or null,
  action: <ACTION_TYPE>, // `ACTION_TYPE` can be one of the following: `INITIATE`, `ADD`, `UPDATE`, `CANCEL`
  event: <EVENT_TYPE>, // `EVENT_TYPE` can be one of the following: `INITIATE`, `ADD`, `UPDATE`, `CANCEL`
  integration: <INTEGRATION_NAME>, // `INTEGRATION_NAME` can be one of the following: `LOCAL_FILES`, `NOTION`, `WEB_SCRAPER`, `GOOGLE_DRIVE`, `INTERCOM`, `DROPBOX`, `ONEDRIVE`
}
```

2. `onError`: CC will also call another call back method if there is an error while uploading file. This function will pass data in the following format:

```js
{
  status: 400,
  action: 'UPDATE',
  event: 'UPDATE',
  integration: `<INTEGRATION_NAME>`, // 'LOCAL_FILES' or 'WEB_SCRAPER',
  data: `<data_object>`, // This field will be present only if the error is related to a file or web scraper
}
```

### `onSuccess`` Event Types

1. `INITIATE`: This event type is triggered when a user enters the integration flow (either for auth or file selection)
2. `ADD`: This event type is triggered when a user authenticates an account under an integration.
3. `UPDATE`: This event type is triggered when a user adds or removes files for an integration. We’ll list the files added or removed.
4. `CANCEL`: This event type is triggered when when a user exits the integration flow without taking any action.

### Data format for `onSuccess` callback

The `data` field will contain the following information:

1. For `LOCAL_FILES`: An array of objects in the following format

```js
{
    id: <File_ID>,
    name: <Name of the file>,
    source: <File Type in case of a local file>,
    external_file_id: <External File ID>,
    tags: <Tags passed in while uploading the file>,
    sync_status: <Sync status>,
  }
```

2. For `WEB_SCRAPER`: An array containing only one object in the following format

```js
{
  urls: `<Array of user inputed URLs>`,
  validUrls: `<Array of valid URLs>`,
  tags: `<Tags passed in to the CC>`,
}
```

3. For 3rd party integrations: An array containing only one object in the following format

```js
{
  data_source_external_id: `<Email address of the Notion account>`,
  sync_status: `<Sync status>`,
  data: `<Array of objects corresponding to the files / pages selected>`,
}
```

Each file object will be in the following format:

```js
{
    "id": `Unique ID for the file, can be used for resyncing, deleting, updating tags etc.`,
    "source": `<integration_name>`, // One among `LOCAL_FILES`, `NOTION`, `WEB_SCRAPER`, `GOOGLE_DRIVE`, `INTERCOM`, `DROPBOX`, `ONEDRIVE`
    "organization_id": `<organization_id>`, // This is your unique organization id in carbon
    "organization_supplied_user_id": `<organization_supplied_user_id>`, // This is the unique user id that you pass to CC
    "organization_user_data_source_id": `<organization_user_data_source_id>`, // This is the unique user data source id that CC creates for each user for each integration
    "external_file_id": `<external_file_id>`, // This is the unique file id in the 3rd party integration
    "external_url": `<external_url>`, // This is the unique url of the file in the 3rd party integration
    "sync_status": `<sync_status>`, // This is the sync status of the file. It can be one of the following: `READY`, `QUEUED_FOR_SYNCING`, `SYNCING`, `SYNC_ERROR`
    "last_sync": `<last_sync>`, // This is the timestamp of the last sync
    "tags": `<tags>`, // These are the tags passed in to CC
    "file_statistics": `<file_statistics>`, // This is the file statistics object
    "file_metadata": `<file_metadata>`, // This is the file metadata object
    "chunk_size":   `<chunk_size>`, // This is the chunk size used for the file
    "chunk_overlap": `<chunk_overlap>`, // This is the chunk overlap used for the file
    "name": `<name>`, // This is the name of the file
    "enable_auto_sync": `<enable_auto_sync>`, // This is the auto sync status of the file. This is a boolean flag
    "presigned_url": `<presigned_url>`, // This is the presigned url of the file
    "parsed_text_url": `<parsed_text_url>`, // This is the parsed text url of the file
    "skip_embedding_generation": `<skip_embedding_generation>`, // This is the skip embedding generation status of the file. This is a boolean flag
    "created_at": `<created_at>`, // This is the timestamp of the file creation
    "updated_at": `<updated_at>`, // This is the timestamp of the file updation
    "action": `<action>`, // This is the action type. It can be one of the following: `ADD`, `UPDATE`, `REMOVE`
}
```

## Get in Touch

If you have any questions, encounter any issues, please don't hesitate to reach out to us at [team@carbon.ai](mailto:team@carbon.ai). We're always delighted to hear from our users!
