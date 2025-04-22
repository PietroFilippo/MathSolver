import 'react-i18next';
import { resources } from './index';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    resources: typeof resources;
    returnNull: false;
    returnEmptyString: false;
    allowObjectInHTMLChildren: true;
  }
} 