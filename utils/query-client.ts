import { QueryClient } from '@tanstack/react-query'

/** For working with react-query */
export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {        
        staleTime: Infinity,
      },
    },
});
