import { ReactNode, Suspense } from "react";
import PageLoading from "./pageLoading";

type LazyPageProps = {
  children: ReactNode;
};

export const LazyPage = ({ children }: LazyPageProps) => {
  return <Suspense fallback={<PageLoading />}>{children}</Suspense>;
};
