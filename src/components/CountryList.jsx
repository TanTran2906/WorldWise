import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CoutryItem from "./CountryItem";
import { useContext } from "react";
import { CitiesContext } from "../App";

function CountryList() {
    const { cities, isLoading } = useContext(CitiesContext);
    if (isLoading) return <Spinner />;

    if (!cities.length)
        return (
            <Message message="Add your first city by clicking on a city on a map" />
        );
    //Trả về những thành phố không bị trùng
    const countries = cities.reduce((arr, city) => {
        if (!arr.map((el) => el.country).includes(city.country))
            return [...arr, { country: city.country, emoji: city.emoji }];
        else return arr;
    }, []);
    console.log(countries);

    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                <CoutryItem country={country} key={country.country} />
            ))}
        </ul>
    );
}

export default CountryList;
