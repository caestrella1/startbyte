export const searchProviders = {
  duckduckgo: {
    name: 'DuckDuckGo',
    action: 'https://duckduckgo.com/',
    favicon: 'https://duckduckgo.com/favicon.ico',
    autocomplete: {
      url: 'https://ac.duckduckgo.com/ac/',
      params: (query) => `?q=${encodeURIComponent(query)}&type=list`,
      callback: 'autocompleteCallback',
      transform: (data) => Array.isArray(data) ? data[1] : []
    }
  },
  google: {
    name: 'Google',
    action: 'https://www.google.com/search',
    favicon: 'https://www.google.com/favicon.ico',
    autocomplete: {
      url: 'https://suggestqueries.google.com/complete/search',
      params: (query) => `?q=${encodeURIComponent(query)}&client=firefox`,
      callback: 'autocompleteCallback',
      transform: (data) => Array.isArray(data) ? data[1] : []
    }
  },
  bing: {
    name: 'Bing',
    action: 'https://www.bing.com/search',
    favicon: 'https://www.bing.com/favicon.ico',
    autocomplete: {
      url: 'https://api.bing.com/qsonhs.aspx',
      params: (query) => `?q=${encodeURIComponent(query)}`,
      callback: 'autocompleteCallback',
      transform: (data) => data?.AS?.Results?.[0]?.Suggests?.map(s => s.Txt) || []
    }
  }
};

export const getProviderInfo = (providerId) => searchProviders[providerId];

export const getProviderAutocompleteUrl = (providerId, query) => {
  const provider = searchProviders[providerId];
  return `${provider.autocomplete.url}${provider.autocomplete.params(query)}`;
};

export const transformSuggestions = (providerId, data) => {
  return searchProviders[providerId].autocomplete.transform(data);
};
