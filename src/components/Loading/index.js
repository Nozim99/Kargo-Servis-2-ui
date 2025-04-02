import { jsx as _jsx } from "react/jsx-runtime";
import { LoadingOutlined } from "@ant-design/icons";
export default function Loading({ open, full }) {
    if (!open)
        return null;
    if (full)
        return _jsx("div", { className: "fixed z-40 inset-0 flex justify-center items-center bg-black/20 backdrop-blur-[2px]", children: _jsx(LoadingOutlined, { className: "scale-[3]" }) });
    return (_jsx("div", { className: "absolute z-40 inset-0 flex justify-center items-center bg-white/50 backdrop-blur-[2px]", children: _jsx(LoadingOutlined, { className: "scale-[3] text-[#3489E4]!" }) }));
}
