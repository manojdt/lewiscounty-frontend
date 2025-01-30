import React from 'react'

export const Button = (props) => {
    const { btnType = 'button', btnCategory = 'primary', btnName, btnCls = '', btnStyle = {}, ...rest } = props;
    let customStyle = { background: 'transparent', border: '1px solid rgba(24, 40, 61, 0.5)', ...btnStyle }
    if (btnCategory === 'primary') {
        customStyle = { background: 'linear-gradient(to right, #00AEBD, #1D5BBF)', border: 'none', ...btnStyle }
    }
    if (btnCategory === 'secondary') {
        customStyle = { border: '1px solid rgba(29, 91, 191, 1)', background: '#fff', color: 'rgba(29, 91, 191, 1)', ...btnStyle }
    }
    return (
        <button
            type={btnType}
            className={`inline-block rounded px-7 pb-3 pt-3 text-sm font-medium !ml-[15px]
                ${btnCategory === 'primary' ? 'text-white' : 'text-black'} ${btnCls}`}
            data-twe-ripple-init
            data-twe-ripple-color="light"
            style={customStyle}
            {...rest}
        >
            {btnName}
        </button>
    )
}