import React from 'react';
import {
  TemplateEditorModal,
  TemplatePreviewForProduct,
  Button,
  Container,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  makeStyles
} from 'template-editor';
import 'template-editor/dist/index.css';

const sizeFields = [
  { label: 'Width', source: 'size.width' },
  { label: 'Height', source: 'size.height' },
  { label: 'Template Frame Width', source: 'templateFrame.width' },
  { label: 'Template Frame Height', source: 'templateFrame.height' },
  { label: 'Template Frame X', source: 'templateFrame.x' },
  { label: 'Template Frame Y', source: 'templateFrame.y' }
];
const useStyles = makeStyles({
  container: {
    marginTop: '20rem'
  }
});

export const getPX = (cm, scale) => {
  const s = scale || 1;
  return Number((cm * s * (96 / 2.54)).toFixed(3));
};
export const getCM = (px, scale) => {
  const s = scale || 1;
  return Number((px / s / (96 / 2.54)).toFixed(3));
};

const convertPX = (isPX, source) => {
  if (!source) {
    return;
  }
  return isPX ? getPX(source) : getCM(source);
};

const ProductPreview = ({ imageSrc, sizeState, isPX }) => {
  const convertedSizeState = {};
  Object.keys(sizeState).forEach((sName) => {
    if (isPX) {
      convertedSizeState[sName] = getCM(sizeState[sName]);
    } else {
      convertedSizeState[sName] = sizeState[sName];
    }
  });
  const product = {
    id: 1,
    name: 'temp product',
    imageUrl: imageSrc,
    size: {
      height: convertedSizeState['size.height'] || 0,
      width: convertedSizeState['size.width'] || 0
    },
    templateFrame: {
      height: convertedSizeState['templateFrame.height'] || 0,
      width: convertedSizeState['templateFrame.width'] || 0,
      x: convertedSizeState['templateFrame.x'] || 0,
      y: convertedSizeState['templateFrame.y'] || 0
    }
  };
  return (
    <div style={{ paddingTop: '4rem' }}>
      <TemplatePreviewForProduct product={product} initiateScale={1} />
    </div>
  );
};

const App = () => {
  const [open, setOpen] = React.useState(false);
  const [isPX, setIsPX] = React.useState(false);
  const initialSizeState = {};
  sizeFields.forEach((sf) => {
    initialSizeState[sf.source] = 0;
  });
  const [sizeState, setSizeState] = React.useState(initialSizeState);
  const [imageSrc, setImageSrc] = React.useState(null);
  const onSizeChange = (v, name) => {
    setSizeState({ ...sizeState, [name]: v });
  };
  const onImageChanged = (e) => {
    // eslint-disable-next-line no-undef
    const reader = new FileReader();
    reader.addEventListener('loadend', function () {
      const fileContent = reader.result;
      setImageSrc(fileContent);
    });
    reader.readAsDataURL(e.target.files[0]);
  };
  const classes = useStyles();
  const onSaveTemplate = (template) => {
    console.log('template: ', template);
  };
  const onClose = () => setOpen(false);
  const onOpenDialog = () => {
    const missingFields = sizeFields.some((sf) => isNaN(sizeState[sf.source]));
    if (!missingFields) {
      setOpen(true);
    }
  };
  const onPXChange = () => {
    // const newSizeState = {};
    // Object.keys(sizeState).forEach(
    //   (ss) => (newSizeState[ss] = convertPX(!isPX, sizeState[ss]))
    // );
    // setSizeState(newSizeState);
    setIsPX(!isPX);
  };
  return (
    <Container className={classes.container}>
      <Grid container>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={isPX}
                onChange={onPXChange}
                name='isPX'
                color='primary'
              />
            }
            label='is PX (off = in CM)'
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            {sizeFields.map((field) => (
              <Grid key={field.source} item xs={4}>
                <TextField
                  label={field.label}
                  onChange={(e) => onSizeChange(e.target.value, field.source)}
                  type='number'
                  required
                  value={sizeState[field.source]}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={4}>
              <input type='file' accept='image/*' onChange={onImageChanged} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <ProductPreview
            {...{
              isPX,
              imageSrc,
              sizeState
            }}
          />
        </Grid>
      </Grid>
      <Button onClick={onOpenDialog}>Open template editor dialog</Button>
      <TemplateEditorModal
        onSaveTemplate={onSaveTemplate}
        onClose={onClose}
        open={open}
        initialData={{
          dynamicImageOptions: ['background', 'frame', 'side'],
          dynamicColorOptions: ['primary', 'secondary', 'tertiary'],
          dynamicFontOptions: ['primary', 'secondary', 'tertiary'],
          product: {
            id: 1,
            name: 'temp product',
            imageUrl: imageSrc,
            size: {
              height: sizeState['size.height'] || 0,
              width: sizeState['size.width'] || 0
            },
            templateFrame: {
              height: sizeState['templateFrame.height'] || 0,
              width: sizeState['templateFrame.width'] || 0,
              x: sizeState['templateFrame.x'] || 0,
              y: sizeState['templateFrame.y'] || 0
            }
          },
          uploadedFonts: [],
          uploadedImages: [],
          template: { templateGradients: [], templateFilters: [], layouts: [] },
          selectedTheme: undefined,
          selectedLogo: undefined,
          googleFontAPIKey: process.env.REACT_APP_googleFontAPIKey
        }}
      />
    </Container>
  );
};

export default App;
