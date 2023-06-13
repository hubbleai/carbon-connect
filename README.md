# Carbon Connect

Carbon Connect is a React component that provides an interface for managing integrations with various data sources. It includes UI for viewing announcements, managing third-party connections, selecting Google Docs files, and uploading local files.

## Installation

Use npm to install Carbon Connect:

```
npm install carbon-connect

```

## Usage

```jsx
import CarbonConnect from 'carbon-connect';

<CarbonConnect
  apikey={your_api_key}
  userid={your_user_id}
  orgName={your_organization_name}
  brandIcon={your_brand_icon}
  environment="PRODUCTION"
  entryPoint={entry_point}
/>;
```

## Props

| Prop         | Required? | Description                                                                                                     |
| ------------ | --------- | --------------------------------------------------------------------------------------------------------------- |
| `apikey`     | Yes       | Your API key.                                                                                                   |
| `userid`     | Yes       | The ID of the user.                                                                                             |
| `orgName`    | Yes       | The name of your organization.                                                                                  |
| `brandIcon`  | Yes       | The icon for your brand.                                                                                        |
| `entryPoint` | No        | The initial active step when the component loads. It can be 0, 1, 'GOOGLE_DOCS', or 'LOCAL_FILE'. Default is 0. |
