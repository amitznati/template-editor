import React from 'react';
import { Button, Grid, Tabs, Tab } from '@material-ui/core';
import { CoreText, RadioButtonsGroup, UploadedImageCard } from '../../../core';

export default function ImageTab({
  onSelect,
  dynamicImageOptions,
  selectedTheme,
  uploadedImages
}) {
  const [imageSrc, setImageSrc] = React.useState('');
  const [imageName, setImageName] = React.useState('');
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [themeImage, setThemeImage] = React.useState('');
  const dynamicOptions = dynamicImageOptions.map((o) => ({
    value: o,
    label: o
  }));
  // const handleChange = (event) => {
  //   if (event.target.files && event.target.files[0]) {
  //     // eslint-disable-next-line no-undef
  //     const FR = new FileReader();
  //     const iName = event.target.files[0].name;
  //     FR.addEventListener('load', (e) => {
  //       setImageSrc(e.target.result);
  //       setImageName(iName);
  //       setThemeImage('');
  //     });
  //     FR.readAsDataURL(event.target.files[0]);
  //   }
  // };

  const handleFromUrlChange = (url) => {
    setImageName(url);
    setImageSrc(url);
    setThemeImage('');
  };

  const handleThemeImageSelect = (themeImage) => {
    setImageSrc(selectedTheme.images[themeImage.split('-').pop()]);
    setImageName(themeImage);
    setThemeImage(themeImage);
  };

  const AddButton = () => (
    <div>
      <Button
        color='primary'
        disabled={!imageSrc}
        onClick={() =>
          onSelect({
            type: 'image',
            value: { src: imageSrc, themeImage }
          })
        }
      >
        ADD
      </Button>
    </div>
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <Tabs
          value={selectedTab}
          onChange={(e, value) => setSelectedTab(value)}
        >
          <Tab label='Uploaded Images' />
          <Tab label='From Url' />
          <Tab label='Theme images' />
        </Tabs>
      </Grid>
      {selectedTab === 0 && (
        <Grid container>
          {uploadedImages.map((tile) => (
            <Grid item xs={12} sm={6} md={3} key={tile.id}>
              <UploadedImageCard
                uploadedImage={tile}
                actionCallback={() =>
                  onSelect({
                    type: 'image',
                    value: { src: tile.url }
                  })
                }
              />
            </Grid>
          ))}
        </Grid>
        // <Grid item xs={3}>
        //    <input
        //     accept='image/*'
        //     id='contained-button-file'
        //     type='file'
        //     style={{ display: 'none' }}
        //     onChange={handleChange}
        //    />
        //    <label htmlFor='contained-button-file'>
        //     <Button variant='contained' color='primary' component='span'>
        //       Upload
        //     </Button>
        //    </label>
        // </Grid>
      )}
      {selectedTab === 1 && (
        <Grid item xs={3}>
          <CoreText
            label='From Url:'
            handleChange={handleFromUrlChange}
            value={imageName}
          />
          <AddButton />
        </Grid>
      )}
      {selectedTab === 2 && (
        <Grid item xs={12}>
          <RadioButtonsGroup
            value={imageName}
            onValueChange={handleThemeImageSelect}
            label='Dynamic theme image options'
            name='dynamicImage'
            options={dynamicOptions}
          />
          <AddButton />
        </Grid>
      )}
      <Grid item xs={9}>
        {imageSrc && <img src={imageSrc} alt='input file' />}
      </Grid>
    </Grid>
  );
}
