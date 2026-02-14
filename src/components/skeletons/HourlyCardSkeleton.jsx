import React from 'react'
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
export const HourlyCardSkeleton = () => {
    return (
        <div className='skeleton-three'>
            <Skeleton
                height={610}
                baseColor="hsl(243, 23%, 24%)" 
                highlightColor="hsl(243, 23%, 20%)"
                borderRadius={10}
            />
            <div className='inner-button'>
                <p>Hourly Forecast</p>
                <button>
                </button>
            </div>
            <div className='inner-skeleton'>
            <Skeleton width={260} height={50}  baseColor="hsl(243, 23%, 34%)" 
            highlightColor="hsl(243, 23%, 20%) " borderRadius={10}/>
            <Skeleton width={260} height={50}  baseColor="hsl(243, 23%, 34%)" 
            highlightColor="hsl(243, 23%, 20%) " borderRadius={10}/>
            <Skeleton width={260} height={50}  baseColor="hsl(243, 23%, 34%)" 
            highlightColor="hsl(243, 23%, 20%) " borderRadius={10}/>
            <Skeleton width={260} height={50}  baseColor="hsl(243, 23%, 34%)" 
            highlightColor="hsl(243, 23%, 20%) " borderRadius={10}/>
            <Skeleton width={260} height={50}  baseColor="hsl(243, 23%, 34%)" 
            highlightColor="hsl(243, 23%, 20%) " borderRadius={10}/>
            <Skeleton width={260} height={50}  baseColor="hsl(243, 23%, 34%)" 
            highlightColor="hsl(243, 23%, 20%) " borderRadius={10}/>
            <Skeleton width={260} height={50}  baseColor="hsl(243, 23%, 34%)" 
            highlightColor="hsl(243, 23%, 20%) " borderRadius={10}/>
            <Skeleton width={260} height={50}  baseColor="hsl(243, 23%, 34%)" 
            highlightColor="hsl(243, 23%, 20%) " borderRadius={10}/>

            </div>
        </div>
    )
}
