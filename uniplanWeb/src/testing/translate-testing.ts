import { provideTranslateService, provideTranslateLoader, TranslateNoOpLoader } from '@ngx-translate/core';

export const translateTestingProviders = [
  provideTranslateService({ loader: provideTranslateLoader(TranslateNoOpLoader) }),
];
