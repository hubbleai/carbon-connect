# Carbon Connect

Carbon Connect is a robust React component designed for managing integrations with a variety of data sources. Carbon Connect provides an intuitive and flexible interface for your data management needs.

## Installation

To install Carbon Connect, use npm as follows:

```bash
npm install carbon-connect
```

## Component Properties

The `CarbonConnect` component accepts the following properties:

| Property       | Required? | Description                                                                                                            |
| -------------- | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| `tokenFetcher` | Yes       | A function that returns a promise which resolves with the access and refresh tokens.                                   |
| `orgName`      | Yes       | The name of your organization. This is displayed in the initial announcement modal view.                               |
| `brandIcon`    | Yes       | A URL or a local path to your organization's brand icon.                                                               |
| `tags`         | No        | Any additional data you want to associate with the component's state, such as an app ID.                               |
| `entryPoint`   | No        | The initial active step when the component loads. Default entry point is 'LOCAL_FILE'. More integrations are upcoming. |

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
/>;
```

In this example, `tokenFetcher` is a helper function that retrieves the necessary tokens for authentication. This function should be implemented in your client-side code and is designed to hit an API on your backend server. This API, in turn, requests tokens from the Carbon token creation endpoint.

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
