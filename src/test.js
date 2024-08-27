import db from "./firebase";
import { ref, getDocs, collection} from "firebase/firestore";

// Function to fetch data from Firebase
async function FirebaseDataComponent() {
  try {
    // Specify the path to your data
    const snapshot = await getDocs(collection(db, 'admin'));
    const adminList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (snapshot.exists()) {
      console.log(adminList);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return <></>
}

const App2 = () => {
    return (
      <div>
        <h1>Firebase Data Fetch Example</h1>
        <FirebaseDataComponent />
      </div>
    );
  };

// Call the function
export default App2
