import axios from 'axios';
import {useState} from "react";

export default function Test() {

    let SERVER_HOST = "http://localhost:4000/api";
    const [cars, setCars] = useState([]);

    function getCars() {
        axios.get(`${SERVER_HOST}/test`)
            .then(res =>
            {
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