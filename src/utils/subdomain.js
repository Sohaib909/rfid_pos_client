// utils/subdomain.js

// Utility function to get the subdomain from the current URL
export function getSubdomain() {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Assuming the domain has a structure like subdomain.example.com
  // if (parts.length >= 3) {
  return parts[0]; // The subdomain is the first part
  // }
  // return null; // No subdomain found
}

// Utility function to get the axios configuration with the subdomain in headers
export function getSubdomainConfig() {
  const subdomain = getSubdomain();

  // If subdomain exists, add it to the request headers
  return {
    headers: {
      'X-Subdomain': subdomain || '',
    },
  };
}
