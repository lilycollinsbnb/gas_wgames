import React from 'react';
import Head from 'next/head';

interface SeoDataProps {
  jsonLdData: any;
  jsonSchemaData: any;
}

const SeoData = ({ jsonLdData, jsonSchemaData }: SeoDataProps) => {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonSchemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
    </Head>
  );
};

export default SeoData;
