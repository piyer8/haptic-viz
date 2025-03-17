import { Box, Chip, Stack, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import emotionCategories from '../../signals/signal-data/signal-tags/emotional/tagged-signals.json';
import associativeCategories from '../../signals/signal-data/signal-tags/associative/tagged-signals.json';

interface Category{
    name: string;
    percentage: number;
    keywords: string[];
}

export const SignalTags = (props: {signalIndex: string}) => {
    const [emotionalTags, setemotionalTags] = useState<Category[]>([]);
    const [associativeTags, setassociativeTags] = useState<Category[]>([]);
    const [emotionKeywords, setemotionKeywords] = useState<string[]>([]);
    const [assocKeywords, setassocKeywords] = useState<string[]>([]);
    const [selectedEmotion, setselectedEmotion] = useState<string>('');
    const [selectedAssoc, setselectedAssoc] = useState<string>('');
    useEffect(() => {
        let signalData = emotionCategories.find((signal: any) => signal.signal_index === props.signalIndex);
        if(signalData){
            let tags = signalData.categories.filter((cat) => cat.isMatch)
            setemotionalTags(tags.map((cat) => {
                return ({
                    name: cat.category,
                    percentage: cat.percentageMatch,
                    keywords: cat.keywords
                })
            }))
        }
        let assocData = associativeCategories.find((signal: any) => signal.signal_index === props.signalIndex);
        if(assocData){
            let tags = assocData.categories.filter((cat) => cat.isMatch)
            setassociativeTags(tags.map((cat) => {
                return ({
                    name: cat.category,
                    percentage: cat.percentageMatch,
                    keywords: cat.keywords
                })
            }))
        }
    }, [props]);

    const chipOnClickEmotional = (category: Category) => {
        setemotionKeywords(category.keywords)
        setselectedEmotion(category.name)
    } 

    const chipOnClickAssociative = (category: Category) => {
        setassocKeywords(category.keywords)
        setselectedAssoc(category.name)
    }

    return (
        <Box display = "flex" flexDirection = "row" width = "100%" gap={2}>
            <Box display="flex" flexDirection={"row"} flexWrap="wrap" gap={1} width="100%" justifyContent={"space-between"}>
                <TagChips tags={emotionalTags} onCLick={chipOnClickEmotional}/>
                <TagChips tags={associativeTags} onCLick={chipOnClickAssociative}/>
            </Box>
            <Box display = "flex" flexDirection = "column" width = "100%">
                {emotionKeywords.length > 0 && <Typography variant='body1'><b>{selectedEmotion}</b>: {emotionKeywords.join(', ')}</Typography>}
                {assocKeywords.length > 0 && <Typography variant='body1'><b>{selectedAssoc}</b>: {assocKeywords.join(', ')}</Typography>}
            </Box>
        </Box>  
    )
}

const TagChips = (props: {tags: Category[], onCLick: (tag: Category) => void}) => {
    return (<Stack>
        {props.tags.map((tag: Category) => {
            return (
                <Box key={tag.name} display="flex" flexDirection="row" justifyContent={"space-between"}>
                    <Chip label={tag.name} variant="outlined" onClick={() => {props.onCLick(tag)}} />
                    <Typography variant='body2'>{tag.percentage}%</Typography>
                </Box>
            )
        })}
    </Stack>
    )
}