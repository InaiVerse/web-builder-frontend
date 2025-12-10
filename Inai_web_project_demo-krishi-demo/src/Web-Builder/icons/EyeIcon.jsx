const EyeIcon = ({ className = "", stroke = "#333333", isVisible = true }) => {
    if (isVisible) {
        // Eye open icon (simplified - you can add the full visible eye SVG if needed)
        return (
            <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                <path
                    d="M0.953467 8.25C1.89131 6.76501 4.68287 3.01099 8.93703 3.01099C13.1912 3.01099 15.9828 6.76501 16.9206 8.25C15.9828 9.73499 13.1912 13.489 8.93703 13.489C4.68287 13.489 1.89131 9.73499 0.953467 8.25Z"
                    stroke={stroke}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M8.93703 10.75C10.3177 10.75 11.437 9.63071 11.437 8.25C11.437 6.86929 10.3177 5.75 8.93703 5.75C7.55632 5.75 6.43703 6.86929 6.43703 8.25C6.43703 9.63071 7.55632 10.75 8.93703 10.75Z"
                    stroke={stroke}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    // Eye closed/hidden icon
    return (
        <svg
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M7.90558 2.4936C8.24425 2.44353 8.59363 2.41667 8.95347 2.41667C13.2076 2.41667 15.9992 6.1707 16.937 7.65569C17.0505 7.83542 17.1073 7.92528 17.1391 8.06389C17.1629 8.16799 17.1629 8.33222 17.139 8.43631C17.1072 8.57492 17.0501 8.66538 16.9358 8.84631C16.6859 9.24179 16.3049 9.79759 15.8002 10.4004M4.55673 3.84586C2.755 5.06808 1.53183 6.76615 0.970713 7.6544C0.856696 7.83489 0.799687 7.92514 0.767908 8.06373C0.744039 8.16783 0.74403 8.33203 0.767886 8.43613C0.79965 8.57473 0.856401 8.66459 0.969903 8.84432C1.90774 10.3293 4.6993 14.0833 8.95347 14.0833C10.6688 14.0833 12.1464 13.473 13.3605 12.6472M1.45347 0.75L16.4535 15.75M7.1857 6.48223C6.73329 6.93464 6.45347 7.55964 6.45347 8.25C6.45347 9.63071 7.57276 10.75 8.95347 10.75C9.64383 10.75 10.2688 10.4702 10.7212 10.0178"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default EyeIcon;
