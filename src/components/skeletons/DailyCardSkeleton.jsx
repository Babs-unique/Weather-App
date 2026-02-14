import React from 'react'
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
export const DailyCardSkeleton = () => {

    return (
        <div className='skeleton-four'>
            <div>
                Daily Forecast
            </div>
            <div className='skeleton-four-inner'>
        <Skeleton 
        borderRadius={10}
            width={113}
            height={120}
                baseColor="hsl(243, 23%, 24%)" 
            highlightColor="hsl(243, 23%, 20%)"
            />
            <Skeleton 
            borderRadius={10}
            width={113}
            height={120}
                baseColor="hsl(243, 23%, 24%)" 
            highlightColor="hsl(243, 23%, 20%)"
            />
            <Skeleton 
            borderRadius={10}
            width={113}
            height={120}
                baseColor="hsl(243, 23%, 24%)" 
            highlightColor="hsl(243, 23%, 20%)"
            />
            <Skeleton 
            borderRadius={10}
            width={113}
            height={120}
                baseColor="hsl(243, 23%, 24%)" 
            highlightColor="hsl(243, 23%, 20%)"
            />
                <Skeleton 
                borderRadius={10}
            width={113}
            height={120}
                baseColor="hsl(243, 23%, 24%)" 
            highlightColor="hsl(243, 23%, 20%)"
            />
                <Skeleton 
                borderRadius={10}
            width={113}
            height={120}
                baseColor="hsl(243, 23%, 24%)" 
            highlightColor="hsl(243, 23%, 20%)"
            />
                <Skeleton 
                borderRadius={10}
            width={113}
            height={120}
                baseColor="hsl(243, 23%, 24%)" 
            highlightColor="hsl(243, 23%, 20%)"
            /> 
            </div>
        </div>
    )
}
