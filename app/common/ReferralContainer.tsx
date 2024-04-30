import { Referral, ReferralProvider } from '@orderly.network/referral';
import { useRouter } from 'next/navigation';


const ReferralContainer: React.FC = (props) => {

    const router = useRouter();

    return (
        <ReferralProvider
                becomeAnAffiliateUrl="https://orderly.network"
                learnAffiliateUrl="https://orderly.network"
                referralLinkUrl="https://orderly.network"
                bindReferralCodeState={(isSuccess, error, hide, params) => {
                    if (isSuccess) {
                        // push to dashboard page
                        router.push(getFullPath("/referral/dashboard", params));
                    }
                    hide();
                }}
                showReferralPage={() => {
                    // push to referral page
                    router.push("/referral");
                }}
                onEnterAffiliatePage={(params) => {
                    // push to dashboard page
                    router.push(getFullPath("/referral/dashboard", params));
                }}
                onEnterTraderPage={(params) => {
                    // push to dashboard page
                    router.push(getFullPath("/referral/dashboard", params));
                }}
            >
                {props.children}
            </ReferralProvider>
    );
}

export default ReferralContainer;

export function getFullPath(path: string, params: any) {
    const searchParams = new URLSearchParams(params || {});
    const queryString = searchParams.toString();
    const fullPath = queryString.length > 0 ? `${path}?${queryString}` : path;
    return fullPath;
}