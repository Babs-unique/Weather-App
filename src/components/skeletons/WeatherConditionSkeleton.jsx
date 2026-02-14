import React from 'react'
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
export const WeatherConditionSkeleton = () => {
    return (
        <div className='skeleton-two'>
            <Skeleton
                width={200}
                height={120}
                borderRadius={10}
                baseColor="hsl(243, 23%, 24%)" 
                highlightColor="hsl(243, 23%, 20%)"
            />
            <Skeleton
                width={200}
                height={120}
                borderRadius={10}
                baseColor="hsl(243, 23%, 24%)" 
                highlightColor="hsl(243, 23%, 20%)"
            />
            <Skeleton
                width={200}
                height={120}
                borderRadius={10}
                baseColor="hsl(243, 23%, 24%)" 
                highlightColor="hsl(243, 23%, 20%)"
            />
            <Skeleton
                width={200}
                height={120}
                borderRadius={10}
                baseColor="hsl(243, 23%, 24%)" 
                highlightColor="hsl(243, 23%, 20%)"
            />
            
        </div>
    )
}
