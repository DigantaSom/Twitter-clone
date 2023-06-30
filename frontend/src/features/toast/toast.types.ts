export interface ToastState {
  type: '' | 'bookmark-add' | 'bookmark-remove' | 'copy-to-clipboard'; // more can be added later, if needed
  message: string;
}
