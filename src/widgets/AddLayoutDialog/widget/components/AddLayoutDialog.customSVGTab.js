import React from 'react';
import { Button, Grid } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  textarea: {
    backgroundColor: '#111',
    color: '#FFF'
  }
});

export default function CustomSVGTab({ onSelect, addText = 'ADD', src = '' }) {
  const [value, setValue] = React.useState(src);
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <p>SVG</p>
        <div className={classes.textarea}>
          <Editor
            value={value}
            onValueChange={setValue}
            highlight={(code) => highlight(code, languages.svg, 'svg')}
            padding={10}
          />
        </div>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant='outlined'
          color='primary'
          disabled={!value}
          onClick={() => onSelect({ type: 'customSVG', value })}
        >
          {addText}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <svg>
          <g dangerouslySetInnerHTML={{ __html: value }} />
        </svg>
      </Grid>
    </Grid>
  );
}
