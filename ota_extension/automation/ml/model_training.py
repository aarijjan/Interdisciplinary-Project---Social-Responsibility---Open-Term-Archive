import os
import sys
import pickle
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# --- Config ---
data_file = "training_data.csv"
model_file = "./model_file/model.pkl"

def train_model():
    print("--- Trainiere RandomForest Classifier ---")

    # Load the Training Data
    if not os.path.exists(data_file):
        print(f"Fehler: Datei {data_file} konnte nicht gefunden werden.")
        print("Zuerst mit 'declaration_import.py' trainingsdaten erstellen.")
        sys.exit(1)

    try:
        df = pd.read_csv(data_file)
        print(f"{len(df)} Datenpunkte aus {data_file} geladen.")
    except Exception as e:
        print(f"Fehler beim lesen der csv: {e}")
        sys.exit(1)

    # Separate Features from Labels

    # y = The target we want to predict
    y = df['is_content']
    
    # x = The features we use to make the prediction
    x = df.drop(columns=['is_content'])

    # Split Data into training and testing sets, 20% is set aside for evaluating the model after training
    # We set random_state to a fixed number to ensure reproducability
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

    print(f"Training wird durchgeführt mit {len(x_train)} Datenpunkten. Evaluiert wird mit {len(x_test)}.")

    # Initialize the RandomForest
    # n_estimators=100: creates 100 different "decision trees" to average their votes.
    # class_weight='balanced': we have an overwhelming majority of negative samples, this tells the model to weigh them equally and value rare positives highly
    classifier = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)

    # Actually fit the model to the data
    classifier.fit(x_train, y_train)

    # Evaluate the model 
    print("\n--- Model Evaluation ---")
    accuracy = classifier.score(x_test, y_test)
    print(f"Genauigkeit: {accuracy:.2%}")

    # Detailed report: precision (did the model pick only the right selectors) vs recall (did the model find all the right selectors)
    y_pred = classifier.predict(x_test)
    print("\nDetaillierter Bericht:")
    print(classification_report(y_test, y_pred, target_names=['Junk (0)', 'Content (1)']))

    # Saving the model
    # We pickle (serialize) the trained model to a file so we can potentially reuse it
    os.makedirs(os.path.dirname(model_file), exist_ok=True)
    with open(model_file, "wb") as f:
        pickle.dump(classifier, f)
    
    print(f"\nModel gespeichert in: {model_file}")

if __name__ == "__main__":
    train_model()