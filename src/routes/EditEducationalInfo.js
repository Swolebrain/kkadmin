import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Fab from "@material-ui/core/Fab/Fab";
import Button from "@material-ui/core/Button/Button";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Grid from "@material-ui/core/Grid/Grid";


export default function EditEducationalInfo({formKeys, labels, values, segmentType, handleTextChange, addNewParagraph, deleteParagraph, handleFormSubmit}){
    return (
        <React.Fragment>
            <div>
                {
                    formKeys.map((attr, attrIdx) =>{
                        return  (
                            <React.Fragment key={attr}>
                                <h3>{labels[attrIdx]} ({segmentType})</h3>
                                {
                                    values[attr].map((paragraph, pIdx) => (
                                        <Grid container direction={'row'} alignItems={'flex-end'}>
                                            <Grid item xs={10} className={"form-container"}>
                                                <TextField
                                                    key={`${attr}-${pIdx}`}
                                                    value={values[attr][pIdx]}
                                                    onChange={handleTextChange(segmentType, attr, pIdx)}
                                                    multiline
                                                    id={`${attr}-${pIdx}`}
                                                    label={labels[attrIdx] + ' paragraph ' + (pIdx+1)}
                                                    margin="normal"
                                                />
                                            </Grid>
                                            <Grid item xs={2} style={{textAlign: 'center', paddingBottom: 10}}>
                                                <Fab onClick={deleteParagraph(segmentType, attr, pIdx)} variant={'extended'} color={'disabled'} size={'small'}>x</Fab>
                                            </Grid>
                                        </Grid>
                                    ))
                                }
                                <Fab color='primary' size='small' onClick={addNewParagraph(segmentType, attr)} >+</Fab>
                            </React.Fragment>
                        );
                    })
                }
            </div>
            <Button style={{marginTop: 16}} variant={"contained"} color={'primary'} onClick={handleFormSubmit(segmentType)}>Save Changes</Button>
        </React.Fragment>
    )
}
