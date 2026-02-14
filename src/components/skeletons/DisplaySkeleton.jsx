import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import { HourlyCardSkeleton } from "./HourlyCardSkeleton"
import { DailyCardSkeleton } from "./DailyCardSkeleton"
import { WeatherConditionSkeleton } from "./WeatherConditionSkeleton"
export const DisplaySkeleton = () => {
    return (
        <div className="skeleton">
            <Skeleton 
            className="skeleton-one"
            baseColor="hsl(243, 23%, 24%)" 
            highlightColor="hsl(243, 23%, 20%)"
            height={300}
            borderRadius={10}
            />
            <HourlyCardSkeleton/>
            <DailyCardSkeleton/>
            <WeatherConditionSkeleton/>
        </div>
    )
}
