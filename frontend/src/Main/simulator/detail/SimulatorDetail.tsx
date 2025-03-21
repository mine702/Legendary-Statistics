import {useParams} from "react-router-dom";
import style from "./SimulatorDetail.module.scss";
import {useSWRGetProbabilityByTreasureId, useSWRGetTreasureDetail} from "../../../server/server.ts";
import {useEffect} from "react";

export const SimulatorDetail = () => {
  const {id} = useParams();

  const {data: treasureData, isLoading: treasureIsLoading} = useSWRGetTreasureDetail(id);
  const {data: probabilityData, isLoading: probabilityIsLoading} = useSWRGetProbabilityByTreasureId(id);

  useEffect(() => {
    console.log(treasureData)
    console.log(probabilityData)
  }, [treasureData, probabilityData]);

  return (
    <div className={style.root}>
      <h2>전설이 ID: {id}</h2>
    </div>
  );
}
