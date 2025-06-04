# Digit Draw & Verify – Supabase Powered

This project is a **React + Vite + Supabase** based web application where users can draw digits, get predictions from a digit classifier, and provide feedback to improve model accuracy.

## Live Demo
[Click here to try it out](https://digit-mind.vercel.app/)

## Features

- 🎨 **Interactive Drawing Canvas** – Users can draw digits (0–9) using mouse/touch.
- 🤖 **Digit Recognition** – Predicts digit using a trained ML model.
- 📊 **Accuracy Display** – Shows model prediction confidence.
- ❓ **User Quiz Popup** – Asks users whether the prediction was correct or not.
- 💾 **Session History** – Logs each session (drawing, prediction, feedback).
- 🌐 **Supabase Backend** – Stores user feedback and drawing metadata securely.

## Project Structure

```

anubothu-aravind-digit-draw-verify-supabase/
├── public/                      # Static files
├── src/
│   ├── components/              # Reusable UI components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Supabase client and utilities
│   ├── pages/                   # Application routes/pages
│   ├── utils/                   # Utility functions
│   └── App.tsx                  # Main app entry
├── index.html
├── package.json
├── tailwind.config.ts
└── README.md

````

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/Anubothu-Aravind/digit-draw-verify-supabase.git
cd anubothu-aravind-digit-draw-verify-supabase
````

### 2. Install Dependencies

```bash
npm i
```

### 3. Configure Supabase

#### Step 1: Add Supabase credentials

Update the `src/lib/supabase.ts` file with your Supabase project URL and anon API key:

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nzvehfhhgoymyebernzn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....'
);

export default supabase;
```

#### Step 2: Create Supabase table

Go to the [Supabase SQL Editor](https://nzvehfhhgoymyebernzn.supabase.co/project/nzvehfhhgoymyebernzn/editor/sql) and run the following SQL to create a new table for session history:

```sql
CREATE TABLE digit_prediction_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  drawing_base64 TEXT NOT NULL,
  prediction INTEGER NOT NULL,
  confidence FLOAT NOT NULL,
  user_feedback BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

This will store:

* The canvas drawing (`drawing_base64`)
* Predicted digit and model confidence
* User feedback (from the quiz)
* Timestamp of the session


### 4. Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## Supabase Tables

Create these tables manually from Supabase UI or using SQL editor:

### `digit_sessions`

| Column        | Type      | Description                       |
| ------------- | --------- | --------------------------------- |
| `id`          | UUID      | Primary Key                       |
| `drawing_url` | TEXT      | Base64 or cloud link of canvas    |
| `predicted`   | INT       | Digit predicted                   |
| `actual`      | INT       | User-confirmed digit              |
| `accuracy`    | FLOAT     | Prediction probability/confidence |
| `created_at`  | TIMESTAMP | Timestamp of session              |


## Key Components

* `DrawingCanvas.tsx` – Canvas to draw digits.
* `PredictionResult.tsx` – Shows prediction & confidence.
* `FeedbackModal.tsx` – Pop-up asking for feedback.
* `SessionHistory.tsx` – Displays previous session logs.
* `supabase.ts` – Connects to Supabase client.

## 📦 Tech Stack

* 🖼️ React + TypeScript
* ⚡ Vite
* 🎨 Tailwind CSS
* 🌩️ Supabase (DB + Auth)
* 🤖 TensorFlow\.js / ONNX / model in `utils/modelUtils.ts` (customizable)

## Deployment

This app can be deployed easily on [Vercel](https://vercel.com/):


## License

[MIT](LICENSE) © 2025 [Anubothu Aravind](https://github.com/Anubothu-Aravind)

## 📞 Contact

For queries or collaboration:
📧 [aanubothu@gmail.com](mailto:aanubothu@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/anubothu-aravind)
