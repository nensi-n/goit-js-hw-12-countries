import countriesApi from './js/fetchCountries';
import countryTpl from './templates/country-card.hbs';
import countriesTpl from './templates/list-countries.hbs';
import getRefs from './js/get-refs';

import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
const refs = getRefs();
const debounce = require('lodash.debounce');
let foundedCountry = '';

refs.input.addEventListener(
  'input',
  debounce(() => {
    onSearch();
  }, 500),
);

function onSearch() {
  resetSearch();
  foundedCountry = refs.input.value;
  countriesApi(foundedCountry)
    .then(renderMarkup)
    .catch(err => console.log(err));
}

function resetSearch() {
  refs.countriesContainer.innerHTML = '';
}

function renderMarkup(countries) {
  if (countries.length === 1) {
    resetSearch();
    markupContries(countryTpl, countries);
  } else if (countries.length > 1 && countries.length < 10) {
    resetSearch();
    markupContries(countriesTpl, countries);
  } else if (countries.length >= 10) {
    resultMessage(
      error,
      'To many matches found. Please enter a more specific query!',
    );
  } else {
    resultMessage(info, 'No matches found!');
  }
}

function resultMessage(typeInfo, textInfo) {
  typeInfo({
    text: `${textInfo}`,
    delay: 1000,
    closerHover: true,
  });
}

function markupContries(tpl, countries) {
  refs.countriesContainer.insertAdjacentHTML('beforeend', tpl(countries));
}