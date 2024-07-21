import Image from "next/image";
import PieChart from '../app/components/PieChart';
import ModelViewer from '../app/components/ModelViewer';


export default function Home() {
  return (
    
    <main>
       
        <h1>3D Model Viewer</h1>
        <ModelViewer />
    </main>
  );
}
