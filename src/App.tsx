import { useEffect, useState } from 'react';
import csvToJson from 'csvtojson';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);


interface DataProps {
  id: number;
  year: number;
  day: number;
  min: number;
  glo_avg: number; // global horizontal
  dir_avg: number; // direta normal
  diff_avg: number; // onda curta difusa
  lw_avg: number; // onda longa descendente
  par_avg: number; // par
  lux_avg: number; // iluminância
  tp_sfc: number; // temperatura do ar
  humid: number; // umidade relativa
  press: number; // pressão atmoférica
  rain: number; // precipitação acumulada
  ws_10m: number; // velocidade do vento
  wd_10m: number; // direção do vento
}

function App() {
  const [csvFile, setCsvFile] = useState<File>();
  const [data, setData] = useState<DataProps[]>();

  useEffect(() => {
    if (csvFile) {
      const reader = new FileReader();
      reader.readAsText(csvFile);
      reader.onload = (event) => {
        csvToJson({
          delimiter: ';',
        })
          .fromString(event.target?.result as string)
          .then((jsonObject) => {
            console.log(jsonObject);
            setData(jsonObject as unknown as DataProps[]);
          });

      };
    }
  }, [csvFile]);

  return (
    <>
      <input
        type="file"
        name="csvfile"
        id="csvfile"
        accept='.csv'
        onChange={(event) => {
          setCsvFile(event.target.files?.[0]);
        }}
      />
      {data && (
        <Line
          width={1000}
          height={500}
          options={{
            maintainAspectRatio: true,
            plugins: {
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true,
                  },
                  drag: {
                    enabled: true
                  },
                  mode: 'x',
                }
              },
            }
          }}
          data={{
            labels: data.map(item => item.year),
            datasets: [{
              label: 'Dataset 1',
              data: data.map((item) => item.glo_avg),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              tension: 0.3
            }]
          }}
        />
      )}
    </>
  );
}

export default App;
