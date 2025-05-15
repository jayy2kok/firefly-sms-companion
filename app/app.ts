import { Application } from '@nativescript/core';
// Register global date converter
import { dateConverterInstance } from './utils/date-converter';

Application.setResources({ dateConverter: dateConverterInstance });

Application.run({ moduleName: 'app-root' });