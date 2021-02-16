import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    margin: '0.5rem'
  },
  imageWrap: {
    height: '15rem',
    position: 'relative'
    // backgroundImage: 'linear-gradient(#00000063, #00000012);'
  },
  image: {
    maxHeight: '13rem',
    maxWidth: '13rem',
    transform: 'translate(-50%, -40%)',
    top: '40%',
    left: '50%',
    position: 'absolute'
  }
});

export default function UploadedImageCard({
  uploadedImage,
  actionHref,
  actionCallback
}) {
  const classes = useStyles();
  const actionProps = {};
  if (actionHref) {
    actionProps.href = actionHref;
  } else if (actionCallback) {
    actionProps.onClick = actionCallback;
  }
  return (
    <Card className={classes.root}>
      <CardActionArea {...actionProps}>
        <CardContent>
          <div className={classes.imageWrap}>
            <img
              src={uploadedImage.url}
              alt={uploadedImage.name}
              className={classes.image}
            />
          </div>
          <Typography gutterBottom variant='h5' component='h2'>
            {uploadedImage.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
