from CustomModels.LandMarkSVM import LandMarkSVM
from CustomModels.CustomSVM import CustomSVM
from CustomModels.LinearRegression import LinearRegression
from CustomModels.MultiLayerPerceptron import MultiLayerPerceptron
from CustomModels.CustomCNN import CustomCNN

import json

model_classes = {
        "LandMarkSVM": LandMarkSVM,
        "CustomSVM": CustomSVM,
        "Linear_Regression": LinearRegression,
        "multiLayerPerceptron":MultiLayerPerceptron,
        "CNN": CustomCNN
        # Add other models here if necessary
    }

def model_instance_from_config(modelConfig):
    try:
        model_name = modelConfig["model_name"]
        config = modelConfig["model_info"]

        model_class = model_classes[model_name]   # Model Class of selected model

        if not model_class:
            raise ValueError(f"Unknown model: {model_name}")

        model_instance = model_class(config) ## removed **config

        return model_instance
    except Exception as e:
        print(f"Error creating model instance: {e}")
        return None

# model_instance = model_instance_from_config(modelConfig)
# print(model_instance)
# methods = [method_name for method_name in dir(model_instance) if callable(getattr(model_instance, method_name)) and not method_name.startswith("__")]

# print(methods)

