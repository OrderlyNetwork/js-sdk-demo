import { Dialog, DialogContent, DialogTrigger, DialogBody, Divider, cn, toast } from "@orderly.network/react";
import { useAccount, useMutation, usePrivateQuery } from "@orderly.network/hooks";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
export const APIKey = () => {

    const { account } = useAccount();
    const [open, setOpen] = useState(false);
    const [apiKey, setApiKey] = useState("");


    const walletAddress = useMemo(() => {
        return account?.keyStore?.getAddress() || "";
    }, [account]);
    const accountId = useMemo(() => {
        const address = account?.keyStore?.getAddress();
        if (address) {
            return account?.keyStore?.getAccountId(address) || "";
        }
        return "";
    }, [account]);

    useEffect(() => {
        const address = account?.keyStore?.getAddress();
        if (address) {
            account?.keyStore?.getOrderlyKey()?.getPublicKey()
                .then((value) => {
                    setApiKey(value);
                })
                .catch((e) => { });
        }

    }, [account]);

    const apiSecretKey = useMemo(() => {
        const secretKey = account?.keyStore?.getOrderlyKey()?.secretKey || "";
        if (secretKey.length > 0) {
            return "ed25519:" + secretKey;
        }
        return secretKey;
    }, [account]);

    return (
        <>
            <Divider />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <div className="orderly-mt-3 orderly-flex orderly-h-[40px] orderly-items-center orderly-text-base-contrast-54 hover:orderly-text-base-contrast orderly-fill-white/20 hover:orderly-fill-white/80 hover:orderly-cursor-pointer">
                        <KeyIcon />

                        <div className="orderly-text-xs orderly-ml-2">API keys</div>
                    </div>
                </DialogTrigger>
                <DialogContent
                    className="orderly-w-[400px] orderly-h-[533px] orderly-px-5 orderly-bg-base-800"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="orderly-flex orderly-justify-between">

                        API trading keys
                        <CloseIcon setOpen={setOpen} />
                    </div>
                    <Divider className="orderly-h-[1px]" />
                    <DialogBody className="orderly-text-xs orderly-text-base-contrast-54 orderly-w-[360px] orderly-h-full orderly-p-0 orderly-relative">
                        <div className="orderly-mt-5">
                            Do not disclose your API keys to to anyone to avoid asset losses in your wallet.
                        </div>


                        <div className="orderly-mt-5">Wallet address</div>
                        <CopyText text={walletAddress} />

                        <div className="orderly-mt-5">Account</div>
                        <CopyText text={accountId} />


                        <div className="orderly-mt-5">Orderly API key</div>
                        <CopyText text={apiKey} />


                        <div className="orderly-mt-5">Orderly API secret</div>
                        <CopyText text={apiSecretKey} />

                        <RestrictIp apiKey={apiKey} />
                    </DialogBody>


                </DialogContent>
            </Dialog>
        </>
    );
}

const CopyText: FC<{ text: string }> = (props) => {
    const { text } = props;

    // 点击复制图标的事件处理函数
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        toast.success("Copied");
    };

    return (
        <div className="">
            <span className="orderly-whitespace-pre-wrap orderly-break-all">{text}</span>
            <span
                onClick={handleCopy}
                className="orderly-ml-2 focus:orderly-outline-none"
            >
                <CopyIcon />
            </span>
        </div>
    );
}

const RestrictIp: FC<{ apiKey: string }> = (props) => {

    const { apiKey } = props;

    const { data, error, mutate } = usePrivateQuery<any>("/v1/client/orderly_key_ip_restriction" + `?orderly_key=${apiKey}`);
    const [setRestrictIpApi] = useMutation("/v1/client/set_orderly_key_ip_restriction");
    const [edit, setEdit] = useState(false);
    const [ip, setIp] = useState("");

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (edit) {

            inputRef?.current?.focus();
            const valueLength = inputRef?.current?.value.length;
            if (valueLength) {
                inputRef?.current?.setSelectionRange(valueLength, valueLength);
            }
        }
    }, [edit, inputRef]);

    const setRestrictIP = useCallback(() => {
        setRestrictIpApi({
            orderly_key: apiKey,
            ip_restriction_list: ip
        }).then((data) => {
            setEdit(false);
            mutate({ ip_restriction_list: ip });
        }).catch((error) => {
            toast.error(error?.message || error);
        })
    }, [apiKey, ip]);


    const ipList = useMemo(() => {
        if (!data) return "-";

        if (typeof data === "string") {
            return "-";
        }

        if ("ip_restriction_list" in data) {

            if (Array.isArray(data.ip_restriction_list)) {
                const ipList = data.ip_restriction_list.join(",");
                setIp(ipList);
                return ipList;
            } else {
                setIp(data.ip_restriction_list);
                return data.ip_restriction_list;
            }

        }

        return "-";
    }, [data]);




    if (!edit) {
        return (
            <div className="orderly-mt-5 orderly-h-[48px]">
                <div >Restrict IP</div>
                <div className="orderly-flex">
                    <span className="orderly-max-w-[332px] orderly-truncate">{ipList}</span>
                    <span className="orderly-ml-2" onClick={(e) => {
                        e.stopPropagation();
                        setEdit(true);
                    }}><EditIcon /></span>
                </div>
            </div>
        );
    }

    return (
        <div className="orderly-mt-5 orderly-h-[48px] orderly-flex orderly-items-center orderly-text-base-contrast-36">
            <input
                ref={inputRef}
                className="orderly-flex-1 orderly-h-full orderly-rounded-lg orderly-bg-base-700 focus-visible:orderly-outline-none orderly-px-2 orderly-text-base-contrast"
                value={ip}
                onChange={(e) => {
                    setIp(e.target.value);
                }}
            ></input>
            <button className="orderly-text-xs orderly-ml-3 hover:orderly-text-base-contrast-54" onClick={(e) => {
                e.stopPropagation();
                setEdit(false);

            }}>Cancel</button>
            <button
                disabled={ip.length <= 0} className={cn(
                    "orderly-text-xs orderly-ml-3",
                    ip.length > 0 && "orderly-text-primary hover:orderly-text-primary/80",
                )} onClick={(e) => {
                    e.stopPropagation();
                    setRestrictIP();
                }}>Save</button>
        </div>
    );
}

