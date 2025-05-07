# ClipFlowAI Shared Code

This directory contains shared code that is used by both the frontend and backend of the ClipFlowAI application.

## Directory Structure

```
/shared
├── constants/             # Shared constants
│   └── index.js           # Main constants file
├── types/                 # Shared type definitions
│   └── ...
├── utils/                 # Shared utility functions
│   ├── formatters.js      # Formatting utilities
│   ├── validators.js      # Validation utilities
│   └── ...
└── README.md              # This file
```

## Constants

The `constants` directory contains shared constants that are used by both the frontend and backend, such as:

- API endpoints
- Video platforms
- Video statuses
- Languages
- Voice profiles
- Analytics periods
- Error messages
- Success messages

## Types

The `types` directory contains shared type definitions that are used by both the frontend and backend.

## Utils

The `utils` directory contains shared utility functions that are used by both the frontend and backend, such as:

### Formatters

- `formatDate`: Format date to a readable string
- `formatNumber`: Format number with commas
- `formatFileSize`: Format file size to human-readable format
- `formatDuration`: Format duration in seconds to MM:SS
- `formatDurationLong`: Format duration in seconds to HH:MM:SS

### Validators

- `isValidEmail`: Validate email format
- `validatePassword`: Validate password strength
- `isValidUrl`: Validate URL format
- `isEmpty`: Check if a value is empty
- `validateVideoFile`: Validate video file

## Usage

### In Frontend

```javascript
import { PLATFORMS, VIDEO_STATUS } from '../../shared/constants';
import { formatDate, formatNumber } from '../../shared/utils/formatters';
import { isValidEmail, validatePassword } from '../../shared/utils/validators';
```

### In Backend

```javascript
const { PLATFORMS, VIDEO_STATUS } = require('../../shared/constants');
const { formatDate, formatNumber } = require('../../shared/utils/formatters');
const { isValidEmail, validatePassword } = require('../../shared/utils/validators');
```
