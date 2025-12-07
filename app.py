from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from PestWatch2 import pestwatch_yolo
from pestpred import pestpred
from week import predict_week

app = Flask(__name__)

# Configure CORS - Update with your frontend URL after deployment
allowed_origins = [
    "http://localhost:3000",
    "https://*.vercel.app",  # Vercel deployment
    os.environ.get("FRONTEND_URL", "")  # Production frontend URL
]
CORS(app, origins=allowed_origins, supports_credentials=True)

# Configuration for file uploads
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# API endpoints for Next.js frontend
@app.route('/api/pestwatch_yolo', methods=['POST'])
def api_pestwatch_yolo():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
        
        photo = request.files['image']
        if photo.filename == '' or not allowed_file(photo.filename):
            return jsonify({"error": "Invalid file"}), 400
        
        filename = secure_filename(photo.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        photo.save(filepath)
        
        # Use YOLO-based pest detection
        pest_class, suggestion, annotated_image = pestwatch_yolo(filepath)
        
        # Convert path to proper format for web access
        if annotated_image:
            # If it's already a relative path, just convert backslashes to forward slashes
            relative_path = annotated_image.replace('\\', '/')
            # Ensure it starts with a forward slash
            if not relative_path.startswith('/'):
                relative_path = '/' + relative_path
        else:
            relative_path = None
        
        return jsonify({
            "pest_class": pest_class,
            "suggestion": suggestion,
            "annotated_image": relative_path
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/pestpred', methods=['POST'])
def api_pestpred():
    try:
        data = request.get_json()
        
        # Convert form data to list format expected by pestpred (5 features)
        input_data = [
            data.get('feature1', ''),  # Collection Type
            data.get('feature2', ''),  # Max Temperature
            data.get('feature3', ''),  # Min Temperature
            data.get('feature4', ''),  # RH1
            data.get('feature5', ''),  # Geography
        ]
        
        result = pestpred(input_data)
        return jsonify({"prediction": str(result)})
    except Exception as e:
        error_msg = "Model compatibility issue. Please retrain the model with current scikit-learn version."
        return jsonify({"error": error_msg, "details": str(e)}), 500

@app.route('/api/predict_week', methods=['POST'])
def api_predict_week():
    try:
        data = request.get_json()
        week_number = int(data.get('week', 0))
        
        if week_number < 1 or week_number > 52:
            return jsonify({"error": "Week number must be between 1 and 52"}), 400
        
        result = predict_week(week_number)
        return jsonify({"prediction": str(result)})
    except Exception as e:
        error_msg = "Model compatibility issue. Please retrain the model with current scikit-learn version."
        return jsonify({"error": error_msg, "details": str(e)}), 500

# Serve static files (runs folder)
@app.route('/runs/<path:filename>')
def serve_runs(filename):
    runs_dir = os.path.join(os.getcwd(), 'runs')
    return send_file(os.path.join(runs_dir, filename))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

