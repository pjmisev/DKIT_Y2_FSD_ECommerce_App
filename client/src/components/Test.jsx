import axios from 'axios';
import {useState} from "react";
import {SERVER_HOST} from "../config/global_constants.js";

export default function Test() {
    const [cars, setCars] = useState([]);

    function getCars() {
        axios.get(`${SERVER_HOST}/api/test`)
            .then(res =>
            {
                console.log(res.data);
                setCars(res.data);
            })
    }

    return (
        <div>
            <h1>Test Page</h1>
            <button onClick={getCars}>press me twin</button>
            {cars && (
                <ul>
                    {cars.map((car, key) => <li key={key}>{car.model}</li>)}
                </ul>
            )}
        </div>
    );
}