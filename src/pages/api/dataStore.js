// dataStore.js
let patientDataStore = [];

export const savePatientData = (data) => {
  patientDataStore.push(data);
};

export const getLatestPatientData = () => {
  return patientDataStore.length > 0 ? patientDataStore[patientDataStore.length - 1] : null;
};

export const getAllPatientData = () => {
  return patientDataStore;
};
