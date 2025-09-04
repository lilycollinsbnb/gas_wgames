import { LegalContent } from "@/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { API_ENDPOINTS } from "./client/endpoints";
import client from "./client";

export function useLegalContent(content_type: string) {
    const { locale } = useRouter();

  
    const { data, isLoading, error } = useQuery<LegalContent, Error>(
      [API_ENDPOINTS.LEGAL_CONTENT, {locale, content_type}],
      () => client.legalContent.getByType({content_type, language: locale ?? 'en'})
      )
    return {
      content: data?.content ?? '',
      isLoading,
      error,
    };
  }
  