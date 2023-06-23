# Carbon Connect

Carbon Connect is a robust React component designed for managing integrations with a variety of data sources. Carbon Connect provides an intuitive and flexible interface for your data management needs.

## Installation

To install Carbon Connect, use npm as follows:

```bash
npm install carbon-connect
```

Here's an updated version of your table:

## Component Properties

The `CarbonConnect` component accepts the following properties:

| Property              | Type             | Required? | Description                                                                                                             |
| --------------------- | ---------------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `brandIcon`           | String           | Yes       | A URL or a local path to your organization's brand icon.                                                                |
| `orgName`             | String           | Yes       | The name of your organization. This is displayed in the initial announcement modal view.                                |
| `tokenFetcher`        | Function         | Yes       | A function that returns a promise which resolves with the access and refresh tokens.                                    |
| `children`            | React Node(JSX)  | No        | You can pass any valid React node that will be used as a trigger to open the component.                                 |
| `entryPoint`          | String           | No        | The initial active step when the component loads. Default entry point is 'LOCAL_FILES'. More integrations are upcoming. |
| `maxFileSize`         | Number           | No        | Maximum file size in bytes that is allowed to be uploaded. Defaults to 10 MB                                            |
| `tags`                | Object           | No        | Any additional data you want to associate with the component's state, such as an app ID.                                |
| `enabledIntegrations` | Array of Strings | No        | Lets you choose which 3rd party integrations to show. Accepted values are `LOCAL_FILES`, `NOTION`.                      |

## Usage

Here's an illustrative example of how to use the `CarbonConnect` component in a Next.js project:

```jsx
import { CarbonConnect } from 'carbon-connect';
import axios from 'axios';

const tokenFetcher = async () => {
  const response = await axios.get('/api/auth/fetchCarbonTokens', {
    params: { customer_id: 'your_customer_id' },
  });
  return response.data;
};

<CarbonConnect
  tokenFetcher={tokenFetcher}
  orgName="Your Organization"
  brandIcon="path/to/your/brand/icon"
  tags={{ appId: 'your_app_id' }}
  maxFileSize={25000000}
>
  <button>Open Dialog</button>
</CarbonConnect>;
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

## Get in Touch

If you have any questions, encounter any issues, please don't hesitate to reach out to us at [team@carbon.ai](mailto:team@carbon.ai). We're always delighted to hear from our users!
