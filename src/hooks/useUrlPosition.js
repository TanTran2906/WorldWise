import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
    //Đến từ URL
    const [searchParams] = useSearchParams();
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    return [lat, lng]
}