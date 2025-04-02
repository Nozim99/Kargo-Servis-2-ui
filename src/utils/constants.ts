import {SelectProps} from "antd";
import {TFunction} from "i18next";

// export const BASE_URL = "http://localhost:7010/api/v1"
export const BASE_URL = import.meta.env.VITE_API_URL

export enum BoxStatus {
    readyToInvocie = 'ReadyToInvocie',
    ready = 'Ready'
}

export enum PartyStatus {
    COLLECTING = 'collecting',
    ON_THE_WAY = 'on_the_way',
    ON_CUSTOMS = 'on_customs',
    LOCAL_ON_THE_WAY = 'local_on_the_way',
    SHIPMENT_ON_CUSTOMERS = 'shipment_on_customers'
}

export const partyStatusOptionsLng = (t: TFunction<"translation", undefined>): SelectProps['options'] => {
    return [
        {value: 'collecting', label: t('collecting')},
        {value: 'on_the_way', label: t('on_the_way')},
        {value: 'on_customs', label: t('on_customs')},
        {value: "local_on_the_way", label: t("local_on_the_way")},
        {value: "shipment_on_customers", label: t("shipment_on_customers")},
    ]
}

export const BoxValues = {
    [BoxStatus.readyToInvocie]: "Hisob Fakturaga tayor",
    [BoxStatus.ready]: "Tayyor"
}

export enum PacketStatus {
    readyToInvocie = 'ReadyToInvocie',
    ready = 'Ready'
}

export const PacketValues = {
    [BoxStatus.readyToInvocie]: PacketStatus.readyToInvocie,
    [BoxStatus.ready]: PacketStatus.ready
}
