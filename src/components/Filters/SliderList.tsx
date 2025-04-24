import { Accordion, AccordionDetails, AccordionSummary, Box, Slider, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

export const OptionSlider = (props: {option: string, value: number[], onChange: (e: Event, newValue: number[]) => void, min?: number, max?: number}) => {
    const [value, setvalue] = useState<number[]>([0, 100]);
    useEffect(() => {
        setvalue(props.value);
    }, [props]);

    const onChange = (e: Event, newValue: number[]) => {
        setvalue(newValue);
    }

    const onChangeCommitted = (e: Event, newValue: number[]) => {
        onChange(e, newValue);
        props.onChange(e, newValue);
    }

    return(
        <Stack>
            <Typography variant='body2'>{props.option}</Typography>
            <Slider key={props.option} value={value} onChange={(e,v) => onChange(e, v as number[])} onChangeCommitted={(e,v) => onChangeCommitted(e as Event, v as number[])} min={props.min} max={props.max} />  
        </Stack>
    )
}

export const SliderList = (props: {name: string, filters: any, options: string[], applySliderFilter: (option: string, value: number[]) => void, minMaxValues?: any }) => {
    const [values, setvalues] = useState<any>(props.filters);
    useEffect(() => {
        setvalues(props.filters);
    }, [props]);

    const handleChange = (option: string, newValue: number[]) => {
        props.applySliderFilter(option, newValue);
    }

    return(<Accordion>
        <AccordionSummary>
            <Typography>{props.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box>
            {values && props.options.map((option: string) => <OptionSlider option={option} key={option} value={values[option]} onChange={(e: any, newValue: number[]) => handleChange(option, newValue as number[])} min={props.minMaxValues? props.minMaxValues[option][0] : undefined} max={props.minMaxValues? props.minMaxValues[option][1] : 100}/>)}
            </Box>
        </AccordionDetails>
    </Accordion>
        
    )
}