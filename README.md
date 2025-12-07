# DETR - Pest Detection & Prediction System

A modern full-stack web application for agricultural pest detection and prediction using AI/ML models. Built with Next.js frontend and Flask backend.

## 🌟 Features

- **Pest Watch**: Real-time AI-powered pest detection using YOLO model with image upload and annotated results
- **Pest Prediction**: Predict pest outbreaks based on environmental factors (temperature, humidity, geography)
- **Weekly Prediction**: Get pest forecasts for any week of the year

## 🛠️ Tech Stack

### Frontend
- **Next.js 14.2.5** - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Modern icon library

### Backend
- **Flask 3.1.2** - Python web framework
- **Python 3.14** - Latest Python version
- **YOLO (Ultralytics 8.3.235)** - State-of-the-art object detection
- **scikit-learn 1.7.2** - Machine learning library
- **OpenCV** - Image processing

## 📋 Prerequisites

- Python 3.14+
- Node.js 18+
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DETR_17_BIT-N-BUILD-main
```

### 2. Backend Setup

Install Python dependencies:
```bash
py -m pip install -r requirements.txt
```

Run Flask backend:
```bash
py app.py
```
The backend will start at `http://127.0.0.1:5000`

### 3. Frontend Setup

Navigate to frontend directory:
```bash
cd frontend
```

Install Node.js dependencies:
```bash
npm install
```

Run Next.js development server:
```bash
npm run dev
```
The frontend will start at `http://localhost:3000`

## 📱 Usage

1. **Start Backend**: Run `py app.py` in the root directory
2. **Start Frontend**: Run `npm run dev` in the frontend directory
3. **Access Application**: Open http://localhost:3000

### Features Guide

#### 🐛 Pest Watch
1. Navigate to "Pest Watch" page
2. Upload an image of your crop/plant (JPG, PNG, GIF)
3. Click "Detect Pests"
4. View AI-generated results with bounding boxes
5. Download annotated image

#### 📊 Pest Prediction
1. Navigate to "Pest Prediction" page
2. Enter environmental data:
   - Collection Type
   - Max Temperature
   - Min Temperature
   - RH1 (Relative Humidity)
   - Geography (Area/Location)
3. Click "Predict Pest Outbreak"
4. View prediction results

#### 📅 Weekly Prediction
1. Navigate to "Weekly Prediction" page
2. Enter a week number (1-52)
3. Click "Get Weekly Prediction"
4. View pest forecasts for that week

## 📁 Project Structure

```
DETR_17_BIT-N-BUILD-main/
├── frontend/                  # Next.js frontend
│   ├── app/                  # Next.js app directory (pages)
│   │   ├── page.tsx          # Home page
│   │   ├── pestwatch/        # Pest detection page
│   │   ├── pest-prediction/  # Pest prediction page
│   │   ├── weekly-prediction/# Weekly forecast page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable components
│   │   ├── Navbar.tsx        # Navigation bar
│   │   └── Footer.tsx        # Footer
│   ├── package.json          # Frontend dependencies
│   ├── tsconfig.json         # TypeScript config
│   ├── tailwind.config.js    # Tailwind CSS config
│   └── next.config.mjs       # Next.js config
├── app.py                    # Flask backend API
├── PestWatch2.py             # YOLO pest detection logic
├── pestpred.py               # Pest prediction logic
├── week.py                   # Weekly prediction logic
├── best.pt                   # YOLO model weights
├── decision_tree_model2.joblib # ML model
├── random_forest_model.pkl   # ML model
├── static/uploads/           # Uploaded images
├── runs/                     # YOLO detection results
├── requirements.txt          # Python dependencies
└── README.md                 # Documentation
```

## 🔌 API Endpoints

### Flask Backend (Port 5000)

- **POST** `/api/pestwatch_yolo`
  - Upload image for pest detection
  - Body: `FormData` with `image` file
  - Returns: `{ pest_class, suggestion, annotated_image }`

- **POST** `/api/pestpred`
  - Predict pest based on environmental data
  - Body: `JSON` with feature1-feature5
  - Returns: `{ prediction }`

- **POST** `/api/predict_week`
  - Get weekly pest forecast
  - Body: `JSON` with `week` number
  - Returns: `{ prediction }`

- **GET** `/runs/<path>`
  - Serve annotated images

## 🐳 Deployment

### Backend Deployment (Flask)

For production, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Or use Waitress for Windows:

```bash
pip install waitress
waitress-serve --port=5000 app:app
```

### Frontend Deployment (Next.js)

Build for production:

```bash
cd frontend
npm run build
npm start
```

Or deploy to Vercel (recommended):

```bash
npm install -g vercel
vercel
```

### Environment Variables

Create `.env.local` in frontend directory:

```env
NEXT_PUBLIC_API_URL=http://your-backend-url:5000
```

Update CORS in `app.py`:

```python
CORS(app, origins=["https://your-frontend-url.com"])
```

## ⚠️ Known Issues

- Pest Prediction and Weekly Prediction models were trained with scikit-learn 1.2.2, may show compatibility warnings with version 1.7.2
- For best results, retrain models with current scikit-learn version

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Historical data visualization with charts
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Integration with weather APIs
- [ ] Pest database with detailed information

## 📄 License

This project is part of BIT-N-BUILD hackathon.

## 👥 Contributors

**Team DETR**
