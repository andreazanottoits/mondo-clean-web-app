import "./App.css";

import { useEffect, useState } from "react";

function App() {
  const baseUrl = "https://mondoclean-webapi-zanotto.azurewebsites.net/api/";
  const [plants, setPlants] = useState([]);
  const [plantId, setPlantId] = useState(null);
  const [conveyorBeltsByPlantId, setconveyorBeltsByPlantId] = useState([]);
  const [conveyorBeltData, setconveyorBeltData] = useState([]);

  const [allData, setAllData] = useState([]);

  const makeAPICall = async () => {
    try {
      const response = await fetch(baseUrl + "PlantSection/GetData", {
        mode: "cors",
      });
      const data = await response.json();
      setPlants(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getAllData = async () => {
    try {
      const response = await fetch(baseUrl + "ConveyorBeltData/GetData", {
        mode: "cors",
      });
      const data = await response.json();
      setAllData(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    makeAPICall();
  }, []);

  useEffect(() => {
    getAllData();
    let result = conveyorBeltsByPlantId.map((a) => a.id);

    setconveyorBeltData(allData.filter((x) => result.includes(x.id)));
    console.log(conveyorBeltData);
  }, [conveyorBeltsByPlantId]);

  const GetConveyorBeltByPlantSectionId = async (id) => {
    try {
      setPlantId(id);
      const response = await fetch(
        baseUrl + "ConveyorBelt/GetConveyorBeltByPlantId/" + id,
        { mode: "cors" }
      );
      const data = await response.json();
      setconveyorBeltsByPlantId(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <h1>Impianti</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          margin: "50px",
        }}
      >
        {plants &&
          plants.map((value, index) => {
            return (
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  background: "lightcoral",
                  margin: "10px",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  key={index}
                  style={{
                    alignSelf: "center",
                    height: "20px",
                  }}
                  onClick={() => GetConveyorBeltByPlantSectionId(value.id)}
                >
                  {value.name}
                </button>
              </div>
            );
          })}
      </div>

      {plantId && (
        <div>
          <h2>Dati Sezione Impianto Numero {plantId}</h2>
          {conveyorBeltsByPlantId &&
            conveyorBeltsByPlantId.map((value, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <strong>Nastro ID {value.id}</strong>
                  <table
                    style={{
                      margin: "30px",
                    }}
                  >
                    <thead>
                      <th>Data</th>
                      <th>Velocità</th>
                      <th>Consumo</th>
                    </thead>
                    <tbody>
                      {conveyorBeltData &&
                        conveyorBeltData.map((x) => {
                          if (x.conveyorBeltId === value.id) {
                            return (
                              <tr>
                                <td>{x.dateTime}</td>
                                <td>{x.speed}</td>
                                <td>{x.energyConsumption}</td>
                              </tr>
                            );
                          } else {
                            return (
                              <tr>
                                <td>No Data</td>
                                <td>No Data</td>
                                <td>No Data</td>
                              </tr>
                            );
                          }
                        })}
                    </tbody>
                  </table>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default App;
