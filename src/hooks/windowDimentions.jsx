import React from 'react'


export const useWindowDimentions = () => {
    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    return {
        windowDimention :  getWindowDimensions()
    }
}