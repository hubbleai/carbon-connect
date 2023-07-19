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
2. `react`
3. `react-dom`
4. `react-drag-drop-files`
5. `react-icons`
6. `react-toastify`
7. `tailwindcss`

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

### Note about Google Docs

Our oAuth app is in approval phase. your users will see a warning message when they try to connect their Google account. Please ignore the warning and proceed to connect your account. We will update this section once our app is approved.

## Usage

Here's an illustrative example of how to use the `CarbonConnect` component in a Next.js project:

```jsx
import { CarbonConnect } from 'carbon-connect';
import axios from 'axios';

const tokenFetcher = async () => {
  const response = await axios.get('/api/auth/fetchCarbonTokens', {
    params: { customer_id: 'your_customer_id' },
  });

  // Just return the response data which contains the access_token.
  return response.data;
};

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
      chunkSize: 150,
      overlapSize: 15,
    },
    {
      id: 'WEB_SCRAPER',
      chunkSize: 10,
      overlapSize: 2,
    },
    {
      id: 'GOOGLE_DOCS',
      chunkSize: 1000,
      overlapSize: 35,
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
></CarbonConnect>;
```

In this example, `tokenFetcher` is a helper function that retrieves the necessary tokens for authentication. This function should be implemented in your client-side code and is designed to hit an API on your backend server. This API, in turn, requests tokens from the Carbon token creation endpoint. `maxFileSize` is set to 25,000,000 bytes and a custom button is used as the trigger to open the dialog.

Below is an example of how the backend server might request new access tokens:

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

## Regarding the return value from tokenFetcher

CarbonConnect expects an object which will be of this structure:

```
{ access_token: string }
```

## Enabling integrations

Another important prop is enabledIntegrations. This prop lets you choose which integrations to show in the component. You can also pass additional configuration for each integration. We have provided an example in the above code snippet. Here is the list of all the integrations that you can enable:

1. `LOCAL_FILES`: This integration lets you upload files from your local machine. You can pass the following configuration for this integration:

   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.
   - `maxFileSize`: This is the maximum file size in bytes that is allowed to be uploaded. Defaults to 10 MB.
   - `allowMultipleFiles`: Whether or not to allow multiple files to be uploaded at once. Defaults to `false`.
   - `allowedFileTypes`: This is an array of objects. Each object represents a file type that is allowed to be uploaded. Each object can have the following properties:
     - `extension`: The file extension of the file type. This is a required property.
     - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
     - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.

2. `NOTION`: This integration lets you upload files from your notion account. You can pass the following configuration for this integration

   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.

3. `WEB_SCRAPER`: This integration lets you scrape URLs. You can pass the following configuration for this integration:

   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.

4. `GOOGLE_DOCS`: This integration lets you upload files from your Google Docs. You can pass the following configuration for this integration:
   - `chunkSize`: This is the no.of tokens per chunk. Defaults to 1500.
   - `overlapSize`: This is the size of the overlap in tokens. Defaults to 20.

## Callback function props

1. `onSuccess`: You can let CC trigger a callback function upon successful file upload. This function will pass data in the following format:

```js
{
  status: 200,
  data: [{
    id: <File_ID>,
    name: <Name of the file>,
    source: <File Type in case of a local file>,
    external_file_id: <External File ID>,
    tags: <Tags passed in while uploading the file>,
    sync_status: <Sync status>,
  }, {
    id: <File_ID>,
    name: <Name of the file>,
    source: <File Type in case of a local file>,
    external_file_id: <External File ID>,
    tags: <Tags passed in while uploading the file>,
    sync_status: <Sync status>,
  }, ...
  ]
}
```

2. `onError`: CC will also call another call back method if there is an error while uploading file. This function will pass data in the following format:

```js
{
  status: 400,
  data: [{
    file_name: `<Name of the file>` ,
    message: `<String describing the error>`,
  },
  {
    file_name: `<Name of the file>` ,
    message: `<String describing the error>`,
  }, ...
  ]
}
```

## Get in Touch

If you have any questions, encounter any issues, please don't hesitate to reach out to us at [team@carbon.ai](mailto:team@carbon.ai). We're always delighted to hear from our users!