export const KeyIcon = () => {

    return (<svg width="24" height="24" viewBox="0 0 24 24" fill-opacity="1" xmlns="http://www.w3.org/2000/svg" className=" orderly-inline-block">
        <path d="M22.0431 15.457L20.6291 14.043L18.1291 16.715L16.9831 15.569L19.0441 13.508L17.63 12.094L15.5691 14.155L12.2101 10.796L12.5151 10.159C13.4261 8.25 13.0351 5.964 11.5431 4.472C9.59105 2.52 6.41905 2.52 4.47005 4.47C2.52105 6.419 2.52105 9.592 4.47005 11.541C5.96205 13.033 8.24805 13.424 10.1571 12.513L10.7941 12.208L19.5431 20.957L20.9571 19.543L19.5431 18.129L22.0431 15.457ZM10.1271 10.127C8.95705 11.297 7.05405 11.297 5.88405 10.127C4.71405 8.957 4.71405 7.054 5.88405 5.884C7.05405 4.714 8.95705 4.714 10.1271 5.884C11.2961 7.054 11.2961 8.957 10.1271 10.127Z" />
    </svg>
    );
}

export const CopyIcon = () => {

    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="white" fill-opacity="1.0" xmlns="http://www.w3.org/2000/svg" className="orderly-inline orderly-fill-base-contrast-36 hover:orderly-fill-white/80 hover:orderly-cursor-pointer">
            <mask id="mask0_5234_16522" style={{ mask: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
                <rect width="16" height="16" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_5234_16522)">
                <path d="M5.9999 12C5.6699 12 5.3874 11.8825 5.1524 11.6475C4.9174 11.4125 4.7999 11.13 4.7999 10.8V2.80002C4.7999 2.47002 4.9174 2.18752 5.1524 1.95252C5.3874 1.71752 5.6699 1.60002 5.9999 1.60002H12.3999C12.7299 1.60002 13.0124 1.71752 13.2474 1.95252C13.4824 2.18752 13.5999 2.47002 13.5999 2.80002V10.8C13.5999 11.13 13.4824 11.4125 13.2474 11.6475C13.0124 11.8825 12.7299 12 12.3999 12H5.9999ZM3.5999 14.4C3.2699 14.4 2.9874 14.2825 2.7524 14.0475C2.5174 13.8125 2.3999 13.53 2.3999 13.2V4.00002H3.5999V13.2H11.1999V14.4H3.5999Z" />
            </g>
        </svg>

    );
}


export const EditIcon = () => {

    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="white" fill-opacity="1" xmlns="http://www.w3.org/2000/svg" className="orderly-inline orderly-fill-base-contrast-36 hover:orderly-fill-white/80 hover:orderly-cursor-pointer">
            <mask id="mask0_5241_16697" style={{ mask: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                <rect width="20" height="20" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_5241_16697)">
                <path d="M4.16667 15.8333H5.35417L13.5 7.6875L12.3125 6.5L4.16667 14.6458V15.8333ZM2.5 17.5V13.9583L13.5 2.97917C13.6667 2.82639 13.8507 2.70833 14.0521 2.625C14.2535 2.54167 14.4653 2.5 14.6875 2.5C14.9097 2.5 15.125 2.54167 15.3333 2.625C15.5417 2.70833 15.7222 2.83333 15.875 3L17.0208 4.16667C17.1875 4.31944 17.309 4.5 17.3854 4.70833C17.4618 4.91667 17.5 5.125 17.5 5.33333C17.5 5.55556 17.4618 5.76736 17.3854 5.96875C17.309 6.17014 17.1875 6.35417 17.0208 6.52083L6.04167 17.5H2.5ZM12.8958 7.10417L12.3125 6.5L13.5 7.6875L12.8958 7.10417Z" />
            </g>
        </svg>


    );
}


export const CloseIcon: FC<{ setOpen: any }> = (props) => {

    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="orderly-inline orderly-fill-base-contrast-54 hover:orderly-fill-white/80 hover:orderly-cursor-pointer"
            onClick={() => props.setOpen(false)}
        >
            <path d="M5.72502 6.96248L1.75 10.9375L2.98744 12.1749L6.96246 8.19992L10.9375 12.175L12.1749 10.9375L8.19989 6.96248L12.1749 2.98744L10.9375 1.75L6.96246 5.72504L2.98744 1.75003L1.75 2.98746L5.72502 6.96248Z" />
        </svg>


    );
}

