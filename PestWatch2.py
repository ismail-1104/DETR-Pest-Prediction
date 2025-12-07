from ultralytics import YOLO
import os
import glob

def predict_and_return_output_path(image_path):
    # Initialize YOLO model
    model = YOLO("best.pt")

    # Predict using the model
    output = model.predict(image_path, save=True, save_txt=True)

    output_directory = "../runs/detect/predict/"
    
    # Get the filename from the image path
    image_name = os.path.basename(image_path)

    # Get the path of the saved image
    saved_image_path = os.path.join(output_directory, image_name)
    print(saved_image_path)

    return saved_image_path

def pestwatch_yolo(image_path):
    """
    YOLO-based pest detection that returns results similar to original pestwatch()
    Returns: (pest_class_message, suggestion_message, path_to_annotated_image)
    """
    # Pest classes matching the original PestWatch
    pest_class = ['aphids', 'armyworm', 'beetle', 'bollworm', 'grasshopper', 
                  'mites', 'mosquito', 'sawfly', 'stem_borer']
    
    # Pesticide suggestions matching original
    suggest = [
        'Imidacloprid, Acetamiprid, Thiamethoxam',
        'Chlorpyrifos, Lambda-cyhalothrin, Bifenthrin',
        'Imidacloprid, Carbaryl, Malathion, Cypermethrin',
        'Chlorantraniliprole, Emamectin benzoate, Spinosad, Indoxacarb',
        'Carbaryl, Malathion, Pyrethroids',
        'Abamectin, Bifenazate, Chlorfenapyr',
        'Adulticides, Larvicides',
        'Malathion, Carbaryl, Cypermethrin',
        'Neonicotinoids, Pyrethroids, Chlorantraniliprole'
    ]
    
    try:
        # Initialize YOLO model
        model = YOLO("best.pt")
        
        # Predict using the model and save annotated image
        results = model.predict(image_path, save=True, save_txt=True, conf=0.25)
        
        # Get the path to the saved annotated image
        # YOLO saves images in runs/detect/predict/ or runs/detect/predict2/ etc
        runs_dir = "runs/detect"
        predict_dirs = glob.glob(os.path.join(runs_dir, "predict*"))
        if predict_dirs:
            # Get the most recent predict directory
            latest_dir = max(predict_dirs, key=os.path.getmtime)
            image_name = os.path.basename(image_path)
            annotated_image_path = os.path.join(latest_dir, image_name)
        else:
            annotated_image_path = None
        
        # Extract detected classes
        detected_pests = []
        if len(results) > 0 and results[0].boxes is not None:
            boxes = results[0].boxes
            for box in boxes:
                class_id = int(box.cls[0])
                if 0 <= class_id < len(pest_class):
                    detected_pests.append((class_id, pest_class[class_id]))
        
        # Format results
        if detected_pests:
            # Use the first detected pest
            pest_id, pest_name = detected_pests[0]
            result = f"Given Image has been affected by {pest_name}."
            suggestion = f"Please use the below pesticide: {suggest[pest_id]}"
            
            # If multiple pests detected, mention them
            if len(detected_pests) > 1:
                other_pests = ', '.join([p[1] for p in detected_pests[1:]])
                result += f" Also detected: {other_pests}"
        else:
            result = "No pests detected in the image."
            suggestion = "Your crops appear healthy! Continue monitoring regularly."
        
        print(f"Detection: {result}")
        print(f"Suggestion: {suggestion}")
        print(f"Annotated image: {annotated_image_path}")
        
        return result, suggestion, annotated_image_path
        
    except Exception as e:
        error_msg = f"Error during detection: {str(e)}"
        print(error_msg)
        return error_msg, "Please try uploading a different image.", None
