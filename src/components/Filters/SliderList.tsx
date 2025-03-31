import { Accordion, AccordionDetails, AccordionSummary, Box, Slider, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

const OptionSlider = (props: {option: string, value: number[], onChange: (e: Event, newValue: number[]) => void}) => {
    const [value, setvalue] = useState<number[]>(props.value);
    useEffect(() => {
        setvalue(props.value);
    }, [props]);
    return(
        <Stack>
            <Typography variant='body2'>{props.option}</Typography>
            <Slider key={props.option} value={value} onChange={(e, val) => props.onChange(e, val as number[])} />  
        </Stack>
    )
}

export const SliderList = (props: {name: string, options: string[], applySliderFilter: (option: string, value: number[]) => void}) => {
    const [values, setvalues] = useState<any>();
    useEffect(() => {
        let vals: any = {};
        props.options.forEach((option) => {
            vals[option] = [0, 100];
        })
        setvalues(vals);
    }, [props]);

    const handleChange = (option: string, newValue: number[]) => {
        props.applySliderFilter(option, newValue);
        let newValues = {...values, [option]: newValue};
        setvalues(newValues);
        console.log(values[option]);
    }

    return(<Accordion>
        <AccordionSummary>
            <Typography>{props.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box>
            {values && props.options.map((option: string) => <OptionSlider option={option} key={option} value={values[option]} onChange={(e: any, newValue: number[]) => handleChange(option, newValue as number[])}/>)}
            </Box>
        </AccordionDetails>
    </Accordion>
        
    )
}