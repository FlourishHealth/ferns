import React, {ReactElement, useEffect, useRef, useState} from "react";

import {AddressInterface, OnChangeCallback} from "./Common";
import {GOOGLE_PLACES_API_RESTRICTIONS} from "./Constants";
import {TextField} from "./TextField";
import {processAddressComponents} from "./Utilities";

const loadGooglePlacesScript = (googleMapsApiKey: string, callbackName: any): Promise<void> => {
  return new Promise<void>((resolve, reject): undefined => {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve();
      return;
    }
    (window as any)[callbackName] = (): void => resolve();
    const script: HTMLScriptElement = document.createElement("script");

    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = (): any => reject(new Error("Google Maps script failed to load"));
    document.head.appendChild(script);
  });
};

export const WebAddressAutocomplete = ({
  disabled,
  googleMapsApiKey,
  inputValue,
  handleAddressChange,
  handleAutoCompleteChange,
}: {
  disabled?: boolean;
  googleMapsApiKey?: string;
  inputValue: string;
  handleAddressChange: OnChangeCallback;
  handleAutoCompleteChange: (value: AddressInterface) => void;
}): ReactElement => {
  const [scriptLoaded, setScriptLoaded] = useState(true);
  const autocompleteInputRef = useRef(null);

  useEffect(() => {
    const callbackName = "initAutocomplete";
    if (!googleMapsApiKey) {
      setScriptLoaded(false);
      return;
    }
    loadGooglePlacesScript(googleMapsApiKey, callbackName)
      .then(() => {
        const autocomplete = new window.google.maps.places.Autocomplete(
          autocompleteInputRef.current,
          {
            componentRestrictions: {country: GOOGLE_PLACES_API_RESTRICTIONS.components.country},
            fields: Object.values(GOOGLE_PLACES_API_RESTRICTIONS.fields),
          }
        );
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const addressComponents = place?.address_components;
          const formattedAddressObject = processAddressComponents(addressComponents);
          handleAutoCompleteChange(formattedAddressObject);
        });
      })
      .catch((error) => {
        console.warn(error);
        setScriptLoaded(false);
      });
    // Cleanup
    return () => {
      (window as any)[callbackName] = null;
    };
  }, [googleMapsApiKey, handleAutoCompleteChange]);

  return (
    <TextField
      disabled={disabled}
      inputRef={scriptLoaded ? (ref: any): void => (autocompleteInputRef.current = ref) : undefined}
      label="Street Address"
      placeholder="Enter an address"
      type="text"
      value={inputValue}
      onChange={({value}): void => {
        handleAddressChange({value});
      }}
    />
  );
};
