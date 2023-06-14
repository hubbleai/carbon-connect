# Carbon Connect

Carbon Connect is a React component that provides an interface for managing integrations with various data sources.

## Installation

Use npm to install Carbon Connect:

```
npm install carbon-connect
```

## Usage

```jsx
import { CarbonConnect } from 'carbon-connect';

<CarbonConnect
  apikey={your_api_key}
  userid={your_user_id}
  orgName={your_organization_name}
  brandIcon={your_brand_icon}
  entryPoint={entry_point}
/>;
```

## Props

| Prop         | Required? | Description                                                                                                                          |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `apikey`     | Yes       | Your API key. The carbon team will share the API key with you.                                                                       |
| `userid`     | Yes       | The ID of the user. This is required to uniquely identify a user on your platform.                                                   |
| `orgName`    | Yes       | The name of your organization. This value is used to show the initial announcement modal view. You can you any value of your choice. |
| `brandIcon`  | Yes       | The icon for your brand. A public URL or path to your icon in your code base                                                         |
| `entryPoint` | No        | The initial active step when the component loads. It can be 'LOCAL_FILE'. More integrations in pipeline                              |

## Contact Information

If you have any questions, issues, or just want to contribute, don't hesitate to send us an email at [team@carbon.ai](mailto:team@carbon.ai). We'd love to hear from you!
