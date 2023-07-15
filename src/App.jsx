import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
    Suspense,
    createContext,
    lazy,
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";

import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import ProtectedRoute from "./pages/ProtectedRoute";
import SpinnerFullPage from "./components/SpinnerFullPage";

// const HomePage = lazy(() => import("./pages/Homepage"));
// const Pricing = lazy(() => import("./pages/Pricing"));
// const Product = lazy(() => import("./pages/Product"));
// const PageNotFound = lazy(() => import("./pages/PageNotFound"));
// const Login = lazy(() => import("./pages/Login"));
// const AppLayout = lazy(() => import("./pages/Homepage"));

import HomePage from "./pages/HomePage";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";

const BASE_URL = "http://localhost:8000";

export const CitiesContext = createContext();
export const AuthContext = createContext();

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

const initialState = {
    user: null,
    isAuthenticated: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "login":
            return { ...state, user: action.payload, isAuthenticated: true };
        case "logout":
            return { ...state, user: null, isAuthenticated: false };
        default:
            throw new Error("Unknow action");
    }
}

function App() {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});

    const [{ user, isAuthenticated }, dispatch] = useReducer(
        reducer,
        initialState
    );

    useEffect(function () {
        async function fetchCities() {
            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                setCities(data);
            } catch {
                alert("There was an error loading data...");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCities();
    }, []);

    const getCity = useCallback(
        async function getCity(id) {
            if (Number(id) === currentCity.id) return;

            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                setCurrentCity(data);
            } catch {
                alert("There was an error loading data...");
            } finally {
                setIsLoading(false);
            }
        },
        [currentCity.id]
    );

    async function createCity(newCity) {
        try {
            setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities/`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            setCities((cities) => [...cities, data]);
        } catch {
            alert("There was an error adding data...");
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteCity(id) {
        try {
            setIsLoading(true);
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });

            setCities((cities) => cities.filter((city) => city.id !== id));
        } catch {
            alert("There was an error deleteing data...");
        } finally {
            setIsLoading(false);
        }
    }

    //====================Fake Authentication
    function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
            dispatch({ type: "login", payload: FAKE_USER });
        }
    }

    function logout() {
        dispatch({ type: "logout" });
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            <CitiesContext.Provider
                value={{
                    cities,
                    isLoading,
                    currentCity,
                    getCity,
                    createCity,
                    deleteCity,
                }}
            >
                <BrowserRouter>
                    {/* <Suspense fallback={<SpinnerFullPage />}> */}
                    <Routes>
                        <Route index element={<HomePage />} />
                        {/* <Route path="/" element={<HomePage />} /> */}
                        <Route path="product" element={<Product />} />
                        <Route path="pricing" element={<Pricing />} />
                        <Route path="login" element={<Login />} />
                        <Route
                            path="app"
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                index
                                element={<Navigate replace to="cities" />}
                            />
                            <Route path="cities" element={<CityList />} />
                            <Route path="cities/:id" element={<City />} />
                            <Route path="countries" element={<CountryList />} />
                            <Route path="form" element={<Form />} />
                        </Route>

                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                    {/* </Suspense> */}
                </BrowserRouter>
            </CitiesContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;
