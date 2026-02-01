import { Toolbar } from 'ngx-editor';

export const toolbar: Toolbar = [
  // default value
  ['bold', 'italic'],
  ['underline', 'strike'],
  ['blockquote'],
  ['ordered_list', 'bullet_list'],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ['align_left', 'align_center', 'align_right', 'align_justify'],
];
