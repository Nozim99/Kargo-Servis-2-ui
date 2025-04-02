import {LoadingOutlined} from "@ant-design/icons";

export default function Loading({open, full}: { open?: boolean, full?: boolean }) {
    if (!open) return null;

    if (full) return <div
        className={"fixed z-40 inset-0 flex justify-center items-center bg-black/20 backdrop-blur-[2px]"}>
        <LoadingOutlined className={"scale-[3]"}/>
    </div>;

    return (
        <div className={"absolute z-40 inset-0 flex justify-center items-center bg-white/50 backdrop-blur-[2px]"}>
            <LoadingOutlined className={"scale-[3] text-[#3489E4]!"}/>
        </div>
    )
}