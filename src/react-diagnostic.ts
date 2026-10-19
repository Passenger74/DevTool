// Archivo de diagnóstico para verificar imports de React
import React from 'react';
import { useState, useEffect, createContext } from 'react';

console.log('✅ React importado correctamente:', typeof React);
console.log('✅ useState disponible:', typeof useState);
console.log('✅ useEffect disponible:', typeof useEffect);
console.log('✅ createContext disponible:', typeof createContext);

// Verificar que React no sea null
if (React === null || React === undefined) {
  console.error('❌ ERROR: React es null o undefined');
} else {
  console.log('✅ React está disponible correctamente');
}

// Verificar hooks
if (typeof useState !== 'function') {
  console.error('❌ ERROR: useState no es una función');
} else {
  console.log('✅ useState es una función válida');
}

export { React, useState, useEffect, createContext };
