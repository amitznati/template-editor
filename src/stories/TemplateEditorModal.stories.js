import React from 'react';
import { TemplateEditorModal } from '../index';

import { Button } from '@material-ui/core';
import bagImage from './paper_bag_bround.png';
export default {
  title: 'TemplateEditorModal',
  component: TemplateEditorModal
};
const dynamicImageOptions = [
  'bgWide',
  'bg',
  'frameWide',
  'frame',
  'sideWide',
  'side',
  'cornerWide',
  'corner'
];

const dynamicColorOptions = [
  'text-Primary',
  'text-Secondary',
  'text-Tertiary',
  'bg-Primary',
  'bg-Secondary',
  'bg-Tertiary'
];

const dynamicFontOptions = ['Primary', 'Secondary', 'Tertiary'];

export const EditTemplateDialog = () => {
  const [open, setOpen] = React.useState(false);
  const uploadedFonts = [];
  const uploadedImages = [];
  const product = {
    name: 'Bag',
    imageUrl: bagImage,
    size: {
      height: 30,
      width: 20
    },
    templateFrame: {
      height: 17,
      width: 18,
      x: 1,
      y: 1
    },
    dynamicTextOptions: ['Brand Name', 'Brand Slogan']
  };
  const dynamicTextValues = {
    'Brand Name': 'Brant-It'
  };
  return (
    <div>
      <Button variant='outlined' color='primary' onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <TemplateEditorModal
        onSaveTemplate={console.log}
        onClose={() => setOpen(false)}
        open={open}
        initialData={{
          dynamicImageOptions,
          dynamicColorOptions,
          dynamicFontOptions,
          product,
          uploadedFonts,
          uploadedImages,
          dynamicTextValues,
          googleFontAPIKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }}
      />
    </div>
  );
};
